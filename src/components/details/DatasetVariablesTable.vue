<script setup lang="ts">
import { computed, ref } from "vue";
import type { DatasetDetail } from "../../api/dataset";
import BaseModal from "../shared/BaseModal.vue";
import { Maximize } from "@lucide/vue";

const props = defineProps<{
    d: DatasetDetail;
}>();

const showModal = ref(false);

// fieldExplain.columns 是有序的列定义，数组顺序即列顺序
const columnDefs = computed(() => props.d.fieldExplain?.columns ?? []);

const rows = computed(() => {
    const data = props.d.fieldExplain?.data ?? [];
    return data.map((entry) =>
        columnDefs.value.map((col) => {
            const value = entry[col.id];
            return value === undefined || value === "" ? "—" : String(value);
        }),
    );
});
</script>

<template>
    <div class="card overflow-hidden">
        <div
            class="w-full flex items-center justify-between px-8 py-6 text-left"
        >
            <h2 class="font-display text-xl text-fg font-semibold">字段说明</h2>
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
        <div class="border-t border-border/60 overflow-auto max-h-[780px]">
            <table class="w-full text-sm min-w-[640px]">
                <thead>
                    <tr
                        class="text-left font-mono text-xs uppercase tracking-wide text-fg-faint"
                    >
                        <th
                            v-for="(col, colIdx) in columnDefs"
                            :key="col.id"
                            class="sticky top-0 z-10 bg-surface py-3 font-medium"
                            :class="colIdx === 0 ? 'px-8' : 'px-4'"
                        >
                            {{ col.name }}
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/40">
                    <tr v-for="(row, rowIdx) in rows" :key="rowIdx">
                        <td
                            v-for="(cell, cellIdx) in row"
                            :key="cellIdx"
                            class="py-3 whitespace-nowrap"
                            :class="
                                cellIdx === 0
                                    ? 'px-8 font-mono text-fg'
                                    : 'px-4 text-fg-subtle'
                            "
                        >
                            {{ cell }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- 全屏模态框 -->
    <BaseModal :width="100" :height="100" v-model="showModal" title="字段说明">
        <table class="w-full text-sm min-w-[640px]">
            <thead>
                <tr
                    class="text-left font-mono text-xs uppercase tracking-wide text-fg-faint"
                >
                    <th
                        v-for="(col, colIdx) in columnDefs"
                        :key="col.id"
                        class="py-3 font-medium"
                        :class="colIdx === 0 ? 'px-8' : 'px-4'"
                    >
                        {{ col.name }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-border/40">
                <tr v-for="(row, rowIdx) in rows" :key="rowIdx">
                    <td
                        v-for="(cell, cellIdx) in row"
                        :key="cellIdx"
                        class="py-3 whitespace-nowrap"
                        :class="
                            cellIdx === 0
                                ? 'px-8 font-mono text-fg'
                                : 'px-4 text-fg-subtle'
                        "
                    >
                        {{ cell }}
                    </td>
                </tr>
            </tbody>
        </table>
    </BaseModal>
</template>
