<script setup lang="ts">
import {
    ref,
    shallowRef,
    computed,
    watch,
    onBeforeUnmount,
    nextTick,
} from "vue";
import { buildGraph, explainError, CARD_W, HEAD_H, ROW_H } from "./graph";
import { indexJson, pathAt } from "./locate";
import type { Graph, JsonError, JsonIndex } from "./types";
import type { DatasetDetail } from "../../api/dataset";
import { usePreviewLink } from "../../composables/usePreviewLink";
import JsonEditor from "./JsonEditor.vue";
import JsonGraph from "./JsonGraph.vue";
import JsonToolbar from "./JsonToolbar.vue";
import { Maximize } from "@lucide/vue";
import BaseModal from "../shared/BaseModal.vue";

defineOptions({ name: "Json4u" });

const props = withDefaults(
    defineProps<{
        /** 数据集详情：从 overview.previewType / previewLink 读取 JSON 预览地址 */
        d: DatasetDetail;
        /** 是否显示左侧文本编辑器 */
        showEditor?: boolean;
        /** light | dark | auto */
        theme?: "light" | "dark" | "auto";
        /** 格式化缩进 */
        indent?: number;
        /** 图中最多渲染的卡片数量，超出会截断以保证性能 */
        maxNodes?: number;
        /** 容器（object/array）总数超过该值时，首次显示自动折叠除 root 外的所有节点；设为 0 关闭 */
        autoCollapseThreshold?: number;
    }>(),
    {
        showEditor: true,
        theme: "auto",
        indent: 2,
        maxNodes: 2000,
        autoCollapseThreshold: 50,
    },
);

const emit = defineEmits<{
    load: [payload: { text: string; data: unknown }];
    error: [err: unknown];
}>();

const showModal = ref(false);
const text = ref("");
const parsed = shallowRef<unknown>(undefined);
const error = ref<JsonError | null>(null);
const collapsed = ref<Set<string>>(new Set());
const view = ref<InstanceType<typeof JsonGraph> | null>(null); // 内联图组件
const modalView = ref<InstanceType<typeof JsonGraph> | null>(null); // 模态框图组件
const tf = ref({ x: 0, y: 0, k: 1 });
const editor = ref<InstanceType<typeof JsonEditor> | null>(null);
const activePath = ref<string | null>(null); // 当前选中的 JSON 路径（左右联动）
const animating = ref(false);
const showEditorRef = ref(true);

let fitPending = true;
let timer: ReturnType<typeof setTimeout> | undefined;

/** 打开模态框前的内联视图状态，关闭时用于恢复 */
let savedState: {
    tf: { x: number; y: number; k: number };
    collapsed: Set<string>;
    activePath: string | null;
} | null = null;

/** 当前生效的图容器（内联 / 模态框），二者互斥只渲染其一 */
function activeView(): HTMLDivElement | null {
    const g = showModal.value ? modalView.value : view.value;
    return g?.el ?? null;
}

/* ---------- 解析 ---------- */
function parseNow(src: string): boolean {
    if (!src.trim()) {
        parsed.value = undefined;
        error.value = null;
        return true;
    }
    try {
        parsed.value = JSON.parse(src);
        error.value = null;
        return true;
    } catch (e) {
        error.value = explainError(e, src);
        emit("error", e);
        return false;
    }
}

function setText(src: string, { fit = true }: { fit?: boolean } = {}) {
    text.value = src;
    activePath.value = null;
    savedState = null; // 数据集已更换，之前的模态框恢复状态失效
    fitPending = fit;
    clearTimeout(timer);
    const ok = parseNow(src);
    // 数据过多时首次显示只展开 root，其余节点全部折叠
    collapsed.value = ok ? initialCollapsed(parsed.value) : new Set();
    if (ok && parsed.value !== undefined)
        emit("load", { text: src, data: parsed.value });
    if (!fit) return;
    if (!ok) fitPending = false;
}

function onEdit(v: string) {
    text.value = v;
    clearTimeout(timer);
    timer = setTimeout(() => {
        fitPending = false;
        parseNow(text.value);
    }, 250);
}

function format() {
    if (parsed.value === undefined || error.value) return;
    text.value = JSON.stringify(parsed.value, null, props.indent);
}

// 仅支持 URL 数据源：按 previewType 监听预览地址并加载 JSON
const { reload } = usePreviewLink(() => props.d, 2, {
    reset: () => {
        text.value = "";
        parsed.value = undefined;
        error.value = null;
        collapsed.value = new Set();
        activePath.value = null;
    },
    onText: (src) => setText(src),
    onError: (e) => {
        error.value = { message: `加载失败：${(e as Error).message}` };
        emit("error", e);
    },
});

/* ---------- 图 ---------- */
const graph = computed<Graph | null>(() =>
    parsed.value === undefined
        ? null
        : buildGraph(parsed.value, collapsed.value, props.maxNodes),
);

/**
 * 首次显示时的折叠状态：当容器数量超过阈值时，
 * 折叠除 root 外的所有节点，避免一次渲染过多卡片。
 */
function initialCollapsed(value: unknown): Set<string> {
    const limit = props.autoCollapseThreshold;
    if (!limit || limit <= 0) return new Set();
    const paths = collectContainerPaths(value);
    return paths.length > limit ? new Set(paths) : new Set();
}

/** 收集所有嵌套容器（不含 root）的 path，格式与 graph 节点 id 一致 */
function collectContainerPaths(value: unknown): string[] {
    const paths: string[] = [];
    const walk = (v: unknown, path: string) => {
        if (v === null || typeof v !== "object") return;
        if (path) paths.push(path);
        if (Array.isArray(v)) {
            v.forEach((item, i) => walk(item, `${path}/${i}`));
        } else {
            for (const [k, item] of Object.entries(
                v as Record<string, unknown>,
            ))
                walk(item, `${path}/${encodeURIComponent(k)}`);
        }
    };
    walk(value, "");
    return paths;
}

function toggle(path: string) {
    if (moved) return;
    const s = new Set(collapsed.value);
    s.has(path) ? s.delete(path) : s.add(path);
    collapsed.value = s;
}

/* ---------- 左右联动 ---------- */
let indexCache: { text: string | null; index: JsonIndex | null } = {
    text: null,
    index: null,
};
function getIndex(): JsonIndex | null {
    if (indexCache.text !== text.value)
        indexCache = { text: text.value, index: indexJson(text.value) };
    return indexCache.index;
}

// 展开目标路径的所有祖先，保证目标节点在图中可见
function expandTo(path: string) {
    const parts = path.split("/").slice(1);
    const s = new Set(collapsed.value);
    let acc = "";
    let changed = false;
    for (let i = 0; i < parts.length - 1; i++) {
        acc += "/" + parts[i];
        if (s.delete(acc)) changed = true;
    }
    if (changed) collapsed.value = s;
}

// 把视图平移到目标节点（或目标所在行）
function centerOn(path: string) {
    const g = graph.value;
    const el = activeView();
    if (!g || !el) return;
    let x: number;
    let y: number;
    const node = g.nodes.find((n) => n.id === path);
    if (node) {
        x = node.x + CARD_W / 2;
        y = node.y + Math.min(node.h / 2, 90);
    } else {
        const parent = g.nodes.find(
            (n) => n.id === path.slice(0, path.lastIndexOf("/")),
        );
        if (!parent) return;
        const idx = parent.rows.findIndex((r) => r.path === path);
        if (idx < 0) return;
        x = parent.x + CARD_W / 2;
        y = parent.y + HEAD_H + idx * ROW_H + ROW_H / 2;
    }
    const k = Math.max(tf.value.k, 0.6);
    animating.value = true;
    tf.value = {
        k,
        x: el.clientWidth / 2 - x * k,
        y: el.clientHeight / 2 - y * k,
    };
    setTimeout(() => (animating.value = false), 300);
}

async function focusPath(path: string) {
    activePath.value = path;
    expandTo(path);
    await nextTick();
    centerOn(path);
}

// 左 -> 右：光标移动后，右侧图定位到对应节点
function onCursor(offset: number) {
    if (error.value) return;
    const index = getIndex();
    if (!index) return;
    const path = pathAt(index, offset);
    if (path !== null) focusPath(path);
}

// 右 -> 左：点击图中的卡片 / 字段，左侧编辑器跳到对应位置
function select(path: string) {
    if (moved) return;
    activePath.value = path;
    const index = !error.value ? getIndex() : null;
    const entry = index && index.byPath.get(path);
    if (entry && editor.value) editor.value.reveal(entry.keyStart);
}

function fit() {
    const el = activeView();
    const g = graph.value;
    if (!el || !g) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const k = Math.max(0.1, Math.min(1, W / g.width, H / g.height));
    tf.value = { k, x: 0, y: Math.max(0, (H - g.height * k) / 2) };
}

watch(graph, () => {
    if (fitPending) {
        fitPending = false;
        nextTick(fit);
    }
});

/// 打开模态框时记录初始状态
watch(showModal, (open) => {
    if (open) {
        // 保存打开前的状态
        savedState = {
            tf: { ...tf.value },
            collapsed: new Set(collapsed.value),
            activePath: activePath.value,
        };
        nextTick(fit);
    } else {
        nextTick(fit);
    }
});

function zoomAt(factor: number, cx: number, cy: number) {
    const { x, y, k } = tf.value;
    const k2 = Math.min(3, Math.max(0.1, k * factor));
    tf.value = {
        k: k2,
        x: cx - ((cx - x) * k2) / k,
        y: cy - ((cy - y) * k2) / k,
    };
}
function onWheel(e: WheelEvent) {
    if (!e.metaKey && !e.ctrlKey) {
        return;
    }

    // 普通滚轮：上下 / 左右平移视图
    e.preventDefault();

    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();

    const scale = e.deltaY < 0 ? 1.1 : 1 / 1.1;

    zoomAt(scale, e.clientX - rect.left, e.clientY - rect.top);
}
function zoomBtn(f: number) {
    const el = activeView();
    if (!el) return;
    zoomAt(f, el.clientWidth / 2, el.clientHeight / 2);
}

function showPanel() {
    showEditorRef.value = !showEditorRef.value;
}

/* ---------- 拖拽编辑框右边框，自定义宽度 ---------- */
const editorWidth = ref(32); // 占 j4u-body 宽度的百分比
const MIN_EDITOR_W = 12;
const MAX_EDITOR_W = 85;
const resizing = ref(false);
let resizeRect: DOMRect | null = null;

function onResizeDown(e: PointerEvent) {
    if (e.button !== 0) return;
    const body = (e.currentTarget as HTMLElement).parentElement;
    if (!body) return;
    e.preventDefault();
    resizing.value = true;
    resizeRect = body.getBoundingClientRect();
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeUp);
}
function onResizeMove(e: PointerEvent) {
    if (!resizing.value || !resizeRect) return;
    const { left, width } = resizeRect;
    if (width <= 0) return;
    const pct = ((e.clientX - left) / width) * 100;
    editorWidth.value = Math.min(MAX_EDITOR_W, Math.max(MIN_EDITOR_W, pct));
}
function onResizeUp() {
    if (!resizing.value) return;
    resizing.value = false;
    resizeRect = null;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", onResizeUp);
}

/* 拖拽平移（仅按住空格时） */
let moved = false;
let start: { px: number; py: number; x: number; y: number } | null = null;
function onDown(e: PointerEvent) {
    if (e.button !== 0) return;
    moved = false;
    start = { px: e.clientX, py: e.clientY, x: tf.value.x, y: tf.value.y };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
}
function onMove(e: PointerEvent) {
    if (!start) return;
    const dx = e.clientX - start.px;
    const dy = e.clientY - start.py;
    if (!moved && Math.hypot(dx, dy) > 3) moved = true;
    if (moved) tf.value = { ...tf.value, x: start.x + dx, y: start.y + dy };
}
function onUp() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    setTimeout(() => (moved = false)); // 让 click 先读到 moved
}
onBeforeUnmount(() => {
    clearTimeout(timer);
    onUp();
    onResizeUp();
});

const canvasStyle = computed(() => ({
    transform: `translate(${tf.value.x}px, ${tf.value.y}px) scale(${tf.value.k})`,
}));

defineExpose({
    reload,
    setText,
    format,
    fit,
});
</script>

<template>
    <div class="j4u card max-h-[875px] min-h-[640px]" :data-theme="theme">
        <div
            class="w-full bg-surface flex items-center justify-between px-8 py-6 text-left border-b border-border/60"
        >
            <h2 class="font-display text-xl text-fg font-semibold">数据预览</h2>
            <span class="flex items-center gap-3 shrink-0">
                <button
                    class="text-fg-faint hover:text-fg transition-colors duration-200"
                    title="全屏查看"
                    @click.stop="showModal = true"
                >
                    <Maximize :size="18" />
                </button>
            </span>
        </div>
        <JsonToolbar
            @format="format"
            @zoom="zoomBtn"
            @fit="fit"
            @show-panel="showPanel"
        />

        <div v-if="!showModal" class="j4u-body">
            <div
                v-if="showEditorRef"
                class="j4u-editor"
                :style="{ '--j4u-editor-w': editorWidth + '%' }"
            >
                <JsonEditor
                    ref="editor"
                    :model-value="text"
                    @update:model-value="onEdit"
                    @cursor="onCursor"
                />
            </div>
            <div
                v-if="showEditorRef"
                class="j4u-resizer"
                :class="{ 'j4u-resizing': resizing }"
                role="separator"
                aria-orientation="vertical"
                title="拖拽调整宽度"
                @pointerdown="onResizeDown"
            />
            <JsonGraph
                ref="view"
                :graph="graph"
                :error="error"
                :active-path="activePath"
                :canvas-style="canvasStyle"
                :animating="animating"
                :max-nodes="maxNodes"
                @toggle="toggle"
                @select="select"
                @pointerdown="onDown"
                @wheel.prevent="onWheel"
            />
        </div>
    </div>

    <BaseModal :width="100" :height="100" v-model="showModal" title="数据预览">
        <div class="j4u h-full" :data-theme="theme">
            <JsonToolbar
                @format="format"
                @zoom="zoomBtn"
                @fit="fit"
                @show-panel="showPanel"
            />

            <div class="j4u-body">
                <div
                    v-if="showEditorRef"
                    class="j4u-editor"
                    :style="{ '--j4u-editor-w': editorWidth + '%' }"
                >
                    <JsonEditor
                        ref="editor"
                        :model-value="text"
                        @update:model-value="onEdit"
                        @cursor="onCursor"
                    />
                </div>
                <div
                    v-if="showEditorRef"
                    class="j4u-resizer"
                    :class="{ 'j4u-resizing': resizing }"
                    role="separator"
                    aria-orientation="vertical"
                    title="拖拽调整宽度"
                    @pointerdown="onResizeDown"
                />

                <JsonGraph
                    ref="modalView"
                    :graph="graph"
                    :error="error"
                    :active-path="activePath"
                    :canvas-style="canvasStyle"
                    :animating="animating"
                    :max-nodes="maxNodes"
                    @toggle="toggle"
                    @select="select"
                    @pointerdown="onDown"
                    @wheel.prevent="onWheel"
                />
            </div>
        </div>
    </BaseModal>
</template>
