<script setup lang="ts">
import { computed, ref } from "vue";
import { datasets, type DatasetSample } from "../data/datasets";
import DatasetDrawer from "./datasets/drawer.vue";
import HotSvg from "./datasets/hotSvg.vue";
import NewSvg from "./datasets/newSvg.vue";
import {
    Flame,
    Grid2x2Plus,
    ListSortDescending,
    Grid2x2,
    Astroid,
} from "@lucide/vue";

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

const navigateToDataset = (id: string) => {
    window.open("/datasets/" + id, "_blank");
};
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
                    <Flame
                        v-if="section.title === '热门数据集'"
                        :size="20"
                        class="text-fg"
                    />
                    <Grid2x2Plus v-else :size="20" class="text-fg" />
                    <h3 class="font-display text-lg text-fg font-semibold">
                        {{ section.title }}
                    </h3>
                </div>
                <div class="divide-y divide-border/50">
                    <div
                        v-for="d in section.datasets"
                        :key="d.id"
                        rel="noopener noreferrer"
                        class="group flex gap-4 px-6 py-5 hover:bg-surface-alt/60 transition-colors duration-200 cursor-default"
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
                                @click="() => navigateToDataset(d.id)"
                                class="text-fg font-medium group-hover:text-accent-cyan transition-colors duration-200 truncate cursor-pointer"
                            >
                                {{ d.name }}
                            </h4>
                            <p class="text-sm text-fg-subtle mt-1 line-clamp-2">
                                {{ d.description }}
                            </p>
                            <div class="flex items-center gap-x-8 gap-y-2 mt-3">
                                <span
                                    class="flex flex-1 gap-1 items-center font-mono text-xs text-fg-faint"
                                >
                                    <ListSortDescending :size="12" />
                                    {{ d.taskTypes.join(", ") }}
                                </span>
                                <span
                                    class="flex flex-1 gap-1 items-center font-mono text-xs text-fg-faint"
                                >
                                    <Grid2x2 :size="12" />
                                    {{ d.instances }}&thinsp;Instances
                                </span>
                                <span
                                    class="flex flex-1 gap-1 items-center font-mono text-xs text-fg-faint"
                                >
                                    <Astroid :size="12" />
                                    {{ d.features }}&thinsp;Features
                                </span>
                            </div>
                        </div>
                    </div>
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
