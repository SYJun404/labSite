<script setup lang="ts">
import { computed, ref } from "vue";
import { usePdfiumEngine } from "@embedpdf/engines/vue";
import { EmbedPDF } from "@embedpdf/core/vue";
import { createPluginRegistration } from "@embedpdf/core";
import { ViewportPluginPackage, Viewport } from "@embedpdf/plugin-viewport/vue";
import { ScrollPluginPackage, Scroller } from "@embedpdf/plugin-scroll/vue";
import { TilingPluginPackage } from "@embedpdf/plugin-tiling/vue";
import { SpreadPluginPackage, SpreadMode } from "@embedpdf/plugin-spread/vue";
import {
    DocumentContent,
    DocumentManagerPluginPackage,
} from "@embedpdf/plugin-document-manager/vue";
import { RenderLayer, RenderPluginPackage } from "@embedpdf/plugin-render/vue";
import { ZoomPluginPackage, ZoomMode } from "@embedpdf/plugin-zoom/vue";
import PDFConfigure from "./PDFConfigure.vue";
import { InteractionManagerPluginPackage } from "@embedpdf/plugin-interaction-manager/vue";
import { ThumbnailPluginPackage } from "@embedpdf/plugin-thumbnail/vue";
import { ExportPluginPackage } from "@embedpdf/plugin-export/vue";

const props = defineProps<{
    url: string;
    title?: string;
}>();

const { engine, isLoading } = usePdfiumEngine();
console.log(props.title);

const plugins = computed(() => [
    createPluginRegistration(DocumentManagerPluginPackage, {
        initialDocuments: [{ url: props.url }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
    createPluginRegistration(TilingPluginPackage),
    createPluginRegistration(InteractionManagerPluginPackage),
    createPluginRegistration(ZoomPluginPackage, {
        defaultZoomLevel: ZoomMode.FitPage,
    }),
    createPluginRegistration(SpreadPluginPackage, {
        defaultSpreadMode: SpreadMode.None,
    }),
    createPluginRegistration(ThumbnailPluginPackage, {
        width: 120,
        paddingY: 5,
    }),
    createPluginRegistration(ExportPluginPackage, {
        defaultFileName: "document.pdf",
    }),
]);
</script>

<template>
    <div v-if="isLoading || !engine" class="loading-pane">
        <span class="font-mono">Loading Engine...</span>
    </div>

    <div v-else style="height: 100%">
        <EmbedPDF
            :engine="engine"
            :plugins="plugins"
            v-slot="{ activeDocumentId }"
        >
            <DocumentContent
                v-if="activeDocumentId"
                :document-id="activeDocumentId"
                v-slot="{ isLoaded }"
            >
                <div v-if="!isLoaded" class="loading-pane">
                    <div class="spinner"></div>
                    <span class="font-mono ml-3">Loading PDF...</span>
                </div>

                <PDFConfigure v-if="isLoaded" :document-id="activeDocumentId" />
            </DocumentContent>
        </EmbedPDF>
    </div>
</template>

<style scoped>
.loading-pane {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgb(var(--c-border));
    border-top-color: rgb(var(--c-accent-blue));
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
