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
        <button
            class="w-full flex items-center justify-between px-8 py-6 text-left"
            @click="isOpen = !isOpen"
        >
            <h2 class="font-display text-xl text-fg font-semibold">变量表格</h2>
            <span class="text-fg-faint font-mono text-lg w-5 text-center">{{
                isOpen ? "−" : "+"
            }}</span>
        </button>
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
