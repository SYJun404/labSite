export interface Publication {
    year: number;
    title: string;
    venue: string;
    authors: string;
    tags: string[];
    highlight: boolean;
}

export interface YearStat {
    year: number;
    count: number;
}

export interface CitationData {
    year: number;
    citations: number;
}

export interface VenueStat {
    venue: string;
    count: number;
}

export const publications: Publication[] = [
    {
        year: 2026,
        title: "Unifying Perception and Control via Latent World Models",
        venue: "ICML",
        authors: "刘一帆, 赵子墨, 张明远",
        tags: ["具身智能", "世界模型"],
        highlight: true,
    },
    {
        year: 2026,
        title: "Scalable Alignment through Constitutional Self-Critique",
        venue: "NeurIPS",
        authors: "孙悦, 陈思颖, 张明远",
        tags: ["大模型对齐"],
        highlight: true,
    },
    {
        year: 2025,
        title: "Cross-Modal Retrieval with Sparse Attention Bottlenecks",
        venue: "CVPR",
        authors: "刘一帆, 黄俊杰, 张明远",
        tags: ["多模态学习"],
        highlight: false,
    },
    {
        year: 2025,
        title: "Differentially Private Fine-tuning at Scale",
        venue: "ICLR",
        authors: "林嘉怡, 陈思颖",
        tags: ["可信机器学习"],
        highlight: false,
    },
    {
        year: 2025,
        title: "Expressive Graph Transformers for Molecular Property Prediction",
        venue: "KDD",
        authors: "周子涵, 王家豪",
        tags: ["图与关系学习", "AI for Science"],
        highlight: false,
    },
    {
        year: 2024,
        title: "Efficient Mixture-of-Experts Inference via Dynamic Routing",
        venue: "MLSys",
        authors: "郑天佑, 李文昊",
        tags: ["高效学习系统"],
        highlight: true,
    },
    {
        year: 2024,
        title: "Robust Reinforcement Learning under Sim-to-Real Gaps",
        venue: "CoRL",
        authors: "赵子墨, 徐梦琪, 李文昊",
        tags: ["具身智能"],
        highlight: false,
    },
    {
        year: 2024,
        title: "Interpretable Attention Heads in Instruction-Tuned LLMs",
        venue: "ACL",
        authors: "孙悦, 陈思颖",
        tags: ["大模型对齐"],
        highlight: false,
    },
    {
        year: 2023,
        title: "Fairness-Aware Representation Learning for Graph Data",
        venue: "NeurIPS",
        authors: "韩雪, 王家豪, 张明远",
        tags: ["图与关系学习", "可信机器学习"],
        highlight: false,
    },
    {
        year: 2023,
        title: "A Unified Benchmark for Vision-Language Compositionality",
        venue: "ICCV",
        authors: "刘一帆, 张明远",
        tags: ["多模态学习"],
        highlight: false,
    },
];

export const publicationStatsByYear: YearStat[] = [
    { year: 2020, count: 9 },
    { year: 2021, count: 12 },
    { year: 2022, count: 15 },
    { year: 2023, count: 18 },
    { year: 2024, count: 22 },
    { year: 2025, count: 26 },
    { year: 2026, count: 11 },
];

export const citationTrend: CitationData[] = [
    { year: 2020, citations: 420 },
    { year: 2021, citations: 890 },
    { year: 2022, citations: 1650 },
    { year: 2023, citations: 2780 },
    { year: 2024, citations: 4120 },
    { year: 2025, citations: 5860 },
    { year: 2026, citations: 3140 },
];

export const venueDistribution: VenueStat[] = [
    { venue: "NeurIPS", count: 17 },
    { venue: "ICML", count: 14 },
    { venue: "CVPR / ICCV", count: 13 },
    { venue: "ICLR", count: 11 },
    { venue: "ACL", count: 8 },
    { venue: "其他", count: 20 },
];
