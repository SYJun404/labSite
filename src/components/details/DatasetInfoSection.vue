<script setup lang="ts">
import { ref } from "vue";
import type { DatasetDetail } from "../../api/dataset";
import { Plus, Minus } from "@lucide/vue";

defineProps<{
    d: DatasetDetail;
}>();

const isOpen = ref(true);
</script>

<template>
    <div class="card overflow-hidden">
        <div
            class="w-full flex items-center justify-between px-8 py-6 text-left"
        >
            <h2 class="font-display text-xl text-fg font-semibold">数据介绍</h2>
            <span
                @click="isOpen = !isOpen"
                class="text-fg-faint hover:text-fg cursor-pointer"
            >
                <Plus v-if="!isOpen" :size="18" />
                <Minus v-else :size="18" />
            </span>
        </div>
        <div
            v-show="isOpen"
            class="px-8 pb-8 pt-2 space-y-6 border-t border-border/60"
        >
            <div v-for="(item, i) in d.intro ?? []" :key="i">
                <p v-if="item.title" class="text-fg font-medium text-sm mb-1.5">
                    {{ item.title }}
                </p>
                <p
                    class="text-fg-subtle text-sm leading-relaxed whitespace-pre-line"
                >
                    {{ item.content }}
                </p>
            </div>
        </div>
    </div>
</template>
