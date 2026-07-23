<script setup lang="ts">
import { lab } from "../data/research";
</script>

<template>
    <footer id="contact" class="border-t border-border/40 section-pad !py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <span
                        class="w-9 h-9 rounded-lg flex items-center justify-center"
                    >
                        <img src="/svg/cqupt.svg" alt="Logo" />
                    </span>
                    <span class="font-display font-semibold text-fg">{{
                        lab.nameZh
                    }}</span>
                </div>
                <p class="text-sm text-fg-subtle leading-relaxed max-w-xs">
                    {{ lab.nameEn }}
                </p>
            </div>

            <div>
                <p
                    class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-4"
                >
                    联系方式
                </p>
                <ul class="space-y-2 text-sm text-fg-subtle">
                    <li>{{ lab.email }}</li>
                    <li>{{ lab.location }}</li>
                    <li>{{ lab.address }}</li>
                </ul>
            </div>

            <div>
                <p
                    class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-4"
                >
                    相关链接
                </p>
                <ul class="space-y-2 text-sm">
                    <li>
                        <a
                            :href="lab.github"
                            class="text-fg-subtle hover:text-accent-cyan transition-colors"
                            >GitHub->
                        </a>
                    </li>
                    <li>
                        <a
                            href="#research"
                            class="text-fg-subtle hover:text-accent-cyan transition-colors"
                            >研究方向</a
                        >
                    </li>
                    <li>
                        <a
                            href="#admissions"
                            class="text-fg-subtle hover:text-accent-cyan transition-colors"
                            >招生宣传</a
                        >
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between gap-2 text-xs text-fg-faint"
        >
            <p>
                &copy; {{ new Date().getFullYear() }} {{ lab.nameZh }}. All
                rights reserved.
            </p>
            <p>Powered By ...</p>
        </div>
    </footer>
</template>
