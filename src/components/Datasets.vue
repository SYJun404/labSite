<script setup lang="ts">
import { computed, ref } from "vue";
import { datasets, type DatasetSample } from "../data/datasets";
import DatasetDrawer from "./datasets/drawer.vue";
import HotSvg from "./datasets/hotSvg.vue";
import NewSvg from "./datasets/newSvg.vue";

const totalDatasets = computed(() => datasets.length);

// 抽屉中展示的全部数据集
const allPopularDatasets = computed<DatasetSample[]>(() =>
    [...datasets].sort((a, b) => b.downloads - a.downloads),
);

const allNewDatasets = computed<DatasetSample[]>(() =>
    [...datasets].sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1)),
);

const showDrawer = ref(false);
const drawerTitle = ref("热门数据集");
const drawerPlacement = ref<"left" | "right">("right");
const drawerDatasets = ref<DatasetSample[]>([]);

function openDrawer(section: "popular" | "new") {
    if (section === "popular") {
        drawerTitle.value = "热门数据集";
        drawerDatasets.value = allPopularDatasets.value;
        drawerPlacement.value = "right";
    } else {
        drawerTitle.value = "最新数据集";
        drawerDatasets.value = allNewDatasets.value;
        drawerPlacement.value = "left";
    }
    showDrawer.value = true;
}

// 仿 UCI 首页：左栏按下载/引用量排序的「热门数据样本」
const popularDatasets = computed<DatasetSample[]>(() =>
    [...datasets].sort((a, b) => b.downloads - a.downloads).slice(0, 5),
);

// 右栏按发布时间排序的「最新数据样本」
const newDatasets = computed<DatasetSample[]>(() =>
    [...datasets]
        .sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1))
        .slice(0, 5),
);

interface SectionConfig {
    title: string;
    linkText: string;
    tagColor: string;
    datasets: DatasetSample[];
}

const sections = computed<SectionConfig[]>(() => [
    {
        title: "热门数据集",
        linkText: "查看更多热门数据集",
        tagColor: "text-accent-blue",
        datasets: popularDatasets.value,
    },
    {
        title: "最新数据集",
        linkText: "查看更多最新数据集",
        tagColor: "text-accent-violet",
        datasets: newDatasets.value,
    },
]);
</script>

<template>
    <section id="datasets" class="section-pad border-t border-border/40">
        <div
            class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
            <div>
                <p class="eyebrow mb-4">Datasets</p>
                <h2
                    class="font-display text-3xl md:text-5xl font-semibold text-fg tracking-tight"
                >
                    数据样本
                </h2>
            </div>
            <p class="text-fg-subtle max-w-md text-sm leading-relaxed">
                实验室数据平台目前收录
                {{ totalDatasets }}
                个数据样本，覆盖多模态、具身智能、图学习等研究方向，
                供组内及合作团队复现实验与开展基准测试。
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
                v-for="section in sections"
                :key="section.title"
                class="card overflow-hidden"
            >
                <div
                    class="px-6 flex gap-2 items-center py-5 border-b border-border/60"
                >
                    <HotSvg
                        v-if="section.title === '热门数据集'"
                        :size="20"
                        color="#0A0B0F"
                    />
                    <NewSvg v-else :size="20" color="#0A0B0F" />
                    <h3 class="font-display text-lg text-fg font-semibold">
                        {{ section.title }}
                    </h3>
                </div>
                <div class="divide-y divide-border/50">
                    <a
                        v-for="d in section.datasets"
                        :key="d.id"
                        :href="'/datasets/' + d.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group flex gap-4 px-6 py-5 hover:bg-surface-alt/60 transition-colors duration-200"
                    >
                        <div
                            class="w-12 h-12 shrink-0 rounded-xl bg-surface-alt border border-border flex items-center justify-center"
                        >
                            <span
                                class="font-mono text-[11px] font-semibold"
                                :class="section.tagColor"
                                >{{ d.tag }}</span
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <h4
                                class="text-fg font-medium group-hover:text-accent-cyan transition-colors duration-200 truncate"
                            >
                                {{ d.name }}
                            </h4>
                            <p class="text-sm text-fg-subtle mt-1 line-clamp-2">
                                {{ d.description }}
                            </p>
                            <div class="flex items-center gap-x-8 gap-y-2 mt-3">
                                <span
                                    class="flex flex-1 items-center font-mono text-xs text-fg-faint"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        class="w-3.5 h-3.5"
                                    >
                                        <circle cx="11" cy="11" r="7" />
                                        <path
                                            stroke-linecap="round"
                                            d="M20 20l-3.5-3.5"
                                        />
                                    </svg>
                                    {{ d.taskTypes.join(", ") }}
                                </span>
                                <span
                                    class="flex flex-1 items-center font-mono text-xs text-fg-faint"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        class="w-3.5 h-3.5"
                                    >
                                        <rect
                                            x="3.5"
                                            y="3.5"
                                            width="17"
                                            height="17"
                                            rx="2"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            d="M3.5 9.5h17M9.5 3.5v17"
                                        />
                                    </svg>
                                    {{ d.instances }} Instances
                                </span>
                                <span
                                    class="flex flex-1 items-center font-mono text-xs text-fg-faint"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        class="w-3.5 h-3.5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            d="M4 6h16M4 12h16M4 18h9"
                                        />
                                    </svg>
                                    {{ d.features }} Features
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="px-6 py-4 border-t border-border/60 text-center">
                    <a
                        href="#"
                        class="font-mono text-xs tracking-wide uppercase text-accent-cyan hover:text-accent-blue transition-colors duration-200 cursor-pointer"
                        @click.prevent="
                            openDrawer(
                                section.title === '热门数据集'
                                    ? 'popular'
                                    : 'new',
                            )
                        "
                    >
                        {{ section.linkText }}
                    </a>
                </div>
            </div>
        </div>

        <DatasetDrawer
            v-model:show="showDrawer"
            :datasets="drawerDatasets"
            :title="drawerTitle"
            :placement="drawerPlacement"
        />
    </section>
</template>
