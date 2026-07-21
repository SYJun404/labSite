export interface LabInfo {
    nameZh: string;
    nameEn: string;
    shortName: string;
    affiliation: string;
    university: string;
    tagline: string;
    taglineEn: string;
    description: string;
    email: string;
    address: string;
    github: string;
    location: string;
}

export interface ResearchArea {
    id: string;
    title: string;
    titleEn: string;
    summary: string;
    keywords: string[];
}

export const lab: LabInfo = {
    nameZh: "智能感知与学习实验室",
    nameEn: "Intelligent Perception & Learning Lab",
    shortName: "IPLL",
    affiliation: "计算机科学与技术学院",
    university: "某某大学",
    tagline: "探索感知、推理与决策的统一计算原理",
    taglineEn:
        "Toward a unified computational account of perception, reasoning and action.",
    description:
        "实验室成立于 2016 年，隶属计算机科学与技术学院，专注于多模态学习、具身智能、大模型对齐与可信机器学习等方向的基础研究与系统落地，与多家国家重点实验室及企业研究院保持长期合作。",
    email: "contact@ipll-lab.edu.cn",
    address: "计算机科学与技术学院 · 智华楼 5 层",
    github: "https://github.com/ipll-lab",
    location: "中国 · 北京",
};

export const researchAreas: ResearchArea[] = [
    {
        id: "multimodal",
        title: "多模态学习",
        titleEn: "Multimodal Learning",
        summary:
            "研究视觉、语言与结构化数据之间的联合表示学习，探索跨模态对齐、检索与生成的统一框架。",
        keywords: ["视觉-语言模型", "跨模态检索", "生成式建模"],
    },
    {
        id: "embodied",
        title: "具身智能",
        titleEn: "Embodied Intelligence",
        summary:
            "面向机器人与仿真环境，研究感知-决策-控制闭环下的策略学习与世界模型构建。",
        keywords: ["世界模型", "强化学习", "机器人操控"],
    },
    {
        id: "alignment",
        title: "大模型对齐与安全",
        titleEn: "LLM Alignment & Safety",
        summary:
            "关注大语言模型的价值对齐、可控生成与鲁棒性评估，推动可解释、可信赖的智能系统。",
        keywords: ["RLHF", "可解释性", "对抗鲁棒性"],
    },
    {
        id: "efficient",
        title: "高效学习系统",
        titleEn: "Efficient Learning Systems",
        summary:
            "研究大规模模型训练与推理的效率优化，包括稀疏化、量化与分布式系统设计。",
        keywords: ["模型压缩", "分布式训练", "推理加速"],
    },
    {
        id: "graph",
        title: "图与关系学习",
        titleEn: "Graph & Relational Learning",
        summary:
            "面向复杂关系数据，研究图神经网络的表达能力、可扩展性与在科学计算中的应用。",
        keywords: ["图神经网络", "知识图谱", "AI for Science"],
    },
    {
        id: "trustworthy",
        title: "可信机器学习",
        titleEn: "Trustworthy ML",
        summary:
            "研究模型的公平性、隐私保护与不确定性量化，为高风险场景提供可靠性保障。",
        keywords: ["差分隐私", "不确定性估计", "公平性"],
    },
];
