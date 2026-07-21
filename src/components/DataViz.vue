<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import {
    Chart,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    DoughnutController,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Filler,
} from "chart.js";
import {
    publicationStatsByYear,
    citationTrend,
    venueDistribution,
} from "../data/publications";
import { useTheme } from "../composables/useTheme";

Chart.register(
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    DoughnutController,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Filler,
);

const { theme } = useTheme();
const barCanvas = ref(null);
const lineCanvas = ref(null);
const doughnutCanvas = ref(null);
let barChart, lineChart, doughnutChart;

const fontFamily = '"JetBrains Mono", monospace';

// Two color palettes mirroring the dark/light CSS variable sets in style.css,
// since Chart.js bakes colors into canvas draw calls and can't read CSS vars live.
const palettes = {
    dark: {
        grid: "rgba(255,255,255,0.06)",
        tick: "#5D6478",
        tooltipBg: "#161923",
        tooltipBorder: "#2A2E3D",
        tooltipTitle: "#E8EAED",
        tooltipBody: "#8B92A5",
        legend: "#8B92A5",
        bar: "#5B7CFA",
        barHover: "#3DD9C4",
        line: "#3DD9C4",
        lineFill: "rgba(61,217,196,0.12)",
        pointBorder: "#0A0B0F",
        doughnutBorder: "#0A0B0F",
        doughnut: [
            "#5B7CFA",
            "#8B7CFA",
            "#3DD9C4",
            "#4C5470",
            "#2A2E3D",
            "#7C8299",
        ],
    },
    light: {
        grid: "rgba(10,11,15,0.07)",
        tick: "#6B7280",
        tooltipBg: "#FFFFFF",
        tooltipBorder: "#E0E3E9",
        tooltipTitle: "#0A0B0F",
        tooltipBody: "#3A3F4B",
        legend: "#3A3F4B",
        bar: "#3B5BDB",
        barHover: "#0D9488",
        line: "#0D9488",
        lineFill: "rgba(13,148,136,0.10)",
        pointBorder: "#FFFFFF",
        doughnutBorder: "#FFFFFF",
        doughnut: [
            "#3B5BDB",
            "#6D4FE8",
            "#0D9488",
            "#94A3B8",
            "#CBD5E1",
            "#475569",
        ],
    },
};

function buildCharts() {
    const c = theme.value === "light" ? palettes.light : palettes.dark;

    const tooltipBase = {
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        borderWidth: 1,
        titleColor: c.tooltipTitle,
        bodyColor: c.tooltipBody,
        padding: 10,
        titleFont: { family: fontFamily, size: 12 },
        bodyFont: { family: fontFamily, size: 12 },
        displayColors: false,
    };

    barChart?.destroy();
    lineChart?.destroy();
    doughnutChart?.destroy();

    barChart = new Chart(barCanvas.value, {
        type: "bar",
        data: {
            labels: publicationStatsByYear.map((d) => d.year),
            datasets: [
                {
                    data: publicationStatsByYear.map((d) => d.count),
                    backgroundColor: c.bar,
                    hoverBackgroundColor: c.barHover,
                    borderRadius: 6,
                    maxBarThickness: 36,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: tooltipBase },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: c.tick,
                        font: { family: fontFamily, size: 11 },
                    },
                },
                y: {
                    grid: { color: c.grid },
                    ticks: {
                        color: c.tick,
                        font: { family: fontFamily, size: 11 },
                    },
                    beginAtZero: true,
                },
            },
        },
    });

    lineChart = new Chart(lineCanvas.value, {
        type: "line",
        data: {
            labels: citationTrend.map((d) => d.year),
            datasets: [
                {
                    data: citationTrend.map((d) => d.citations),
                    borderColor: c.line,
                    backgroundColor: c.lineFill,
                    pointBackgroundColor: c.line,
                    pointBorderColor: c.pointBorder,
                    pointRadius: 4,
                    tension: 0.35,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: tooltipBase },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: c.tick,
                        font: { family: fontFamily, size: 11 },
                    },
                },
                y: {
                    grid: { color: c.grid },
                    ticks: {
                        color: c.tick,
                        font: { family: fontFamily, size: 11 },
                    },
                },
            },
        },
    });

    doughnutChart = new Chart(doughnutCanvas.value, {
        type: "doughnut",
        data: {
            labels: venueDistribution.map((d) => d.venue),
            datasets: [
                {
                    data: venueDistribution.map((d) => d.count),
                    backgroundColor: c.doughnut,
                    borderColor: c.doughnutBorder,
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "62%",
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        color: c.legend,
                        font: { family: fontFamily, size: 11 },
                        boxWidth: 10,
                        padding: 14,
                    },
                },
                tooltip: tooltipBase,
            },
        },
    });
}

onMounted(buildCharts);
watch(theme, buildCharts);

onUnmounted(() => {
    barChart?.destroy();
    lineChart?.destroy();
    doughnutChart?.destroy();
});
</script>

<template>
    <section id="insights" class="section-pad border-t border-border/40">
        <div class="mb-16">
            <p class="eyebrow mb-4">Research Impact</p>
            <h2
                class="font-display text-3xl md:text-5xl font-semibold text-fg tracking-tight"
            >
                数据洞察
            </h2>
            <p class="text-fg-subtle max-w-xl mt-4 text-sm leading-relaxed">
                实时统计维度仅为示意数据，接入真实数据库或 API 后即可自动更新。
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="card p-6 lg:col-span-2">
                <p
                    class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-1"
                >
                    年度论文产出
                </p>
                <p class="font-display text-lg text-fg mb-4">
                    Publications per Year
                </p>
                <div class="h-64">
                    <canvas ref="barCanvas"></canvas>
                </div>
            </div>

            <div class="card p-6">
                <p
                    class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-1"
                >
                    会议分布
                </p>
                <p class="font-display text-lg text-fg mb-4">
                    Venue Distribution
                </p>
                <div class="h-64">
                    <canvas ref="doughnutCanvas"></canvas>
                </div>
            </div>

            <div class="card p-6 lg:col-span-3">
                <p
                    class="font-mono text-xs text-fg-faint uppercase tracking-wide mb-1"
                >
                    累计引用趋势
                </p>
                <p class="font-display text-lg text-fg mb-4">Citation Growth</p>
                <div class="h-72">
                    <canvas ref="lineCanvas"></canvas>
                </div>
            </div>
        </div>
    </section>
</template>
