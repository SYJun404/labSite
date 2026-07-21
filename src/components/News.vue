<script setup lang="ts">
import { news } from "../data/news";
</script>

<template>
    <section class="section-pad !py-16 border-t border-border/40">
        <div class="flex flex-col md:flex-row md:items-start gap-8">
            <p class="eyebrow shrink-0 md:w-40">Lab News</p>
            <ul class="space-y-5 flex-1">
                <li
                    v-for="item in news"
                    :key="item.text"
                    class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6"
                >
                    <span
                        class="font-mono text-xs text-accent-cyan/80 shrink-0 w-20"
                        >{{ item.date }}</span
                    >
                    <span class="text-sm text-fg-muted">{{ item.text }}</span>
                </li>
            </ul>
        </div>
    </section>
</template>
