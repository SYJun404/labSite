<script setup lang="ts">
import { ref, watch } from "vue";
import type { DatasetDetail } from "../../data/datasetDetail";

defineProps<{
    d: DatasetDetail;
}>();

const showModal = ref(false);

watch(showModal, (val) => {
    document.body.style.overflow = val ? "hidden" : "";
});

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
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="showModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
                @click.self="showModal = false"
            >
                <div
                    class="relative w-[90vw] h-[85vh] card hover:border-border/60 flex flex-col overflow-hidden"
                >
                    <!-- 模态框头部 -->
                    <div
                        class="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0"
                    >
                        <div>
                            <h2
                                class="font-display text-lg text-fg font-semibold"
                            >
                                数据预览
                            </h2>
                            <p class="font-mono text-xs text-fg-faint mt-0.5">
                                共 {{ formatNumber(d.previewTotalRows) }} 行 ×
                                {{ d.previewColumns.length }} 列
                            </p>
                        </div>
                        <button
                            class="text-fg-faint hover:text-fg transition-colors duration-200 p-1"
                            @click="showModal = false"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                class="w-5 h-5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M18 6L6 18M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <!-- 模态框表格区 -->
                    <div class="flex-1 overflow-auto">
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
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active {
    transition: opacity 0.2s ease;
}
.modal-leave-active {
    transition: opacity 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active > div {
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.2s ease;
}
.modal-leave-active > div {
    transition:
        transform 0.15s ease,
        opacity 0.15s ease;
}
.modal-enter-from > div {
    transform: scale(0.92) translateY(12px);
    opacity: 0;
}
.modal-leave-to > div {
    transform: scale(0.95) translateY(8px);
    opacity: 0;
}
</style>
