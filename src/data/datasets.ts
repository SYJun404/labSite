export interface DatasetSample {
    id: string;
    /** 数据集名称 */
    name: string;
    /** 英文/代号，展示在名称下方，风格同 research.ts 里的 titleEn */
    code: string;
    /** 简介，建议 1-2 句 */
    description: string;
    /** 任务类型标签，如 分类 / 回归 / 检索 */
    taskTypes: string[];
    /** 样本规模的展示字符串，如 "12.4K" */
    instances: string;
    /** 特征 / 维度数量 */
    features: number;
    /** 缩略图徽标里显示的 2-4 位字符代号 */
    tag: string;
    /** 发布月份，用于「最新数据样本」排序，格式 YYYY-MM */
    releaseDate: string;
    /** 累计下载/引用次数，用于「热门数据样本」排序 */
    downloads: number;
    /** 详情页跳转地址，模板里先用占位 # */
    href: string;
}

export const datasets: DatasetSample[] = [
    {
        id: "mm-retrieval-bench",
        name: "MM-Retrieval-Bench",
        code: "Cross-Modal Retrieval Benchmark",
        description:
            "面向跨模态检索任务构建的图文对齐基准数据集，覆盖新闻、电商、社交媒体等多个场景的图文对。",
        taskTypes: ["检索", "多模态"],
        instances: "186K",
        features: 12,
        tag: "MM",
        releaseDate: "2026-05",
        downloads: 4310,
        href: "#",
    },
    {
        id: "embodiednav-10k",
        name: "EmbodiedNav-10K",
        code: "Embodied Navigation Trajectories",
        description:
            "仿真环境中采集的具身导航轨迹数据集，包含视觉观测、动作序列与奖励信号，用于策略学习与世界模型训练。",
        taskTypes: ["强化学习", "具身智能"],
        instances: "10.2K",
        features: 18,
        tag: "NAV",
        releaseDate: "2026-06",
        downloads: 2870,
        href: "#",
    },
    {
        id: "safealign-prompts",
        name: "SafeAlign-Prompts",
        code: "LLM Alignment Red-Teaming Set",
        description:
            "面向大模型对齐评测设计的提示词与人工标注数据集，覆盖有害性、偏见与越狱攻击等多个维度。",
        taskTypes: ["分类", "安全评测"],
        instances: "32.5K",
        features: 9,
        tag: "SA",
        releaseDate: "2026-04",
        downloads: 6120,
        href: "#",
    },
    {
        id: "graphsci-mol",
        name: "GraphSci-Mol",
        code: "Molecular Property Graphs",
        description:
            "面向 AI for Science 场景的分子图数据集，标注了溶解度、毒性等理化性质，适用于图神经网络基准测试。",
        taskTypes: ["回归", "图学习"],
        instances: "54.7K",
        features: 27,
        tag: "GM",
        releaseDate: "2025-11",
        downloads: 3985,
        href: "#",
    },
    {
        id: "privgraph",
        name: "PrivGraph",
        code: "Differentially Private Graph Data",
        description:
            "经差分隐私处理的社交网络关系数据集，提供多档隐私预算版本，便于隐私-效用权衡研究。",
        taskTypes: ["图学习", "隐私保护"],
        instances: "8.9K",
        features: 15,
        tag: "PG",
        releaseDate: "2025-09",
        downloads: 1540,
        href: "#",
    },
    {
        id: "moe-latency-trace",
        name: "MoE-Latency-Trace",
        code: "Mixture-of-Experts Inference Traces",
        description:
            "大规模 MoE 模型推理过程中的专家路由与延迟采样数据，用于推理加速与负载均衡算法研究。",
        taskTypes: ["回归", "系统性能"],
        instances: "1.2M",
        features: 11,
        tag: "MOE",
        releaseDate: "2026-02",
        downloads: 2210,
        href: "#",
    },
    {
        id: "worldmodel-sim2real",
        name: "WorldModel-Sim2Real",
        code: "Sim-to-Real Transfer Pairs",
        description:
            "同一机器人任务在仿真与真实环境下的配对观测数据，用于研究世界模型的跨域迁移能力。",
        taskTypes: ["具身智能", "表示学习"],
        instances: "6.4K",
        features: 22,
        tag: "S2R",
        releaseDate: "2026-01",
        downloads: 1685,
        href: "#",
    },
    {
        id: "attn-interp-heads",
        name: "Attn-Interp-Heads",
        code: "Instruction-Tuned Attention Head Annotations",
        description:
            "针对指令微调大模型的注意力头功能标注数据集，支持可解释性与电路分析相关研究。",
        taskTypes: ["分类", "可解释性"],
        instances: "4.1K",
        features: 6,
        tag: "AI",
        releaseDate: "2025-08",
        downloads: 980,
        href: "#",
    },
    {
        id: "fair-graph-bench",
        name: "FairGraph-Bench",
        code: "Fairness-Aware Graph Benchmark",
        description:
            "包含敏感属性标注的关系型图数据基准，用于评估图表示学习模型的群体公平性表现。",
        taskTypes: ["图学习", "公平性"],
        instances: "15.3K",
        features: 19,
        tag: "FG",
        releaseDate: "2025-06",
        downloads: 1320,
        href: "#",
    },
    {
        id: "vl-composed-bench",
        name: "VL-Composed-Bench",
        code: "Vision-Language Compositionality Set",
        description:
            "评测视觉-语言模型组合泛化能力的基准数据集，包含属性、关系与数量组合等多种子任务。",
        taskTypes: ["多模态", "分类"],
        instances: "21.6K",
        features: 8,
        tag: "VL",
        releaseDate: "2025-12",
        downloads: 2755,
        href: "#",
    },
];
