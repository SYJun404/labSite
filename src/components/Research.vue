<script setup lang="ts">
import { researchAreas } from "../data/research";
</script>

<template>
    <section id="research" class="section-pad border-t border-border/40">
        <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
            <div>
                <p class="eyebrow mb-4">Research Directions</p>
                <h2
                    class="font-display text-3xl md:text-5xl font-semibold text-fg tracking-tight"
                >
                    研究方向
                </h2>
            </div>
            <p class="text-fg-subtle max-w-md text-sm leading-relaxed">
                实验室以基础理论突破与系统落地并重为原则，围绕六个核心方向展开长期研究，鼓励方向间的交叉合作。
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
                v-for="(area, idx) in researchAreas"
                :key="area.id"
                class="card p-8 flex flex-col justify-between min-h-[260px]"
            >
                <div>
                    <span class="font-mono text-xs text-fg-faint">{{
                        String(idx + 1).padStart(2, "0")
                    }}</span>
                    <h3 class="mt-4 font-display text-xl font-semibold text-fg">
                        {{ area.title }}
                    </h3>
                    <p class="font-mono text-xs text-accent-cyan/80 mt-1">
                        {{ area.titleEn }}
                    </p>
                    <p class="mt-4 text-sm text-fg-subtle leading-relaxed">
                        {{ area.summary }}
                    </p>
                </div>
                <div class="mt-6 flex flex-wrap gap-2">
                    <span
                        v-for="kw in area.keywords"
                        :key="kw"
                        class="tag-pill"
                        >{{ kw }}</span
                    >
                </div>
            </article>
        </div>
    </section>
</template>
