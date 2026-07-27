<script setup lang="ts">
import { lab } from "../data/research";
import { MousePointerClick } from "@lucide/vue";
</script>

<template>
    <section
        id="top"
        class="relative min-h-screen flex items-center overflow-hidden bg-grid-fade pt-20"
    >
        <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg"
        ></div>

        <div class="relative z-10 w-full section-pad !py-0">
            <div class="max-w-7xl">
                <p class="eyebrow mb-6">
                    {{ lab.university }} · {{ lab.affiliation }}
                </p>
                <h1
                    class="font-display text-5xl md:text-7xl font-semibold text-fg leading-[1.05] tracking-tightest"
                >
                    {{ lab.tagline }}
                </h1>
                <p
                    class="mt-6 font-mono text-sm md:text-base text-accent-cyan/90"
                >
                    {{ lab.taglineEn }}
                </p>
                <p
                    class="mt-8 text-lg text-fg-subtle max-w-4xl leading-relaxed"
                >
                    {{ lab.description }}
                </p>

                <div class="mt-10 flex flex-wrap gap-4">
                    <a href="#publications" class="btn-primary">
                        探索论文成果
                        <span aria-hidden="true">
                            <MousePointerClick :size="20" />
                        </span>
                    </a>
                    <a href="#admissions" class="btn-ghost">加入实验室</a>
                </div>

                <div
                    class="mt-16 grid grid-cols-3 sm:grid-cols-3 gap-8 max-w-xl border-t border-border/50 pt-8"
                >
                    <div>
                        <p
                            class="font-display text-3xl md:text-4xl font-semibold text-fg"
                        >
                            113
                        </p>
                        <p class="mt-1 text-xs text-fg-faint">顶级会议论文</p>
                    </div>
                    <div>
                        <p
                            class="font-display text-3xl md:text-4xl font-semibold text-fg"
                        >
                            28
                        </p>
                        <p class="mt-1 text-xs text-fg-faint">在读研究生</p>
                    </div>
                    <div>
                        <p
                            class="font-display text-3xl md:text-4xl font-semibold text-fg"
                        >
                            9
                        </p>
                        <p class="mt-1 text-xs text-fg-faint">在研科研项目</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
