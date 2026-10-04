<script setup lang="ts">
import { ref, watch } from "vue";
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

const route = useRoute();

const d = ref<DatasetDetail | null>(null);
const loading = ref(false);
const error = ref("");

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
            <div
                v-else-if="d"
                class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
                <!-- ============ 主内容列 ============ -->
                <div class="lg:col-span-2 space-y-8">
                    <div class="card divide-y divide-border/60">
                        <DatasetHeader :d="d" />
                        <DatasetMetaGrid :d="d" />
                    </div>
                    <DatasetInfoSection :d="d" />
                    <DatasetVariablesTable :d="d" />
                    <DatasetPreviewTable :d="d" />
                </div>

                <!-- ============ 侧边栏 ============ -->
                <DatasetSidebar :d="d" />
            </div>
        </div>
        <Footer />
    </div>
</template>
