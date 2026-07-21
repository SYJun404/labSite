<script setup>
import { admissionTracks, applicationSteps } from "../data/news";
</script>

<template>
    <section id="admissions" class="section-pad border-t border-border/40">
        <div class="mb-16">
            <p class="eyebrow mb-4">Join Us</p>
            <h2
                class="font-display text-3xl md:text-5xl font-semibold text-fg tracking-tight"
            >
                招生宣传
            </h2>
            <p class="text-fg-subtle max-w-xl mt-4 text-sm leading-relaxed">
                实验室长期招收对机器学习、具身智能与大模型研究有热情的博士生、硕士生与科研实习生，欢迎自荐与套磁。
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div
                v-for="track in admissionTracks"
                :key="track.title"
                class="card p-8 flex flex-col"
            >
                <h3 class="font-display text-xl text-fg font-semibold">
                    {{ track.title }}
                </h3>
                <p class="font-mono text-xs text-accent-cyan/80 mt-1">
                    {{ track.titleEn }}
                </p>
                <p class="mt-4 text-sm text-fg-subtle leading-relaxed flex-1">
                    {{ track.desc }}
                </p>
                <ul class="mt-6 space-y-2">
                    <li
                        v-for="req in track.requirements"
                        :key="req"
                        class="flex items-start gap-2 text-xs text-fg-subtle"
                    >
                        <span
                            class="mt-1 w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0"
                        ></span>
                        {{ req }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- Application process -->
        <div class="mb-4">
            <p
                class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-8"
            >
                Application Process
            </p>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div
                    v-for="(item, idx) in applicationSteps"
                    :key="item.step"
                    class="relative"
                >
                    <div class="flex items-center gap-3 mb-3">
                        <span
                            class="font-display text-2xl text-accent-blue/70"
                            >{{ String(idx + 1).padStart(2, "0") }}</span
                        >
                        <div
                            v-if="idx < applicationSteps.length - 1"
                            class="hidden md:block h-px flex-1 bg-border/60"
                        ></div>
                    </div>
                    <h4 class="text-fg font-medium">{{ item.step }}</h4>
                    <p class="text-xs text-fg-subtle mt-2 leading-relaxed">
                        {{ item.desc }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>
