<script setup lang="ts">
import { ref, watch } from "vue";
import { Minimize } from "@lucide/vue";

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        /** Modal title (rendered in header slot fallback) */
        title?: string;
        /** Subtitle text below the title (rendered in header slot fallback) */
        subtitle?: string;
    }>(),
    {
        title: "",
        subtitle: "",
    },
);

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const visible = ref(props.modelValue);

watch(
    () => props.modelValue,
    (val) => {
        visible.value = val;
        document.body.style.overflow = val ? "hidden" : "";
    },
);

watch(visible, (val) => {
    emit("update:modelValue", val);
    if (!val) {
        document.body.style.overflow = "";
    }
});

function close() {
    visible.value = false;
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="visible"
                class="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
                @click.self="close"
            >
                <div
                    class="relative w-full mx-[4.7rem] h-[85vh] card hover:border-border/60 flex flex-col overflow-hidden"
                >
                    <!-- 模态框头部 -->
                    <div
                        class="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0"
                    >
                        <!-- 左侧标题区 -->
                        <slot name="header">
                            <div>
                                <h2
                                    class="font-display text-lg text-fg font-semibold"
                                >
                                    {{ title }}
                                </h2>
                                <p
                                    v-if="subtitle"
                                    class="font-mono text-xs text-fg-faint mt-0.5"
                                >
                                    {{ subtitle }}
                                </p>
                            </div>
                        </slot>
                        <button
                            class="text-fg-faint hover:text-fg transition-colors duration-200"
                            @click="close"
                        >
                            <Minimize :size="18" />
                        </button>
                    </div>

                    <!-- 模态框主体 -->
                    <div class="flex-1 overflow-auto">
                        <slot />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active {
    transition: opacity 0.2s ease;
}
.modal-leave-active {
    transition: opacity 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active > div {
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.2s ease;
}
.modal-leave-active > div {
    transition:
        transform 0.15s ease,
        opacity 0.15s ease;
}
.modal-enter-from > div {
    transform: scale(0.92) translateY(12px);
    opacity: 0;
}
.modal-leave-to > div {
    transform: scale(0.95) translateY(8px);
    opacity: 0;
}
</style>
