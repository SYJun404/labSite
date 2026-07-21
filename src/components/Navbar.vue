<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { lab } from "../data/research";
import { useTheme } from "../composables/useTheme";

const { theme, toggleTheme } = useTheme();
const scrolled = ref(false);
const menuOpen = ref(false);

const links = [
    { label: "研究方向", href: "#research" },
    { label: "论文成果", href: "#publications" },
    { label: "团队成员", href: "#team" },
    { label: "招生宣传", href: "#admissions" },
    { label: "联系我们", href: "#contact" },
];

function onScroll() {
    scrolled.value = window.scrollY > 24;
}

onMounted(() => window.addEventListener("scroll", onScroll));
onUnmounted(() => window.removeEventListener("scroll", onScroll));

function closeMenu() {
    menuOpen.value = false;
}
</script>

<template>
    <header
        class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        :class="
            scrolled
                ? 'bg-bg/80 backdrop-blur-lg border-b border-border/40'
                : 'bg-transparent'
        "
    >
        <nav
            class="flex items-center justify-between px-6 md:px-12 lg:px-20 h-20"
        >
            <a href="#top" class="flex items-center gap-3 group">
                <span
                    class="w-9 h-9 rounded-lg bg-signal-gradient flex items-center justify-center font-mono text-xs font-bold text-[#0A0B0F]"
                >
                    {{ lab.shortName }}
                </span>
                <span
                    class="font-display font-semibold text-fg tracking-tight hidden sm:block"
                >
                    {{ lab.nameZh }}
                </span>
            </a>

            <ul class="hidden lg:flex items-center gap-9">
                <li v-for="link in links" :key="link.href">
                    <a
                        :href="link.href"
                        class="text-sm text-fg-subtle hover:text-fg transition-colors duration-200"
                    >
                        {{ link.label }}
                    </a>
                </li>
            </ul>

            <div class="hidden lg:flex items-center gap-4">
                <button
                    @click="toggleTheme"
                    class="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center text-fg-subtle hover:text-accent-cyan hover:border-accent-cyan/60 transition-colors duration-200"
                    :aria-label="
                        theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'
                    "
                >
                    <svg
                        v-if="theme === 'dark'"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        class="w-4 h-4"
                    >
                        <circle cx="12" cy="12" r="4.5" />
                        <path
                            stroke-linecap="round"
                            d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                        />
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        class="w-4 h-4"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
                        />
                    </svg>
                </button>

                <a
                    href="#admissions"
                    class="inline-flex btn-primary !py-2.5 !px-5 text-sm"
                >
                    加入我们
                </a>
            </div>

            <button
                class="lg:hidden text-fg-muted w-9 h-9 flex flex-col items-center justify-center gap-1.5"
                @click="menuOpen = !menuOpen"
                aria-label="Toggle menu"
            >
                <span
                    class="w-6 h-px bg-current transition-transform"
                    :class="menuOpen && 'translate-y-2 rotate-45'"
                ></span>
                <span
                    class="w-6 h-px bg-current transition-opacity"
                    :class="menuOpen && 'opacity-0'"
                ></span>
                <span
                    class="w-6 h-px bg-current transition-transform"
                    :class="menuOpen && '-translate-y-2 -rotate-45'"
                ></span>
            </button>
        </nav>

        <transition name="fade">
            <div
                v-if="menuOpen"
                class="lg:hidden bg-bg border-b border-border/40 px-6 pb-6"
            >
                <ul class="flex flex-col gap-4 pt-2">
                    <li v-for="link in links" :key="link.href">
                        <a
                            :href="link.href"
                            class="text-fg-muted text-base"
                            @click="closeMenu"
                            >{{ link.label }}</a
                        >
                    </li>
                    <li>
                        <a
                            href="#admissions"
                            class="btn-primary w-full justify-center mt-2"
                            @click="closeMenu"
                            >加入我们</a
                        >
                    </li>
                    <li>
                        <button
                            @click="toggleTheme"
                            class="w-full flex items-center justify-center gap-2 border border-border/60 text-fg-subtle rounded-full py-2.5 text-sm"
                        >
                            {{
                                theme === "dark"
                                    ? "切换到浅色主题"
                                    : "切换到深色主题"
                            }}
                        </button>
                    </li>
                </ul>
            </div>
        </transition>
    </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
