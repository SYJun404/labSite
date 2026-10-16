<script setup lang="ts">
import { computed, ref } from "vue";
import type { Component } from "vue";
import type { DatasetDetail } from "../../api/dataset";
import BaseModal from "../shared/BaseModal.vue";
import {
    Download,
    User,
    Rss,
    Mail,
    MapPin,
    FileText,
    Globe,
    FlaskConical,
    Lock,
} from "@lucide/vue";

const props = defineProps<{
    d: DatasetDetail;
}>();

const showDownloadModal = ref(false);

// 数据集访问权限（由 overview.status 决定）
interface Permission {
    label: string;
    name: string;
    description: string;
    icon: Component;
    pillClass: string;
}

const PERMISSIONS: Record<number, Permission> = {
    1: {
        label: "Public",
        name: "互联网公开数据",
        description: "他人发表或从其他渠道获取的公开数据。",
        icon: Globe,
        pillClass: "text-accent-cyan border-accent-cyan/40",
    },
    2: {
        label: "Lab Public",
        name: "实验室公开数据",
        description: "实验室自行收集，允许公开查看的数据。",
        icon: FlaskConical,
        pillClass: "text-accent-blue border-accent-blue/40",
    },
    3: {
        label: "Lab Private",
        name: "实验室私有数据",
        description: "仅限实验室成员查看。",
        icon: Lock,
        pillClass: "text-accent-violet border-accent-violet/40",
    },
};

// status 为 0（Hidden，不展示该数据）或无对应取值时不渲染
const permission = computed<Permission | null>(() => {
    const status = props.d.overview?.status;
    return status == null ? null : (PERMISSIONS[status] ?? null);
});

const creators = computed(() => [
    ...new Set(
        (props.d.creators ?? [])
            .map((c) => c.name || c.contact || "")
            .filter(Boolean),
    ),
]);

const license = computed(() => props.d.license?.[0]);

const downloadInfo = computed(() => props.d.downloadInfo ?? null);

// 联系方式为邮箱时渲染成可点击的 mailto 链接
const contactMailto = computed(() => {
    const contact = downloadInfo.value?.contact?.trim();
    return contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
        ? `mailto:${contact}`
        : null;
});
</script>

<template>
    <aside class="space-y-4">
        <button
            class="btn-primary w-full justify-center"
            @click="showDownloadModal = true"
        >
            <Download :size="18" />
            获取数据集
        </button>

        <div v-if="permission" class="card p-6">
            <span
                class="font-mono text-xs uppercase inline-flex gap-2 items-center"
                :class="permission.pillClass"
            >
                <component :is="permission.icon" :size="12" />
                {{ permission.label }}
            </span>
            <p class="text-sm text-fg-muted leading-relaxed mt-3">
                {{ permission.name }}
            </p>
            <p class="text-xs text-fg-faint leading-relaxed">
                {{ permission.description }}
            </p>
        </div>

        <div v-if="d.creators?.length" class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-3"
            >
                Creators
            </p>
            <ul class="space-y-2.5">
                <li
                    v-for="c in creators"
                    :key="c"
                    class="flex items-center gap-1 text-sm font-mono text-fg-muted"
                >
                    <User class="text-fg-faint" :size="14" />
                    {{ c }}
                </li>
            </ul>
        </div>

        <div v-if="d.keywords?.length" class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-3"
            >
                Keywords
            </p>
            <div class="flex flex-wrap gap-2">
                <span v-for="k in d.keywords" :key="k" class="tag-pill">{{
                    k
                }}</span>
            </div>
        </div>

        <div v-if="d.reference?.length" class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-4"
            >
                reference
            </p>
            <ul class="space-y-4">
                <li v-for="(p, i) in d.reference ?? []" :key="i" class="group">
                    <a
                        :href="p.url || '#'"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block -mx-2 px-2 py-2 cursor-default"
                    >
                        <p
                            class="text-sm font-medium leading-snug mb-1 transition-colors duration-200 cursor-pointer text-accent-cyan hover:text-accent-blue underline underline-offset-2"
                        >
                            {{ p.title }}
                        </p>
                        <p class="text-xs text-fg-subtle leading-relaxed">
                            By {{ p.authors }}
                            <template v-if="p.year">{{ p.year }}</template>
                        </p>
                        <p
                            class="text-xs text-fg-faint mt-0.5 flex items-center gap-1"
                        >
                            <Rss :size="12" />
                            Published in {{ p.publishedIn }}
                        </p>
                    </a>
                </li>
            </ul>
        </div>

        <div v-if="d.license?.length" class="card p-6">
            <p
                class="font-mono text-xs uppercase tracking-wide text-fg-faint mb-3"
            >
                License
            </p>
            <p class="text-xs text-fg-subtle leading-relaxed">
                {{ license?.title }}
            </p>
            <p
                v-if="license?.description"
                class="text-xs text-fg-faint leading-relaxed mt-3"
            >
                {{ license.description }}
            </p>
        </div>

        <!-- 下载信息模态框 -->
        <BaseModal
            :width="50"
            :height="50"
            v-model="showDownloadModal"
            title="获取数据集"
            subtitle="该数据暂不支持直接下载，请参考以下方式获取。"
        >
            <div v-if="downloadInfo" class="divide-y divide-border/40">
                <div
                    v-if="downloadInfo.contact"
                    class="flex items-start gap-2 px-8 py-6"
                >
                    <Mail class="text-accent-cyan shrink-0" :size="18" />
                    <div class="min-w-0">
                        <p
                            class="font-mono text-xs tracking-wide text-fg-faint mb-1"
                        >
                            联系人
                        </p>
                        <a
                            v-if="contactMailto"
                            :href="contactMailto"
                            class="text-sm text-accent-cyan hover:text-accent-blue underline underline-offset-2 transition-colors duration-200 break-all"
                        >
                            {{ downloadInfo.contact }}
                        </a>
                        <p v-else class="text-sm text-fg-muted break-all">
                            {{ downloadInfo.contact }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="downloadInfo.address"
                    class="flex items-start gap-2 px-8 py-6"
                >
                    <MapPin
                        class="text-accent-cyan mt-px shrink-0"
                        :size="18"
                    />
                    <div class="min-w-0">
                        <p
                            class="font-mono text-xs tracking-wide text-fg-faint mb-1"
                        >
                            地址
                        </p>
                        <p class="text-sm text-fg-muted leading-relaxed">
                            {{ downloadInfo.address }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="downloadInfo.explanation"
                    class="flex items-start gap-2 px-8 py-6"
                >
                    <FileText
                        class="text-accent-cyan mt-px shrink-0"
                        :size="18"
                    />
                    <div class="min-w-0">
                        <p
                            class="font-mono text-xs tracking-wide text-fg-faint mb-1"
                        >
                            说明
                        </p>
                        <p
                            class="text-sm text-fg-muted leading-relaxed whitespace-pre-line"
                        >
                            {{ downloadInfo.explanation }}
                        </p>
                    </div>
                </div>
            </div>

            <div v-else class="px-8 py-16 text-center text-sm text-fg-subtle">
                该数据集暂未提供下载信息。
            </div>
        </BaseModal>
    </aside>
</template>
