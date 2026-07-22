<script setup lang="ts">
import { ref } from "vue";
import type { DatasetDetail } from "../../data/datasetDetail";

defineProps<{
    d: DatasetDetail;
}>();

const isOpen = ref(true);
</script>

<template>
    <div class="card overflow-hidden">
        <div
            class="w-full flex items-center justify-between px-8 py-6 text-left"
        >
            <h2 class="font-display text-xl text-fg font-semibold">变量表格</h2>
            <span class="flex items-center gap-3 shrink-0">
                <button
                    class="text-fg-faint hover:text-fg transition-colors duration-200"
                    title="全屏查看"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        class="w-4 h-4"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
                        />
                    </svg>
                </button>
            </span>
        </div>
        <div v-show="isOpen" class="border-t border-border/60 overflow-x-auto">
            <table class="w-full text-sm min-w-[640px]">
                <thead>
                    <tr
                        class="text-left font-mono text-xs uppercase tracking-wide text-fg-faint"
                    >
                        <th class="px-8 py-3 font-medium">Variable Name</th>
                        <th class="px-4 py-3 font-medium">Role</th>
                        <th class="px-4 py-3 font-medium">Type</th>
                        <th class="px-4 py-3 font-medium">Description</th>
                        <th class="px-4 py-3 font-medium">Unit</th>
                        <th class="px-8 py-3 font-medium">Missing</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/40">
                    <tr v-for="v in d.variables" :key="v.name">
                        <td class="px-8 py-3 font-mono text-fg">
                            {{ v.name }}
                        </td>
                        <td class="px-4 py-3 text-fg-subtle">
                            {{ v.role }}
                        </td>
                        <td class="px-4 py-3 text-fg-subtle">
                            {{ v.type }}
                        </td>
                        <td class="px-4 py-3 text-fg-subtle">
                            {{ v.description || "—" }}
                        </td>
                        <td class="px-4 py-3 text-fg-subtle">
                            {{ v.unit || "—" }}
                        </td>
                        <td class="px-8 py-3 text-fg-subtle">
                            {{ v.missing ? "yes" : "no" }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
