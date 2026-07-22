<script setup lang="ts">
import type { DatasetDetail } from "../../data/datasetDetail";

defineProps<{
    d: DatasetDetail;
}>();
</script>

<template>
    <div class="p-8 flex flex-col sm:flex-row sm:items-center gap-6">
        <div
            class="w-20 h-20 shrink-0 rounded-2xl bg-signal-gradient flex items-center justify-center"
        >
            <span class="font-display text-2xl font-semibold text-[#0A0B0F]">{{
                d.tag
            }}</span>
        </div>
        <div>
            <h1 class="font-display text-3xl md:text-4xl font-semibold text-fg">
                {{ d.name }}
            </h1>
            <p class="font-mono text-sm text-fg-subtle mt-1">
                发布于 {{ d.donatedDate }}
            </p>
        </div>
    </div>
</template>
