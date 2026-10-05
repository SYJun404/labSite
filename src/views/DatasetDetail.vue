<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { datasetApi, type DatasetDetail } from "../api/dataset";
import Navbar from "../components/Navbar.vue";

import DatasetHeader from "../components/details/DatasetHeader.vue";
import DatasetMetaGrid from "../components/details/DatasetMetaGrid.vue";
import DatasetInfoSection from "../components/details/DatasetInfoSection.vue";
import DatasetVariablesTable from "../components/details/DatasetVariablesTable.vue";
import DatasetPreviewTable from "../components/details/DatasetPreviewTable.vue";
import DatasetSidebar from "../components/details/DatasetSidebar.vue";
import Footer from "../components/Footer.vue";
import Json4u from "../components/jsonVisualization/Json4u.vue";

const route = useRoute();

const d = ref<DatasetDetail | null>(null);
const loading = ref(false);
const error = ref("");

// 侧边栏：隐藏滚动条，内容超高时在底部显示渐隐+模糊遮罩
const sidebarScroll = ref<HTMLElement | null>(null);
const showSidebarFade = ref(false);
let sidebarObserver: ResizeObserver | null = null;

function updateSidebarFade() {
    const el = sidebarScroll.value;
    if (!el) {
        showSidebarFade.value = false;
        return;
    }
    const overflow = el.scrollHeight - el.clientHeight > 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    // 仅在内容溢出且尚未滚动到底部时展示渐隐遮罩
    showSidebarFade.value = overflow && !atBottom;
}

watch(sidebarScroll, (el) => {
    sidebarObserver?.disconnect();
    sidebarObserver = null;
    if (!el) return;
    sidebarObserver = new ResizeObserver(updateSidebarFade);
    sidebarObserver.observe(el);
    if (el.firstElementChild) {
        sidebarObserver.observe(el.firstElementChild);
    }
    updateSidebarFade();
});

watch(
    () => d.value,
    async () => {
        await nextTick();
        updateSidebarFade();
    },
);

onBeforeUnmount(() => sidebarObserver?.disconnect());

async function load(datasetId: string) {
    if (!datasetId) {
        error.value = "缺少数据集编号";
        return;
    }
    loading.value = true;
    error.value = "";
    try {
        d.value = await datasetApi.getByDatasetId(datasetId);
    } catch (e) {
        d.value = null;
        error.value = e instanceof Error ? e.message : "数据加载失败";
    } finally {
        loading.value = false;
    }
}

watch(() => String(route.params.id ?? ""), load, { immediate: true });
</script>

<template>
    <div class="min-h-screen bg-bg">
        <Navbar :fixed="false" />
        <div class="section-pad !pt-8 !pb-20">
            <div v-if="loading" class="py-24 text-center text-fg-subtle">
                正在加载数据集…
            </div>
            <div v-else-if="error" class="py-24 text-center">
                <p class="text-fg">{{ error }}</p>
                <p class="mt-2 text-sm text-fg-subtle">
                    未能获取数据集信息，请稍后重试。
                </p>
            </div>
            <div v-else-if="d" class="space-y-8">
                <!-- ============ 主内容与侧边栏（同一行） ============ -->
                <div
                    class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
                >
                    <!-- 主内容列：决定该行高度 -->
                    <div class="lg:col-span-2 space-y-8">
                        <div class="card divide-y divide-border/60">
                            <DatasetHeader :d="d" />
                            <DatasetMetaGrid :d="d" />
                        </div>
                        <DatasetInfoSection :d="d" />
                    </div>

                    <!-- 侧边栏：高度跟随主内容列，过高时内部滚动 -->
                    <div class="relative">
                        <div
                            ref="sidebarScroll"
                            class="sidebar-scroll lg:absolute lg:inset-0 lg:overflow-y-auto"
                            @scroll.passive="updateSidebarFade"
                        >
                            <DatasetSidebar :d="d" />
                        </div>
                        <!-- 底部渐隐 + 模糊：内容超出时提示可继续滚动 -->
                        <div
                            v-show="showSidebarFade"
                            class="sidebar-fade pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg via-bg/70 to-transparent backdrop-blur-[2px]"
                        ></div>
                    </div>
                </div>

                <!-- ============ 全宽内容 ============ -->
                <DatasetVariablesTable :d="d" />
                <!-- 根据previewType 展示不同的数据 -->

                <DatasetPreviewTable
                    v-if="d.overview?.previewType === 1"
                    :d="d"
                />
                <Json4u v-if="d.overview?.previewType === 2" :d="d" />
            </div>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
/* 隐藏滚动条，但保留滚动能力 */
.sidebar-scroll {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE / Edge */
}
.sidebar-scroll::-webkit-scrollbar {
    display: none; /* Chrome / Safari */
}

/* 让渐隐与背景模糊向上柔和过渡 */
.sidebar-fade {
    -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 100%);
    mask-image: linear-gradient(to top, #000 0%, transparent 100%);
}
</style>
