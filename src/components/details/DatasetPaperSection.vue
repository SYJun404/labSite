<script setup lang="ts">
import { computed, ref } from "vue";
import type { DatasetDetail } from "../../api/dataset";

const props = defineProps<{
    d: DatasetDetail;
}>();

const isOpen = ref(true);
const paper = computed(() => props.d.reference?.[0]);
</script>

<template>
    <div class="card overflow-hidden">
        <button
            class="w-full flex items-center justify-between px-8 py-6 text-left"
            @click="isOpen = !isOpen"
        >
            <h2 class="font-display text-xl text-fg font-semibold">
                Introductory Paper
            </h2>
            <span class="text-fg-faint font-mono text-lg w-5 text-center">{{
                isOpen ? "−" : "+"
            }}</span>
        </button>
        <div v-show="isOpen" class="px-8 pb-8 pt-2 border-t border-border/60">
            <a
                :href="paper?.url || '#'"
                class="text-accent-cyan hover:text-accent-blue transition-colors duration-200 underline underline-offset-4 decoration-accent-cyan/40"
            >
                {{ paper?.title }}
            </a>
            <p class="text-fg-subtle text-sm mt-2">
                By {{ paper?.authors }}. {{ paper?.year }}.
            </p>
            <p class="text-fg-subtle text-sm">
                Published in {{ paper?.publishedIn }},
                {{ paper?.year }}
            </p>
        </div>
    </div>
</template>
