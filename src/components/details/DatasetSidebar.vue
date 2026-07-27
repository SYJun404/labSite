<script setup lang="ts">
import type { DatasetDetail } from "../../data/datasetDetail";
import { Download, TextQuote, User, Rss } from "@lucide/vue";

defineProps<{
    d: DatasetDetail;
}>();
</script>

<template>
    <aside class="space-y-4">
        <button class="btn-primary w-full justify-center">
            <Download :size="18" />
            下载数据集
        </button>

        <button
            class="w-full inline-flex items-center justify-center gap-2 btn-secondary"
        >
            <TextQuote :size="18" />
            引用数据集
        </button>

        <div class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-3"
            >
                Keywords
            </p>
            <div class="flex flex-wrap gap-2">
                <span v-for="k in d.keywords" :key="k" class="tag-pill">{{
                    k
                }}</span>
            </div>
        </div>

        <div class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-3"
            >
                Creators
            </p>
            <ul class="space-y-2.5">
                <li
                    v-for="c in d.creators"
                    :key="c"
                    class="flex items-center gap-1 text-sm text-fg"
                >
                    <User class="text-fg-faint" :size="14" />
                    {{ c }}
                </li>
            </ul>
        </div>

        <div class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-4"
            >
                reference
            </p>
            <ul class="space-y-4">
                <li v-for="p in d.citingPapers" :key="p.title" class="group">
                    <a
                        :href="p.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block -mx-2 px-2 py-2 cursor-default"
                    >
                        <p
                            class="text-sm font-medium leading-snug mb-1 transition-colors duration-200 cursor-pointer text-accent-cyan hover:text-accent-blue underline underline-offset-2"
                        >
                            {{ p.title }}
                        </p>
                        <p class="text-xs text-fg-subtle leading-relaxed">
                            By {{ p.authors }}.
                            <template v-if="p.year">{{ p.year }}</template>
                        </p>
                        <p
                            class="text-xs text-fg-faint mt-0.5 flex items-center gap-1"
                        >
                            <Rss :size="12" />
                            Published in {{ p.publishedIn }}
                        </p>
                    </a>
                </li>
            </ul>
        </div>

        <div class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-3"
            >
                License
            </p>
            <p class="text-xs text-fg-subtle leading-relaxed">
                This dataset is licensed under a
                {{ d.licenseName }}
                license.
            </p>
            <p class="text-xs text-fg-faint leading-relaxed mt-3">
                {{ d.licenseDescription }}
            </p>
        </div>
    </aside>
</template>
