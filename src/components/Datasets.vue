<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { datasetApi, type Dataset } from "../api/dataset";
import type { DatasetSample } from "../data/datasets";
import DatasetDrawer from "./datasets/drawer.vue";
import {
    Flame,
    Grid2x2Plus,
    ListSortDescending,
    Grid2x2,
    Astroid,
} from "@lucide/vue";

// 热门 / 最新数据集原始数据（后端已按对应维度排序）
const hottest = ref<Dataset[]>([]);
const latest = ref<Dataset[]>([]);

const loading = ref(true);
const loadError = ref("");

// 将样本规模格式化为紧凑的展示字符串，如 10000 -> 10K
function formatInstances(n?: number | null): string {
    if (n == null || Number.isNaN(n)) return "—";
    if (n >= 1_000_000)
        return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    return String(n);
}

// 后端任务字符串（如「分类，回归」）拆分为标签数组
function splitTasks(tasks?: string): string[] {
    return (tasks ?? "")
        .split(/[，,、;；]/)
        .map((t) => t.trim())
        .filter(Boolean);
}

// 后端数据集 -> 页面展示结构
function toSample(d: Dataset): DatasetSample {
    const id = d.datasetId ?? String(d.id ?? "");
    return {
        id,
        name: d.name ?? "未命名数据集",
        code: d.subjectArea ?? "",
        description: d.description ?? "",
        taskTypes: splitTasks(d.tasks),
        instances: formatInstances(d.instances),
        features: d.features ?? 0,
        tag: d.tag ?? "DS",
        releaseDate: (d.donatedDate ?? d.createTime ?? "").slice(0, 7),
        downloads: d.views ?? 0,
        href: `/datasets/${id}`,
    };
}

const popularSamples = computed<DatasetSample[]>(() =>
    hottest.value.map(toSample),
);
const newSamples = computed<DatasetSample[]>(() => latest.value.map(toSample));

// 抽屉中展示的全部数据集
const allPopularDatasets = computed<DatasetSample[]>(
    () => popularSamples.value,
);
const allNewDatasets = computed<DatasetSample[]>(() => newSamples.value);

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

// 首页左右两栏各取前 5 条
const popularDatasets = computed<DatasetSample[]>(() =>
    popularSamples.value.slice(0, 5),
);

const newDatasets = computed<DatasetSample[]>(() =>
    newSamples.value.slice(0, 5),
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

async function fetchDatasets() {
    loading.value = true;
    loadError.value = "";
    try {
        const res = await datasetApi.getHotAndNew();
        hottest.value = res?.hottest ?? [];
        latest.value = res?.latest ?? [];
    } catch (e) {
        hottest.value = [];
        latest.value = [];
        loadError.value = e instanceof Error ? e.message : "数据加载失败";
    } finally {
        loading.value = false;
    }
}

onMounted(fetchDatasets);
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
                <template v-if="loading">正在加载数据样本…</template>
                <template v-else>
                    实验室数据平台目前收录 12
                    个数据样本，覆盖多模态、具身智能、图学习等研究方向，
                    供组内及合作团队复现实验与开展基准测试。
                </template>
            </p>
        </div>

        <div
            v-if="loading"
            class="card px-6 py-16 text-center text-sm text-fg-subtle"
        >
            正在加载数据集…
        </div>
        <div v-else-if="loadError" class="card px-6 py-16 text-center text-sm">
            <p class="text-fg">{{ loadError }}</p>
            <p class="mt-2 text-fg-subtle">未能获取数据集，请稍后重试。</p>
        </div>
        <div
            v-else-if="false"
            class="card px-6 py-16 text-center text-sm text-fg-subtle"
        >
            暂无数据集
        </div>
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    class="flex flex-1 gap-1 items-center font-mono text-xs text-fg-faint min-w-0"
                                >
                                    <ListSortDescending :size="12" />
                                    <!-- 文本单独处理 truncate -->
                                    <span class="truncate">
                                        {{ d.taskTypes.join(", ") }}
                                    </span>
                                </span>
                                <span
                                    class="flex flex-1 gap-1 items-center font-mono text-xs text-fg-faint min-w-0"
                                >
                                    <Grid2x2 :size="12" />
                                    <span class="truncate">
                                        {{ d.instances }}&thinsp;Instances
                                    </span>
                                </span>
                                <span
                                    class="flex flex-1 gap-1 items-center font-mono text-xs text-fg-faint min-w-0"
                                >
                                    <Astroid :size="12" />
                                    <span class="truncate">
                                        {{ d.features }}&thinsp;Features
                                    </span>
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
