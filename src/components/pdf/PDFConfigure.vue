<script setup lang="ts">
import { ref, watch } from "vue";
import { Viewport } from "@embedpdf/plugin-viewport/vue";
import { Scroller, useScroll } from "@embedpdf/plugin-scroll/vue";
import { RenderLayer } from "@embedpdf/plugin-render/vue";
import { useZoom, MarqueeZoom, ZoomMode } from "@embedpdf/plugin-zoom/vue";
import { useSpread, SpreadMode } from "@embedpdf/plugin-spread/vue";
import ToolbarButton from "./ToolbarButton.vue";
import { TilingLayer } from "@embedpdf/plugin-tiling/vue";
import { ThumbnailsPane, ThumbImg } from "@embedpdf/plugin-thumbnail/vue";
import { useExport } from "@embedpdf/plugin-export/vue";
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Maximize2,
    FileText,
    BookOpen,
    Download,
} from "@lucide/vue";

const props = defineProps<{
    documentId: string;
}>();

const showThumbnails = ref(false);

const { provides: scroll, state: scrollState } = useScroll(
    () => props.documentId,
);
const { provides: zoom, state: zoomState } = useZoom(() => props.documentId);
const { provides: spread, spreadMode: spreadMode } = useSpread(
    () => props.documentId,
);
const { provides: exportApi } = useExport(() => props.documentId);

const pageInput = ref(String(scrollState.value.currentPage));

watch(
    () => scrollState.value.currentPage,
    (newPage) => {
        pageInput.value = String(newPage);
    },
);

const handleGoToPage = (e: Event) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput.value, 10);
    if (pageNumber >= 1 && pageNumber <= scrollState.value.totalPages) {
        scroll.value?.scrollToPage({ pageNumber });
    }
};
const handleSpreadMode = () => {
    if (!spread.value || !zoom.value) return;

    const nextSpreadMode =
        spreadMode.value !== SpreadMode.Odd ? SpreadMode.Odd : SpreadMode.None;

    const nextZoomMode =
        nextSpreadMode === SpreadMode.Odd
            ? ZoomMode.FitWidth
            : ZoomMode.FitPage;

    spread.value.setSpreadMode(nextSpreadMode);
    zoom.value.requestZoom(nextZoomMode);
};
</script>

<template>
    <div class="flex h-full flex-col overflow-hidden">
        <!-- Navigation Toolbar -->
        <div
            class="flex justify-center border-b border-border/60 bg-surface px-6 py-3.5 dark:border-gray-700 dark:bg-gray-800"
        >
            <!-- useZoom -->
            <div class="flex-1 flex justify-start gap-2">
                <ToolbarButton @click="zoom?.requestZoom(ZoomMode.FitPage)">
                    <RotateCcw :size="14" />
                </ToolbarButton>
                <ToolbarButton @click="zoom?.zoomOut()">
                    <ZoomOut :size="16" />
                </ToolbarButton>
                <div
                    class="w-12 h-8 rounded-md flex items-center justify-center bg-bg text-center shadow-sm ring-1 ring-gray-300 dark:bg-gray-700 dark:ring-gray-600"
                >
                    <span
                        class="font-mono text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        {{ Math.round(zoomState.currentZoomLevel * 100) }}%
                    </span>
                </div>
                <ToolbarButton @click="zoom?.zoomIn()">
                    <ZoomIn :size="16" />
                </ToolbarButton>
                <ToolbarButton @click="zoom?.requestZoom(ZoomMode.FitWidth)">
                    <Maximize2 :size="14" />
                </ToolbarButton>
            </div>

            <!-- useScroll -->
            <div class="flex-1 flex justify-center gap-2">
                <ToolbarButton
                    @click="scroll?.scrollToPreviousPage()"
                    :disabled="scrollState.currentPage <= 1"
                >
                    <ChevronLeft :size="18" />
                </ToolbarButton>
                <form @submit="handleGoToPage" class="flex items-center gap-2">
                    <input
                        v-model="pageInput"
                        type="number"
                        :min="1"
                        :max="scrollState.totalPages"
                        class="h-8 min-w-8 rounded-md border-0 bg-bg px-1 text-center font-mono font-medium text-fg shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 dark:ring-gray-600"
                    />
                    <span class="font-medium font-mono text-fg/50">
                        <span class="mr-[3px]">/</span
                        >{{ scrollState.totalPages }}</span
                    >
                </form>
                <ToolbarButton
                    @click="scroll?.scrollToNextPage()"
                    :disabled="
                        scrollState.currentPage >= scrollState.totalPages
                    "
                >
                    <ChevronRight :size="18" />
                </ToolbarButton>
            </div>

            <!-- useOther -->
            <div class="flex-1">
                <div class="flex items-center justify-end gap-2">
                    <div>
                        <button
                            @click="showThumbnails = !showThumbnails"
                            :class="[
                                'inline-flex items-center w-8 h-8 justify-center rounded-md shadow-sm transition-all active:scale-95',
                                showThumbnails
                                    ? 'bg-accent-blue text-white ring-1 ring-accent-blue/50'
                                    : 'bg-bg text-gray-600 ring-1 ring-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-100',
                            ]"
                            :title="
                                showThumbnails
                                    ? 'Hide thumbnails'
                                    : 'Show thumbnails'
                            "
                        >
                            <FileText :size="14" />
                        </button>
                    </div>
                    <div>
                        <button
                            @click="handleSpreadMode"
                            :class="[
                                'inline-flex items-center w-8 h-8 justify-center rounded-md shadow-sm transition-all active:scale-95',
                                spreadMode === SpreadMode.Odd
                                    ? 'bg-accent-blue text-white ring-1 ring-accent-blue/50'
                                    : 'bg-bg text-gray-600 ring-1 ring-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-100',
                            ]"
                        >
                            <BookOpen :size="14" />
                        </button>
                    </div>
                    <ToolbarButton
                        :disabled="!exportApi"
                        @click="exportApi?.download()"
                    >
                        <Download :size="14" />
                    </ToolbarButton>
                </div>
            </div>
        </div>

        <!-- Main Content: Sidebar + Viewer -->
        <div class="relative min-h-0 flex-1 flex overflow-hidden">
            <!-- Thumbnail Sidebar -->
            <div
                v-if="showThumbnails"
                class="h-full w-[140px] flex-shrink-0 border-r border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            >
                <ThumbnailsPane
                    :document-id="documentId"
                    class="thumbnail-scroll"
                >
                    <template #default="{ meta }">
                        <div
                            :key="meta.pageIndex"
                            class="absolute flex w-full cursor-pointer flex-col items-center px-2"
                            :style="{
                                height: meta.wrapperHeight + 'px',
                                top: meta.top + 'px',
                            }"
                            @click="
                                scroll?.scrollToPage?.({
                                    pageNumber: meta.pageIndex + 1,
                                })
                            "
                        >
                            <div
                                :class="[
                                    'overflow-hidden rounded-md transition-all',
                                    scrollState.currentPage ===
                                    meta.pageIndex + 1
                                        ? 'ring-2 ring-accent-blue/50 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900'
                                        : 'ring-1 ring-gray-300 hover:ring-accent-blue/50 dark:ring-gray-700 dark:hover:ring-gray-600',
                                ]"
                                :style="{
                                    width: meta.width + 'px',
                                    height: meta.height + 'px',
                                }"
                            >
                                <ThumbImg
                                    :document-id="documentId"
                                    :meta="meta"
                                    :style="{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }"
                                />
                            </div>
                            <div
                                class="mt-1 flex items-center justify-center"
                                :style="{ height: meta.labelHeight + 'px' }"
                            >
                                <span
                                    :class="[
                                        'text-xs font-mono font-medium',
                                        scrollState.currentPage ===
                                        meta.pageIndex + 1
                                            ? 'text-accent-blue dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-300',
                                    ]"
                                >
                                    {{ meta.pageIndex + 1 }}
                                </span>
                            </div>
                        </div>
                    </template>
                </ThumbnailsPane>
            </div>

            <!-- PDF Viewer Area -->
            <div class="relative flex-1">
                <Viewport
                    :document-id="documentId"
                    class="absolute inset-0 bg-surface"
                >
                    <Scroller :document-id="documentId">
                        <template #default="{ page }">
                            <RenderLayer
                                :document-id="documentId"
                                :page-index="page.pageIndex"
                            />
                            <TilingLayer
                                :document-id="documentId"
                                :page-index="page.pageIndex"
                            />
                            <MarqueeZoom
                                :document-id="documentId"
                                :page-index="page.pageIndex"
                            />
                        </template>
                    </Scroller>
                </Viewport>
            </div>
        </div>
    </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    appearance: textfield;
}

/* Hide scrollbar in the thumbnails pane while keeping scroll functionality */
:deep(.thumbnail-scroll) {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
}
:deep(.thumbnail-scroll::-webkit-scrollbar) {
    display: none; /* Chrome / Safari / Edge */
}
</style>
