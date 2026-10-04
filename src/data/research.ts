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
    nameZh: "多模态智能舆情计算实验室",
    nameEn: "Multimodal Intelligent Public Opinion Computing Lab",
    shortName: "MIPOC Lab",
    affiliation: "人工智能学院",
    university: "重庆邮电大学",
    tagline: "感知舆情 · 理解社会 · 智能决策",
    taglineEn:
        "Sensing public opinion, understanding society, enabling intelligent decisions.",
    description:
        "实验室成立于 2016 年，隶属人工智能学院，聚焦智能舆情计算与社会媒体智能，主要研究多模态舆情感知、情感与观点分析、热点事件理解、舆情传播与演化建模以及大语言模型驱动的社会信息分析等问题，致力于构建从舆情感知、语义理解到趋势研判的智能计算方法与系统。",
    email: "contact@lab.edu.cn",
    address: "重庆邮电大学 · 信息科技大楼 1201",
    github: "https://github.com/ipll-lab",
    location: "重庆市南岸区崇文路2号",
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
