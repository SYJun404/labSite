<script setup lang="ts">
import type { DatasetDetail } from "../../api/dataset";

defineProps<{
    d: DatasetDetail;
}>();
</script>

<template>
    <div class="p-8 flex flex-col sm:flex-row sm:items-center gap-6">
        <div
            class="w-20 h-20 shrink-0 rounded-2xl bg-surface-alt border border-border flex items-center justify-center"
        >
            <span
                class="font-display text-2xl font-semibold text-accent-blue"
                >{{ d.overview?.tag }}</span
            >
        </div>
        <div>
            <h1 class="font-display text-3xl md:text-4xl font-semibold text-fg">
                {{ d.overview?.name }}
            </h1>
            <div class="flex mt-1">
                <p class="font-mono text-sm text-fg-subtle">
                    Date: {{ d.overview?.donatedDate }}
                </p>
                <p class="font-mono px-3 text-sm text-fg-subtle">|</p>
                <p class="font-mono text-sm text-fg-subtle">
                    Size: {{ d.overview?.downloadSize }}
                </p>
            </div>
        </div>
    </div>
</template>
