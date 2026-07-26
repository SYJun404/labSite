<script setup lang="ts">
// 数据向下传递（Props），事件向上冒泡（Emits）
defineProps<{
    disabled?: boolean;
}>();

defineEmits<{
    click: [];
}>();
</script>

<template>
    <button
        :disabled="disabled"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-bg text-gray-600 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-100"
        @click="$emit('click')"
    >
        <slot />
    </button>
</template>
