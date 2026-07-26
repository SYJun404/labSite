<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";
import type { DatasetSample } from "../../data/datasets";

const show = defineModel<boolean>("show", { required: true });

const windowWidth = ref(window.innerWidth);

const updateWidth = () => {
    windowWidth.value = window.innerWidth;
};

onMounted(() => {
    window.addEventListener("resize", () => {
        updateWidth();
    });
});

onUnmounted(() => {
    window.removeEventListener("resize", updateWidth);
});

defineProps<{
    datasets: DatasetSample[];
    title?: string;
    placement?: "left" | "right";
}>();

const navigateToDataset = (id: string) => {
    window.open("/datasets/" + id, "_blank");
};
</script>

<template>
    <n-drawer
        v-model:show="show"
        :width="windowWidth / 2"
        :placement="placement ?? 'right'"
    >
        <n-drawer-content
            :title="title ?? '热门数据集'"
            :native-scrollbar="false"
            bodyContentStyle="padding:12px 24px"
        >
            <div class="flex flex-col gap-3">
                <div
                    v-for="d in datasets"
                    :key="d.id"
                    :href="'/datasets/' + d.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex gap-4 rounded-xl border border-border/60 bg-surface-alt/30 p-4 hover:bg-surface-alt/80 transition-colors duration-200 cursor-default"
                >
                    <div
                        class="w-11 h-11 shrink-0 rounded-xl bg-surface-alt border border-border flex items-center justify-center"
                    >
                        <span
                            class="font-mono text-[11px] text-accent-blue font-semibold"
                        >
                            {{ d.tag }}
                        </span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4
                            @click="() => navigateToDataset(d.id)"
                            class="text-fg cursor-pointer font-medium group-hover:text-accent-cyan transition-colors duration-200 truncate"
                        >
                            {{ d.name }}
                        </h4>
                        <p
                            class="text-sm text-fg-subtle mt-1 line-clamp-2 leading-relaxed"
                        >
                            {{ d.description }}
                        </p>
                        <div class="flex items-center gap-x-8 gap-y-2 mt-3">
                            <span
                                class="flex flex-1 items-center font-mono text-xs text-fg-faint"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    class="w-3.5 h-3.5 mr-1"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path
                                        stroke-linecap="round"
                                        d="M20 20l-3.5-3.5"
                                    />
                                </svg>
                                {{ d.taskTypes.join(", ") }}
                            </span>
                            <span
                                class="flex flex-1 items-center font-mono text-xs text-fg-faint"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    class="w-3.5 h-3.5 mr-1"
                                >
                                    <rect
                                        x="3.5"
                                        y="3.5"
                                        width="17"
                                        height="17"
                                        rx="2"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        d="M3.5 9.5h17M9.5 3.5v17"
                                    />
                                </svg>
                                {{ d.instances }} Instances
                            </span>
                            <span
                                class="flex flex-1 items-center font-mono text-xs text-fg-faint"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    class="w-3.5 h-3.5 mr-1"
                                >
                                    <path
                                        stroke-linecap="round"
                                        d="M4 6h16M4 12h16M4 18h9"
                                    />
                                </svg>
                                {{ d.features }} Features
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </n-drawer-content>
    </n-drawer>
</template>
