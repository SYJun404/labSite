<script setup lang="ts">
import { ref } from "vue";
import type { DatasetDetail } from "../../data/datasetDetail";
import BaseModal from "../shared/BaseModal.vue";

defineProps<{
    d: DatasetDetail;
}>();

const showModal = ref(false);

function formatNumber(n: number): string {
    return n.toLocaleString("en-US");
}
</script>

<template>
    <div class="card overflow-hidden">
        <div
            class="w-full flex items-center justify-between px-8 py-6 text-left"
        >
            <div>
                <h2 class="font-display text-xl text-fg font-semibold">
                    数据预览
                </h2>
                <p class="font-mono text-xs text-fg-faint mt-1">
                    显示前 {{ d.previewRows.length }} 行 · 共
                    {{ formatNumber(d.previewTotalRows) }} 行 ×
                    {{ d.previewColumns.length }} 列
                </p>
            </div>
            <span class="flex items-center gap-3 shrink-0">
                <button
                    class="text-fg-faint hover:text-fg transition-colors duration-200"
                    title="全屏查看"
                    @click.stop="showModal = true"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        class="w-4 h-4"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
                        />
                    </svg>
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
                                v-for="col in d.previewColumns"
                                :key="col"
                                class="px-4 py-2.5 font-semibold text-fg-subtle whitespace-nowrap"
                            >
                                {{ col }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/30">
                        <tr
                            v-for="(row, rowIdx) in d.previewRows"
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
        v-model="showModal"
        title="数据预览"
        :subtitle="`共 ${formatNumber(d.previewTotalRows)} 行 × ${d.previewColumns.length} 列`"
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
                        v-for="col in d.previewColumns"
                        :key="col"
                        class="sticky top-0 bg-surface-alt/70 px-4 py-3 font-semibold text-fg-subtle whitespace-nowrap z-10"
                    >
                        {{ col }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-border/30">
                <tr
                    v-for="(row, rowIdx) in d.previewRows"
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
