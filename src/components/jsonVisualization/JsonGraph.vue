<script setup lang="ts">
import { ref } from "vue";
import { CARD_W, HEAD_H, ROW_H } from "./graph";
import type { ContainerRow, Graph, JsonError } from "./types";

defineOptions({ name: "Json4uGraph" });

defineProps<{
    /** 图数据；为空时展示占位提示 */
    graph: Graph | null;
    /** 解析错误，用于占位提示文案 */
    error: JsonError | null;
    /** 当前高亮的 JSON 路径 */
    activePath: string | null;
    /** 画布位移 / 缩放样式 */
    canvasStyle: Record<string, string>;
    /** 是否播放平移动画 */
    animating: boolean;
    /** 截断上限，仅用于提示文案 */
    maxNodes: number;
}>();

const emit = defineEmits<{
    toggle: [path: string];
    select: [path: string];
}>();

const el = ref<HTMLDivElement | null>(null);

function countLabel(r: ContainerRow): string {
    return (r.isArray ? "[" : "{") + r.size + (r.isArray ? "]" : "}");
}

// 暴露根元素，供父组件进行 fit / 缩放 / 居中定位
defineExpose({ el });
</script>

<template>
    <div ref="el" class="j4u-view">
        <div v-if="!graph" class="j4u-empty">
            {{
                error
                    ? "JSON 有误，修正后会自动刷新图形"
                    : "打开或拖入一个 .json 文件"
            }}
        </div>
        <div
            v-else
            class="j4u-canvas"
            :class="{ 'j4u-anim': animating }"
            :style="canvasStyle"
        >
            <svg class="j4u-edges" :width="graph.width" :height="graph.height">
                <path v-for="e in graph.edges" :key="e.id" :d="e.d" />
            </svg>
            <div
                v-for="n in graph.nodes"
                :key="n.id"
                class="j4u-card"
                :class="{ 'j4u-active': n.id === activePath }"
                :style="{
                    left: n.x + 'px',
                    top: n.y + 'px',
                    width: CARD_W + 'px',
                    height: n.h + 'px',
                }"
            >
                <div
                    class="j4u-head"
                    :style="{ height: HEAD_H + 'px' }"
                    @click="emit('select', n.id)"
                >
                    <span class="j4u-title">{{ n.title }}</span>
                    <span class="j4u-kind">{{
                        n.isArray ? "Array" : "Object"
                    }}</span>
                </div>
                <div
                    v-for="(r, i) in n.rows"
                    :key="i"
                    class="j4u-row"
                    :class="{
                        'j4u-link': r.container,
                        'j4u-active': r.path && r.path === activePath,
                    }"
                    :style="{ height: ROW_H + 'px' }"
                    @click="r.path && emit('select', r.path)"
                >
                    <template v-if="r.container">
                        <span class="j4u-key" :title="r.key">{{ r.key }}</span>
                        <span class="j4u-count">{{ countLabel(r) }}</span>
                        <span
                            v-if="r.size"
                            class="j4u-chev"
                            :title="r.collapsed ? '展开' : '折叠'"
                            @click.stop="emit('toggle', r.path)"
                            >{{ r.collapsed ? "▸" : "▾" }}</span
                        >
                    </template>
                    <template v-else-if="r.more">
                        <span class="j4u-more">{{ r.text }}</span>
                    </template>
                    <template v-else>
                        <span class="j4u-key" :title="r.key">{{ r.key }}</span>
                        <span
                            class="j4u-val"
                            :class="'j4u-t-' + r.type"
                            :title="r.text"
                            >{{ r.text }}</span
                        >
                    </template>
                </div>
            </div>
        </div>
        <div v-if="graph && graph.truncated" class="j4u-warn">
            节点过多，已截断为前 {{ maxNodes }} 个
        </div>
    </div>
</template>
