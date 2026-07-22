<script setup lang="ts">
import { ref } from "vue";
import type { DatasetDetail } from "../../data/datasetDetail";

defineProps<{
    d: DatasetDetail;
}>();

const isOpen = ref(true);
</script>

<template>
    <div class="card overflow-hidden">
        <button
            class="w-full flex items-center justify-between px-8 py-6 text-left"
            @click="isOpen = !isOpen"
        >
            <h2 class="font-display text-xl text-fg font-semibold">数据介绍</h2>
            <span class="text-fg-faint font-mono text-lg w-5 text-center">{{
                isOpen ? "−" : "+"
            }}</span>
        </button>
        <div
            v-show="isOpen"
            class="px-8 pb-8 pt-2 space-y-6 border-t border-border/60"
        >
            <div>
                <p class="text-fg font-medium text-sm mb-1.5">
                    这个数据集中的每条样本代表什么？
                </p>
                <p class="text-fg-subtle text-sm leading-relaxed">
                    {{ d.whatInstancesRepresent }}
                </p>
            </div>
            <div>
                <p class="text-fg font-medium text-sm mb-1.5">补充说明</p>
                <p class="text-fg-subtle text-sm leading-relaxed">
                    {{ d.additionalInfo }}
                </p>
            </div>
            <div>
                <p class="text-fg font-medium text-sm mb-1.5">
                    是否存在缺失值？
                </p>
                <p class="text-fg-subtle text-sm">
                    {{ d.hasMissingValues ? "是" : "否" }}
                </p>
            </div>
        </div>
    </div>
</template>
