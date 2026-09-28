<script setup lang="ts">
import { datasetDetail } from "../data/datasetDetail";
import Navbar from "../components/Navbar.vue";

import DatasetHeader from "../components/details/DatasetHeader.vue";
import DatasetMetaGrid from "../components/details/DatasetMetaGrid.vue";
import DatasetInfoSection from "../components/details/DatasetInfoSection.vue";
import DatasetVariablesTable from "../components/details/DatasetVariablesTable.vue";
import DatasetPreviewTable from "../components/details/DatasetPreviewTable.vue";
import DatasetSidebar from "../components/details/DatasetSidebar.vue";
import Footer from "../components/Footer.vue";
import Json4u from "../components/jsonVisualization/Json4u.vue";
import { ref } from "vue";
const value = ref(
    JSON.stringify(
        {
            name: "json4u-vue",
            version: "0.1.0",
            tags: ["json", "vue", "graph"],
            author: {
                name: "you",
                links: {
                    home: "https://example.com",
                    empty: {},
                },
            },
            items: [
                {
                    id: 1,
                    ok: true,
                    price: 9.9,
                },
                {
                    id: 2,
                    ok: false,
                    price: null,
                },
            ],
        },
        null,
        2,
    ),
);
const d = datasetDetail;
</script>

<template>
    <div class="min-h-screen bg-bg">
        <Navbar :fixed="false" />
        <div class="section-pad !pt-8 !pb-20">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <!-- ============ 主内容列 ============ -->
                <div class="lg:col-span-2 space-y-8">
                    <div class="card divide-y divide-border/60">
                        <DatasetHeader :d="d" />
                        <DatasetMetaGrid :d="d" />
                    </div>
                    <DatasetInfoSection :d="d" />
                    <DatasetVariablesTable :d="d" />
                    <Json4u v-model="value" style="height: 100%" />
                </div>

                <!-- ============ 侧边栏 ============ -->
                <DatasetSidebar :d="d" />
            </div>
        </div>
        <Footer />
    </div>
</template>
