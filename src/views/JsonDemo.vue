<script setup lang="ts">
import type { DatasetDetail } from "../api/dataset";
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

// 演示用的示例数据，结构与后端 DatasetDetailVO 一致
const d: DatasetDetail = {
    overview: {
        tag: "WQ",
        donatedDate: "2009-10-06",
        name: "葡萄酒质量",
        description:
            "包括两个数据集，分别与葡萄牙北部的红葡萄酒和白葡萄酒相关。目标是基于物理化学测试来模拟葡萄酒质量。",
        characteristics: "多变量",
        subjectArea: "商学",
        tasks: "分类，回归",
        featureType: "实数型",
        instances: 4898,
        features: 11,
        downloadSize: "89.2KB",
        previewType: 1,
    },
    intro: [
        {
            title: "附加说明",
            content:
                "这两个数据集与葡萄牙“Vinho Verde”葡萄酒的红色和白色变种有关。",
        },
        { title: "是否含有缺少值", content: "否" },
    ],
    fieldExplain: {
        columns: [
            { id: "role", name: "Role" },
            { id: "type", name: "Type" },
            { id: "description", name: "Description" },
            { id: "variableName", name: "Variable Name" },
        ],
        data: [
            {
                role: "Feature",
                type: "Continuous",
                description: "固定酸度",
                variableName: "fixed_acidity",
            },
            {
                role: "Feature",
                type: "Continuous",
                description: "挥发性酸度",
                variableName: "volatile_acidity",
            },
        ],
    },
    keywords: ["Chemistry"],
    creators: [
        { name: "Paulo Cortez" },
        { name: "F. Almeida" },
        { name: "T. Matos" },
    ],
    license: [
        {
            title: "This dataset is licensed under a Creative Commons Attribution 4.0 International (CC BY 4.0) license.",
            description:
                "This allows for the sharing and adaptation of the datasets for any purpose, provided that the appropriate credit is given.",
        },
    ],
    reference: [
        {
            url: "#",
            year: "2009",
            title: "Modeling wine preferences by data mining from physicochemical properties",
            authors:
                "P. Cortez, A. Cerdeira, Fernando Almeida, Telmo Matos, J. Reis",
            publishedIn: "Decision Support Systems",
        },
    ],
};
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
