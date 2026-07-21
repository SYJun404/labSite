export interface Person {
    name: string;
    nameEn?: string;
    title?: string;
    titleEn?: string;
    bio?: string;
    homepage?: string;
    scholar?: string;
    initials: string;
}

export interface FacultyMember {
    name: string;
    title: string;
    focus: string;
    initials: string;
}

export interface Student {
    name: string;
    degree: string;
    focus: string;
    initials: string;
}

export interface Alumni {
    name: string;
    went: string;
    year: string;
}

export const pi: Person = {
    name: "张明远",
    nameEn: "Mingyuan Zhang",
    title: "教授 / 博士生导师",
    titleEn: "Professor, PhD Advisor",
    bio: "2010年博士毕业于卡内基梅隆大学计算机学院，现任计算机科学与技术学院教授、实验室主任。研究方向为机器学习理论与多模态智能系统，在 NeurIPS、ICML、CVPR 等顶级会议发表论文 90 余篇，主持国家自然科学基金重点项目 2 项。",
    homepage: "https://ipll-lab.edu.cn/~zhangmy",
    scholar: "https://scholar.google.com/citations?user=example",
    initials: "MZ",
};

export const faculty: FacultyMember[] = [
    {
        name: "李文昊",
        title: "副教授",
        focus: "具身智能 · 机器人学习",
        initials: "WH",
    },
    {
        name: "陈思颖",
        title: "副教授",
        focus: "大模型对齐 · 可解释性",
        initials: "SY",
    },
    {
        name: "王家豪",
        title: "助理教授",
        focus: "图神经网络 · AI for Science",
        initials: "JH",
    },
];

export const students: Student[] = [
    {
        name: "刘一帆",
        degree: "博士四年级",
        focus: "视觉-语言模型预训练",
        initials: "YF",
    },
    {
        name: "赵子墨",
        degree: "博士三年级",
        focus: "强化学习与世界模型",
        initials: "ZM",
    },
    {
        name: "孙悦",
        degree: "博士二年级",
        focus: "大模型安全对齐",
        initials: "SY",
    },
    {
        name: "周子涵",
        degree: "博士一年级",
        focus: "图表示学习",
        initials: "ZH",
    },
    {
        name: "郑天佑",
        degree: "硕士二年级",
        focus: "模型压缩与推理加速",
        initials: "TY",
    },
    {
        name: "林嘉怡",
        degree: "硕士二年级",
        focus: "差分隐私机器学习",
        initials: "JY",
    },
    {
        name: "黄俊杰",
        degree: "硕士一年级",
        focus: "多模态检索",
        initials: "JJ",
    },
    {
        name: "徐梦琪",
        degree: "硕士一年级",
        focus: "机器人操控策略",
        initials: "MQ",
    },
];

export const alumni: Alumni[] = [
    { name: "韩雪", went: "Google DeepMind · 研究科学家", year: "2023届" },
    { name: "马天宇", went: "字节跳动 AI Lab · 研究员", year: "2022届" },
    { name: "吴迪", went: "清华大学 · 助理教授", year: "2021届" },
    { name: "钱思远", went: "腾讯 AI Lab · 高级研究员", year: "2021届" },
];
