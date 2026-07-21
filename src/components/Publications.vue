<script setup>
import { computed, ref } from "vue";
import { publications } from "../data/publications";

const activeTag = ref("全部");

const allTags = computed(() => {
    const set = new Set();
    publications.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["全部", ...Array.from(set)];
});

const filtered = computed(() => {
    if (activeTag.value === "全部") return publications;
    return publications.filter((p) => p.tags.includes(activeTag.value));
});

const grouped = computed(() => {
    const map = {};
    filtered.value.forEach((p) => {
        if (!map[p.year]) map[p.year] = [];
        map[p.year].push(p);
    });
    return Object.entries(map).sort((a, b) => b[0] - a[0]);
});
</script>

<template>
    <section id="publications" class="section-pad border-t border-border/40">
        <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
            <div>
                <p class="eyebrow mb-4">Selected Publications</p>
                <h2
                    class="font-display text-3xl md:text-5xl font-semibold text-fg tracking-tight"
                >
                    论文成果
                </h2>
            </div>

            <div class="flex flex-wrap gap-2">
                <button
                    v-for="tag in allTags"
                    :key="tag"
                    @click="activeTag = tag"
                    class="tag-pill transition-colors duration-200"
                    :class="
                        activeTag === tag
                            ? '!bg-accent-blue !text-white !border-accent-blue'
                            : 'hover:border-accent-cyan/60'
                    "
                >
                    {{ tag }}
                </button>
            </div>
        </div>

        <div class="space-y-12">
            <div v-for="[year, items] in grouped" :key="year">
                <p class="font-display text-2xl text-accent-cyan/80 mb-5">
                    {{ year }}
                </p>
                <div class="space-y-4">
                    <article
                        v-for="pub in items"
                        :key="pub.title"
                        class="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div class="flex-1">
                            <div class="flex items-center gap-3 flex-wrap">
                                <h3
                                    class="font-display text-lg text-fg font-medium"
                                >
                                    {{ pub.title }}
                                </h3>
                                <span
                                    v-if="pub.highlight"
                                    class="tag-pill !bg-signal-gradient !text-[#0A0B0F] !border-none font-semibold"
                                >
                                    Spotlight
                                </span>
                            </div>
                            <p class="text-sm text-fg-subtle mt-2">
                                {{ pub.authors }}
                            </p>
                            <div class="flex flex-wrap gap-2 mt-3">
                                <span
                                    v-for="t in pub.tags"
                                    :key="t"
                                    class="tag-pill"
                                    >{{ t }}</span
                                >
                            </div>
                        </div>
                        <div
                            class="font-mono text-sm text-fg-faint whitespace-nowrap"
                        >
                            {{ pub.venue }} {{ pub.year }}
                        </div>
                    </article>
                </div>
            </div>

            <p v-if="grouped.length === 0" class="text-fg-subtle text-sm">
                暂无匹配的论文条目。
            </p>
        </div>
    </section>
</template>
