<script setup lang="ts">
import type { DatasetDetail } from "../../data/datasetDetail";

const props = defineProps<{
    d: DatasetDetail;
}>();

function formatNumber(n: number): string {
    return n.toLocaleString("en-US");
}
</script>

<template>
    <div class="p-8 space-y-6">
        <p class="text-fg-muted leading-relaxed">
            {{ d.description }}
        </p>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
            <div>
                <p
                    class="font-mono text-xs uppercase tracking-wide eyebrow mb-1.5"
                >
                    Dataset Characteristics
                </p>
                <p class="text-fg text-sm">
                    {{ d.characteristics }}
                </p>
            </div>
            <div>
                <p
                    class="font-mono text-xs uppercase tracking-wide eyebrow mb-1.5"
                >
                    Subject Area
                </p>
                <p class="text-fg text-sm">{{ d.subjectArea }}</p>
            </div>
            <div>
                <p
                    class="font-mono text-xs uppercase tracking-wide eyebrow mb-1.5"
                >
                    Associated Tasks
                </p>
                <p class="text-fg text-sm">
                    {{ d.associatedTasks.join(", ") }}
                </p>
            </div>
            <div>
                <p
                    class="font-mono text-xs uppercase tracking-wide eyebrow mb-1.5"
                >
                    Feature Type
                </p>
                <p class="text-fg text-sm">{{ d.featureType }}</p>
            </div>
            <div>
                <p
                    class="font-mono text-xs uppercase tracking-wide eyebrow mb-1.5"
                >
                    <span class="mr-0.5">#</span>Instances
                </p>
                <p class="text-fg text-sm">
                    {{ formatNumber(d.instances) }}
                </p>
            </div>
            <div>
                <p
                    class="font-mono text-xs uppercase tracking-wide eyebrow mb-1.5"
                >
                    <span class="mr-0.5">#</span>Features
                </p>
                <p class="text-fg text-sm">{{ d.features }}</p>
            </div>
        </div>
    </div>
</template>
