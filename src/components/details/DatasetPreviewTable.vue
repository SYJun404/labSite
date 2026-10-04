<script setup lang="ts">
import { ref, watch } from "vue";
import type { DatasetDetail } from "../../api/dataset";
import BaseModal from "../shared/BaseModal.vue";
import { Maximize } from "@lucide/vue";

// 数据预览最多展示的行数
const PREVIEW_LIMIT = 20;

const props = defineProps<{
    d: DatasetDetail;
}>();

const showModal = ref(false);

const columns = ref<string[]>([]);
const rows = ref<string[][]>([]);
const totalRows = ref(0);

function formatNumber(n: number): string {
    return n.toLocaleString("en-US");
}

watch(() => props.d.previewLink, load, { immediate: true });

// 预览文件（CSV）单独请求，失败时静默降级、为空则不渲染预览卡片
async function load(link?: string | null) {
    columns.value = [];
    rows.value = [];
    totalRows.value = 0;

    const previewType = props.d.overview?.previewType;
    // previewType 为 1 表示表格预览；其它类型暂不处理
    if (!link || (previewType != null && previewType !== 1)) return;

    try {
        const res = await fetch(link);
        if (!res.ok) return;
        const parsed = parseCsv(await res.text());
        columns.value = parsed.columns;
        rows.value = parsed.rows.slice(0, PREVIEW_LIMIT);
        totalRows.value =
            parsed.rows.length || props.d.overview?.instances || 0;
    } catch {
        columns.value = [];
        rows.value = [];
        totalRows.value = 0;
    }
}

// 简易 CSV 解析：支持引号包裹、转义双引号、跨行字段，并自动识别分隔符（, ; \t）
function parseCsv(text: string): { columns: string[]; rows: string[][] } {
    const clean = text.replace(/^\uFEFF/, "");
    const records = parseCsvRecords(clean, detectDelimiter(clean));
    if (records.length === 0) return { columns: [], rows: [] };

    const [header, ...body] = records;
    const cols = header.map((h) => h.trim());
    const data = body
        .filter((r) => r.some((cell) => cell.trim() !== ""))
        .map((r) =>
            cols.map((_, i) => {
                const value = (r[i] ?? "").trim();
                return value === "" ? "—" : value;
            }),
        );
    return { columns: cols, rows: data };
}

function detectDelimiter(text: string): string {
    const newline = text.indexOf("\n");
    const firstLine = newline === -1 ? text : text.slice(0, newline);
    const candidates = [",", ";", "\t"];
    let best = ",";
    let max = -1;
    for (const delimiter of candidates) {
        const count = firstLine.split(delimiter).length - 1;
        if (count > max) {
            max = count;
            best = delimiter;
        }
    }
    return best;
}

function parseCsvRecords(text: string, delimiter: string): string[][] {
    const records: string[][] = [];
    let record: string[] = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += ch;
            }
        } else if (ch === '"') {
            inQuotes = true;
        } else if (ch === delimiter) {
            record.push(field);
            field = "";
        } else if (ch === "\n" || ch === "\r") {
            if (ch === "\r" && text[i + 1] === "\n") i++;
            record.push(field);
            field = "";
            records.push(record);
            record = [];
        } else {
            field += ch;
        }
    }
    if (field !== "" || record.length > 0) {
        record.push(field);
        records.push(record);
    }
    return records;
}
</script>

<template>
    <div v-if="columns.length" class="card overflow-hidden">
        <div
            class="w-full flex items-center justify-between px-8 py-6 text-left"
        >
            <div>
                <h2 class="font-display text-xl text-fg font-semibold">
                    数据预览
                </h2>
                <p class="font-mono text-xs text-fg-faint mt-1">
                    显示前 {{ rows.length }} 行 · 共
                    {{ formatNumber(totalRows) }} 行 × {{ columns.length }} 列
                </p>
            </div>
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

        <div class="border-t border-border/60">
            <div class="overflow-x-auto">
                <table class="w-full text-xs font-mono min-w-[900px]">
                    <thead>
                        <tr class="text-left bg-surface-alt/70">
                            <th
                                class="px-4 py-2.5 font-semibold text-fg-subtle whitespace-nowrap"
                            >
                                #
                            </th>
                            <th
                                v-for="col in columns"
                                :key="col"
                                class="px-4 py-2.5 font-semibold text-fg-subtle whitespace-nowrap"
                            >
                                {{ col }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/30">
                        <tr
                            v-for="(row, rowIdx) in rows"
                            :key="rowIdx"
                            class="odd:bg-surface-alt/20"
                        >
                            <td
                                class="px-4 py-2.5 text-fg-faint whitespace-nowrap"
                            >
                                {{ rowIdx + 1 }}
                            </td>
                            <td
                                v-for="(cell, cellIdx) in row"
                                :key="cellIdx"
                                class="px-4 py-2.5 whitespace-nowrap"
                                :class="
                                    cell === '—'
                                        ? 'text-fg-faint italic'
                                        : 'text-fg-muted'
                                "
                            >
                                {{ cell }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- 全屏模态框 -->
    <BaseModal
        v-if="columns.length"
        v-model="showModal"
        title="数据预览"
        :subtitle="`共 ${formatNumber(totalRows)} 行 × ${columns.length} 列`"
    >
        <table class="w-full text-sm font-mono">
            <thead>
                <tr class="text-left bg-surface-alt/70">
                    <th
                        class="sticky top-0 bg-surface-alt/70 px-4 py-3 font-semibold text-fg-subtle whitespace-nowrap z-10"
                    >
                        #
                    </th>
                    <th
                        v-for="col in columns"
                        :key="col"
                        class="sticky top-0 bg-surface-alt/70 px-4 py-3 font-semibold text-fg-subtle whitespace-nowrap z-10"
                    >
                        {{ col }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-border/30">
                <tr
                    v-for="(row, rowIdx) in rows"
                    :key="rowIdx"
                    class="odd:bg-surface-alt/20"
                >
                    <td class="px-4 py-2.5 text-fg-faint whitespace-nowrap">
                        {{ rowIdx + 1 }}
                    </td>
                    <td
                        v-for="(cell, cellIdx) in row"
                        :key="cellIdx"
                        class="px-4 py-2.5 whitespace-nowrap"
                        :class="
                            cell === '—'
                                ? 'text-fg-faint italic'
                                : 'text-fg-muted'
                        "
                    >
                        {{ cell }}
                    </td>
                </tr>
            </tbody>
        </table>
    </BaseModal>
</template>
