<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { publications } from "../data/publications";
import BaseModal from "./shared/BaseModal.vue";
import PDFViewer from "./pdf/PDFViewer.vue";

const showPdfModal = ref(false);
const selectedPdfUrl = ref<string | undefined>(undefined);
const selectedPdfTitle = ref<string | undefined>(undefined);

const activeYear = ref<number | null>(null);

const grouped: any = computed(() => {
    const map: any = {};
    publications.forEach((p) => {
        if (!map[p.year]) map[p.year] = [];
        map[p.year].push(p);
    });
    return Object.entries(map).sort((a: any, b: any) => b[0] - a[0]);
});

/** All years from filtered data, sorted descending */
const years = computed(() => {
    return grouped.value.map(([year]: any) => Number(year));
});

/** Reset active year when filtered data changes */
watch(
    grouped,
    () => {
        if (years.value.length > 0) {
            if (
                activeYear.value === null ||
                !years.value.includes(activeYear.value)
            ) {
                activeYear.value = years.value[0];
            }
        } else {
            activeYear.value = null;
        }
    },
    { immediate: true },
);

/** Only the active year's publications */
const selectedItems = computed(() => {
    if (!activeYear.value) return [];
    const entry = grouped.value.find(
        ([year]: any) => Number(year) === activeYear.value,
    );
    return entry ? entry[1] : [];
});

const openPdfViewer = (pub: (typeof publications)[number]) => {
    console.log(pub);
    if (pub.pdfUrl) {
        selectedPdfUrl.value = pub.pdfUrl;
        selectedPdfTitle.value = pub.title + ".pdf";
        showPdfModal.value = true;
    }
};
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

            <div
                class="overflow-x-auto max-w-full md:max-w-[400px] lg:max-w-[500px]"
            >
                <div class="min-w-[400px]">
                    <div class="relative overflow-hidden">
                        <!-- Horizontal guide line -->
                        <div
                            class="absolute inset-x-0 top-[10px] h-px bg-border"
                        ></div>

                        <div class="relative flex justify-between items-start">
                            <button
                                v-for="year in years"
                                :key="year"
                                @click="activeYear = year"
                                class="flex flex-col items-center gap-2 group"
                            >
                                <!-- Dot -->
                                <div
                                    class="relative z-10 w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all duration-300"
                                    :class="
                                        activeYear === year
                                            ? 'bg-accent-cyan border-accent-cyan shadow-[0_0_18px_rgba(61,217,196,0.4)]'
                                            : 'bg-surface border-border group-hover:border-accent-cyan/50 group-hover:bg-surface-alt'
                                    "
                                >
                                    <div
                                        v-if="activeYear === year"
                                        class="w-[8px] h-[8px] rounded-full bg-bg"
                                    ></div>
                                </div>

                                <!-- Year label -->
                                <span
                                    class="font-display text-base !leading-none tabular-nums transition-all duration-300 whitespace-nowrap"
                                    :class="
                                        activeYear === year
                                            ? 'text-accent-cyan font-semibold'
                                            : 'text-fg-muted group-hover:text-fg'
                                    "
                                >
                                    {{ year }}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ====== Publications for active year ====== -->
        <div>
            <!-- Year heading with entry count -->
            <div v-if="activeYear" class="flex items-baseline gap-3 mb-6">
                <h3
                    class="font-display text-2xl md:text-3xl font-semibold text-fg tracking-tight"
                >
                    {{ activeYear }}
                </h3>
                <span class="font-mono text-sm text-fg-faint">
                    {{ selectedItems.length }}篇论文
                </span>
            </div>

            <Transition name="fade-slide" mode="out-in">
                <div
                    v-if="selectedItems.length > 0"
                    :key="activeYear ?? 'active'"
                    class="space-y-4"
                >
                    <article
                        v-for="pub in selectedItems"
                        :key="pub.title"
                        class="group card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div class="flex-1">
                            <div class="flex items-center gap-3 flex-wrap">
                                <h4
                                    class="font-display cursor-pointer group-hover:text-accent-cyan transition-colors duration-300 text-lg text-fg font-medium"
                                    @click="openPdfViewer(pub)"
                                >
                                    {{ pub.title }}
                                </h4>
                                <span
                                    v-if="pub.highlight"
                                    class="tag-pill !bg-signal-gradient !text-white !border-none font-semibold"
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
                                >
                                    {{ t }}
                                </span>
                            </div>
                        </div>
                        <div
                            class="font-mono text-sm text-fg-faint whitespace-nowrap"
                        >
                            {{ pub.venue }} {{ pub.year }}
                        </div>
                    </article>
                </div>

                <p
                    v-else
                    :key="'empty'"
                    class="text-fg-subtle text-sm py-12 text-center"
                >
                    暂无匹配的论文条目。
                </p>
            </Transition>
        </div>

        <!-- PDF 预览模态框 -->
        <BaseModal v-model="showPdfModal" title="PDF 预览">
            <PDFViewer
                v-if="selectedPdfUrl !== undefined"
                :url="selectedPdfUrl"
                :title="selectedPdfTitle"
            />
        </BaseModal>
    </section>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
}
.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(12px);
}
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}
</style>
