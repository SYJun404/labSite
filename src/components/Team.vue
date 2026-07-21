<script setup lang="ts">
import { pi, faculty, students, alumni } from "../data/team";
</script>

<template>
    <section id="team" class="section-pad border-t border-border/40">
        <div class="mb-16">
            <p class="eyebrow mb-4">People</p>
            <h2
                class="font-display text-3xl md:text-5xl font-semibold text-fg tracking-tight"
            >
                团队成员
            </h2>
        </div>

        <!-- PI -->
        <div class="card p-8 md:p-10 flex flex-col md:flex-row gap-8 mb-8">
            <div
                class="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl bg-signal-gradient flex items-center justify-center"
            >
                <span
                    class="font-display text-3xl font-semibold text-[#0A0B0F]"
                    >{{ pi.initials }}</span
                >
            </div>
            <div>
                <div class="flex items-baseline gap-3 flex-wrap">
                    <h3 class="font-display text-2xl text-fg font-semibold">
                        {{ pi.name }}
                    </h3>
                    <span class="font-mono text-sm text-fg-faint">{{
                        pi.nameEn
                    }}</span>
                </div>
                <p class="text-accent-cyan text-sm mt-1">{{ pi.title }}</p>
                <p
                    class="mt-4 text-sm text-fg-subtle leading-relaxed max-w-3xl"
                >
                    {{ pi.bio }}
                </p>
                <div class="mt-5 flex gap-4 font-mono text-xs">
                    <a
                        :href="pi.homepage"
                        class="text-fg-subtle hover:text-accent-cyan transition-colors"
                        >个人主页 ↗</a
                    >
                    <a
                        :href="pi.scholar"
                        class="text-fg-subtle hover:text-accent-cyan transition-colors"
                        >Google Scholar ↗</a
                    >
                </div>
            </div>
        </div>

        <!-- Faculty -->
        <p class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-4">
            Faculty
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            <div
                v-for="f in faculty"
                :key="f.name"
                class="card p-6 flex items-center gap-4"
            >
                <div
                    class="w-14 h-14 shrink-0 rounded-xl bg-surface-alt border border-border flex items-center justify-center"
                >
                    <span
                        class="font-display text-base text-accent-cyan font-semibold"
                        >{{ f.initials }}</span
                    >
                </div>
                <div>
                    <p class="text-fg font-medium">{{ f.name }}</p>
                    <p class="text-xs text-fg-faint mt-0.5">{{ f.title }}</p>
                    <p class="text-xs text-fg-subtle mt-1">{{ f.focus }}</p>
                </div>
            </div>
        </div>

        <!-- Students -->
        <p class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-4">
            Graduate Students
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-14">
            <div
                v-for="s in students"
                :key="s.name"
                class="card p-5 text-center"
            >
                <div
                    class="w-12 h-12 mx-auto rounded-full bg-surface-alt border border-border flex items-center justify-center"
                >
                    <span
                        class="font-display text-sm text-accent-blue font-semibold"
                        >{{ s.initials }}</span
                    >
                </div>
                <p class="text-fg text-sm font-medium mt-3">{{ s.name }}</p>
                <p class="text-xs text-fg-faint mt-0.5">{{ s.degree }}</p>
                <p class="text-xs text-fg-subtle mt-1 leading-relaxed">
                    {{ s.focus }}
                </p>
            </div>
        </div>

        <!-- Alumni -->
        <p class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-4">
            Alumni
        </p>
        <div class="card divide-y divide-border/50">
            <div
                v-for="a in alumni"
                :key="a.name"
                class="flex items-center justify-between px-6 py-4"
            >
                <div class="flex items-center gap-4">
                    <span class="font-mono text-xs text-fg-faint w-16">{{
                        a.year
                    }}</span>
                    <span class="text-fg text-sm">{{ a.name }}</span>
                </div>
                <span class="text-xs text-fg-subtle">{{ a.went }}</span>
            </div>
        </div>
    </section>
</template>
