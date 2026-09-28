<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import {
    EditorState,
    Annotation,
    countColumn,
    type StateEffect,
} from "@codemirror/state";
import {
    EditorView,
    ViewPlugin,
    Decoration,
    type ViewUpdate,
} from "@codemirror/view";
import { basicSetup } from "codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import {
    HighlightStyle,
    syntaxHighlighting,
    foldedRanges,
    unfoldEffect,
} from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import "./style.css";

defineOptions({ name: "Json4uEditor" });

const props = withDefaults(
    defineProps<{
        /** JSON 文本 */
        modelValue?: string;
    }>(),
    { modelValue: "" },
);
const emit = defineEmits<{
    "update:modelValue": [value: string];
    cursor: [pos: number];
}>();

const host = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;
const External = Annotation.define<boolean>(); // 标记由外部（props）触发的修改，避免回环

const highlight = HighlightStyle.define([
    { tag: t.propertyName, color: "var(--j4u-key, #8250df)" },
    { tag: t.string, color: "var(--j4u-str)" },
    { tag: t.number, color: "var(--j4u-num)" },
    { tag: t.bool, color: "var(--j4u-bool)" },
    { tag: t.null, color: "var(--j4u-null)", fontStyle: "italic" },
    {
        tag: [t.brace, t.squareBracket, t.separator, t.punctuation],
        color: "var(--j4u-muted)",
    },
]);

function detectUnit(doc: any) {
    // 取前 200 行里最小的非零缩进作为一级缩进宽度（2 或 4 空格）
    let u = 0;
    for (let i = 1; i <= Math.min(doc.lines, 200); i++) {
        const m = /^ +/.exec(doc.line(i).text);
        if (m && (u === 0 || m[0].length < u)) u = m[0].length;
    }
    return u || 2;
}

function buildGuides(view: any) {
    const { doc } = view.state;
    const tab = view.state.tabSize;
    const unit = detectUnit(doc);
    const out = [];
    for (const { from, to } of view.visibleRanges) {
        for (let pos = from; pos <= to;) {
            const line = doc.lineAt(pos);
            const m: any = /^[ \t]*/.exec(line.text);
            const n = countColumn(m[0], tab); // 前导缩进列数
            out.push(
                Decoration.line({
                    attributes: {
                        class: "cm-indent-guides",
                        // --n 缩进列数，--u 一级缩进宽度，--h 折行后的悬挂缩进（多缩进一级）
                        style: `--n:${n};--u:${unit};--h:${n + unit}`,
                    },
                }).range(line.from),
            );
            pos = line.to + 1;
        }
    }
    return Decoration.set(out, true);
}

const indentGuides = ViewPlugin.fromClass(
    class {
        decorations: any;
        constructor(view: any) {
            this.decorations = buildGuides(view);
        }
        update(u: { docChanged: any; viewportChanged: any; view: any }) {
            if (u.docChanged || u.viewportChanged)
                this.decorations = buildGuides(u.view);
        }
    },
    { decorations: (v) => v.decorations },
);

const theme = EditorView.theme({
    "&": {
        height: "100%",
        color: "var(--j4u-text)",
        backgroundColor: "var(--j4u-bg)",
        fontSize: "12.5px",
    },
    "&.cm-focused": { outline: "none" },
    ".cm-scroller": {
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        lineHeight: "1.55",
    },
    ".cm-content": { caretColor: "var(--j4u-text)", padding: "0" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--j4u-text)" },
    ".cm-gutters": {
        backgroundColor: "var(--j4u-panel)",
        color: "var(--j4u-muted)",
        border: "none",
        // borderRight: "1px solid var(--j4u-border)",
    },
    ".cm-activeLine": {
        backgroundColor:
            "color-mix(in srgb, var(--j4u-accent) 10%, transparent)",
    },
    ".cm-activeLineGutter": {
        backgroundColor: "transparent",
        color: "var(--j4u-text)",
    },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground":
        {
            backgroundColor:
                "color-mix(in srgb, var(--j4u-accent) 28%, transparent)",
        },
    ".cm-foldGutter .cm-gutterElement": { cursor: "pointer", padding: "0 4px" },
    ".cm-foldGutter .cm-gutterElement:hover": { color: "var(--j4u-accent)" },
    ".cm-foldPlaceholder": {
        backgroundColor: "var(--j4u-panel)",
        border: "1px solid var(--j4u-border)",
        color: "var(--j4u-muted)",
        padding: "0 6px",
        borderRadius: "3px",
    },
    ".cm-matchingBracket": {
        backgroundColor:
            "color-mix(in srgb, var(--j4u-accent) 22%, transparent)",
        outline: "none",
    },
    ".cm-tooltip": {
        backgroundColor: "var(--j4u-panel)",
        color: "var(--j4u-text)",
        border: "1px solid var(--j4u-border)",
    },
    ".cm-panels": {
        backgroundColor: "var(--j4u-panel)",
        color: "var(--j4u-text)",
    },
    ".cm-indent-guides": {
        padding: "0 0 0 calc(var(--h) * 1ch)",
        textIndent: "calc(var(--h) * -1ch)",
        backgroundImage:
            "repeating-linear-gradient(to right, var(--j4u-guide, var(--j4u-border)) 0 1px, transparent 1px calc(var(--u) * 1ch))",
        backgroundSize: "calc(var(--n) * 1ch) 100%",
        backgroundPosition: "0 0",
        backgroundOrigin: "border-box",
        backgroundRepeat: "no-repeat",
    },
});

function onUpdate(u: ViewUpdate) {
    const external = u.transactions.some((tr) => tr.annotation(External));
    if (u.docChanged && !external) {
        emit("update:modelValue", u.state.doc.toString());
    } else if (
        u.selectionSet &&
        !u.docChanged &&
        u.transactions.some((tr) => tr.isUserEvent("select"))
    ) {
        // 用户点击 / 键盘移动光标
        emit("cursor", u.state.selection.main.head);
    }
}

onMounted(() => {
    if (!host.value) return;
    view = new EditorView({
        parent: host.value,
        state: EditorState.create({
            doc: props.modelValue,
            extensions: [
                basicSetup, // 行号、折叠槽、括号匹配、历史、搜索等
                json(),
                linter(jsonParseLinter()),
                lintGutter(),
                syntaxHighlighting(highlight),
                theme,
                indentGuides, // 新增
                EditorView.lineWrapping,
                EditorState.tabSize.of(2),
                EditorView.updateListener.of(onUpdate),
            ],
        }),
    });
});

onBeforeUnmount(() => view?.destroy());

watch(
    () => props.modelValue,
    (v) => {
        if (!view || v === view.state.doc.toString()) return;
        view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: v },
            annotations: External.of(true),
        });
    },
);

/** 把光标移动到 pos，滚动到视野中央，并展开包含它的折叠区域 */
function reveal(pos: number): void {
    if (!view) return;
    const p = Math.max(0, Math.min(pos, view.state.doc.length));
    const effects: StateEffect<unknown>[] = [
        EditorView.scrollIntoView(p, { y: "center" }),
    ];
    foldedRanges(view.state).between(p, p, (from, to) => {
        if (from < p && p < to) effects.push(unfoldEffect.of({ from, to }));
    });
    view.dispatch({ selection: { anchor: p }, effects });
}

defineExpose({ reveal });
</script>

<template>
    <div ref="host" class="j4u-cm"></div>
</template>
