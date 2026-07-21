<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { lab } from "../data/research";
import { useTheme } from "../composables/useTheme";

const { theme } = useTheme();
const canvasRef = ref(null);
let ctx, raf, resizeObs;
let nodes = [];
let W = 0,
    H = 0;
let lineRGB = "91,124,250";
let dotRGB = "61,217,196";
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

function updateCanvasColors() {
    const styles = getComputedStyle(document.documentElement);
    const blue = styles.getPropertyValue("--c-accent-blue").trim();
    const cyan = styles.getPropertyValue("--c-accent-cyan").trim();
    if (blue) lineRGB = blue.split(/\s+/).join(",");
    if (cyan) dotRGB = cyan.split(/\s+/).join(",");
}

watch(theme, updateCanvasColors);

function initNodes() {
    const count = Math.min(70, Math.floor((W * H) / 18000));
    nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
    }));
}

function resize() {
    const canvas = canvasRef.value;
    if (!canvas) return;
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    initNodes();
}

function step() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 140;

    for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i],
                b = nodes[j];
            const dx = a.x - b.x,
                dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
                ctx.strokeStyle = `rgba(${lineRGB},${0.16 * (1 - dist / maxDist)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    for (const n of nodes) {
        ctx.fillStyle = `rgba(${dotRGB},0.85)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
    }

    raf = requestAnimationFrame(step);
}

onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    updateCanvasColors();
    resize();
    if (!reduceMotion) {
        raf = requestAnimationFrame(step);
    } else {
        step();
    }
    resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);
});

onUnmounted(() => {
    if (raf) cancelAnimationFrame(raf);
    if (resizeObs) resizeObs.disconnect();
});
</script>

<template>
    <section
        id="top"
        class="relative min-h-screen flex items-center overflow-hidden bg-grid-fade pt-20"
    >
        <canvas
            ref="canvasRef"
            class="absolute inset-0 w-full h-full opacity-70"
        ></canvas>
        <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg"
        ></div>

        <div class="relative z-10 w-full section-pad !py-0">
            <div class="max-w-4xl">
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
                    class="mt-8 text-lg text-fg-subtle max-w-2xl leading-relaxed"
                >
                    {{ lab.description }}
                </p>

                <div class="mt-10 flex flex-wrap gap-4">
                    <a href="#research" class="btn-primary">
                        探索研究方向
                        <span aria-hidden="true">→</span>
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
