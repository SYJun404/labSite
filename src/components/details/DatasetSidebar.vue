<script setup lang="ts">
import type { DatasetDetail } from "../../data/datasetDetail";

defineProps<{
    d: DatasetDetail;
}>();

function formatNumber(n: number): string {
    return n.toLocaleString("en-US");
}
</script>

<template>
    <aside class="space-y-4">
        <button class="btn-primary w-full justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-4 h-4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"
                />
            </svg>
            下载数据集
            <span class="opacity-70">({{ d.downloadSizeLabel }})</span>
        </button>

        <button
            class="w-full inline-flex items-center justify-center gap-2 bg-accent-cyan text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity duration-300"
        >
            引用数据集
        </button>

        <div class="card p-6 flex flex-col gap-3">
            <p class="flex items-center gap-2 text-sm text-fg-subtle">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    class="w-4 h-4 text-fg-faint"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7 7h4v4c0 2.5-1.5 4-4 4v-2c1 0 2-.7 2-2H7V7zm7 0h4v4c0 2.5-1.5 4-4 4v-2c1 0 2-.7 2-2h-2V7z"
                    />
                </svg>
                {{ formatNumber(d.citations) }} citations
            </p>
            <p class="flex items-center gap-2 text-sm text-fg-subtle">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    class="w-4 h-4 text-fg-faint"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
                    />
                    <circle cx="12" cy="12" r="2.6" />
                </svg>
                {{ formatNumber(d.views) }} views
            </p>
        </div>

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
                    class="flex items-center gap-2.5 text-sm text-fg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        class="w-4 h-4 text-fg-faint shrink-0"
                    >
                        <circle cx="12" cy="8" r="3.2" />
                        <path
                            stroke-linecap="round"
                            d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
                        />
                    </svg>
                    {{ c }}
                </li>
            </ul>
        </div>

        <div class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-3"
            >
                DOI
            </p>
            <a
                :href="`https://doi.org/${d.doi}`"
                class="font-mono text-sm text-accent-blue hover:text-accent-cyan transition-colors duration-200 break-all"
            >
                {{ d.doi }}
            </a>
        </div>

        <div class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-3"
            >
                License
            </p>
            <p class="text-xs text-fg-subtle leading-relaxed">
                This dataset is licensed under a
                <a
                    :href="d.licenseHref"
                    class="text-accent-cyan hover:text-accent-blue underline underline-offset-2 transition-colors duration-200"
                >
                    {{ d.licenseName }}
                </a>
                license.
            </p>
            <p class="text-xs text-fg-faint leading-relaxed mt-3">
                {{ d.licenseDescription }}
            </p>
        </div>
    </aside>
</template>
