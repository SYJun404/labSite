<script setup lang="ts">
import { RotateCcw, ZoomIn, ZoomOut, PanelLeft } from "@lucide/vue";
import ToolbarButton from "../pdf/ToolbarButton.vue";
import { onMounted } from "vue";

defineOptions({ name: "Json4uToolbar" });

const emit = defineEmits<{
    format: [];
    /** 缩放因子，例如 1.25 / 0.8 */
    zoom: [factor: number];
    fit: [];
    showPanel: [];
}>();

onMounted(() => {
    // 监听 -= 按键
    window.addEventListener("keydown", (e) => {
        if (e.key === "-") {
            e.preventDefault();
            emit("zoom", 1 / 1.25);
        } else if (e.key === "=") {
            e.preventDefault();
            emit("zoom", 1.25);
        }
    });
});
</script>

<template>
    <div class="j4u-bar px-8 py-3.5 gap-2 border-b border-border/60">
        <ToolbarButton @click="emit('showPanel')"
            ><PanelLeft :size="16" />
        </ToolbarButton>
        <ToolbarButton @click="emit('fit')"
            ><RotateCcw :size="16" />
        </ToolbarButton>

        <span class="j4u-spacer"></span>

        <ToolbarButton @click="emit('zoom', 1 / 1.25)"
            ><ZoomOut :size="16" />
        </ToolbarButton>
        <ToolbarButton @click="emit('zoom', 1.25)"
            ><ZoomIn :size="16" />
        </ToolbarButton>
    </div>
</template>
