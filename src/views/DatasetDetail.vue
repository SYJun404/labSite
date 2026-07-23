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
                    <DatasetPreviewTable :d="d" />
                </div>

                <!-- ============ 侧边栏 ============ -->
                <DatasetSidebar :d="d" />
            </div>
        </div>
        <Footer />
    </div>
</template>
