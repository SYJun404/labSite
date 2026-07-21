export interface NewsItem {
    date: string;
    text: string;
}

export interface AdmissionTrack {
    title: string;
    titleEn: string;
    desc: string;
    requirements: string[];
}

export interface ApplicationStep {
    step: string;
    desc: string;
}

export const news: NewsItem[] = [
    {
        date: "2026-06",
        text: "实验室 2 篇论文被 ICML 2026 接收，涉及世界模型与高效推理方向。",
    },
    {
        date: "2026-03",
        text: "张明远教授团队获批国家自然科学基金重点项目「大模型对齐的理论基础」。",
    },
    {
        date: "2025-12",
        text: "实验室与某国家重点实验室共建「具身智能联合研究中心」正式揭牌。",
    },
    {
        date: "2025-09",
        text: "博士生孙悦获 2025 年度微软学者奖学金（Microsoft Research Fellowship）。",
    },
    {
        date: "2025-06",
        text: "实验室 4 篇论文被 NeurIPS 2025 接收，创历史新高。",
    },
];

export const admissionTracks: AdmissionTrack[] = [
    {
        title: "博士研究生",
        titleEn: "PhD Candidates",
        desc: "面向具有扎实数理基础与编程能力、对机器学习理论或系统有浓厚兴趣的本科/硕士毕业生。全年接受套磁与直博/硕博连读申请。",
        requirements: [
            "扎实的数学与编程基础",
            "至少一段科研或工程实习经历",
            "英文文献阅读与写作能力",
        ],
    },
    {
        title: "硕士研究生",
        titleEn: "Master Students",
        desc: "欢迎通过统考、推免或联合培养方式加入实验室，参与前沿课题并在导师指导下完成学位论文。",
        requirements: [
            "计算机、数学或相关专业背景",
            "具备 Python / PyTorch 基础",
            "有一定自主学习与钻研精神",
        ],
    },
    {
        title: "科研实习生",
        titleEn: "Research Interns",
        desc: "面向在读本科生与硕士生，提供暑期及学期内科研实习机会，参与具体研究课题的实验与工程实现。",
        requirements: [
            "大三及以上在读学生优先",
            "每周至少 20 小时投入",
            "欢迎跨专业背景同学申请",
        ],
    },
];

export const applicationSteps: ApplicationStep[] = [
    {
        step: "简历与套磁信",
        desc: "发送个人简历、成绩单及研究兴趣说明至实验室邮箱。",
    },
    { step: "资料筛选", desc: "导师团队在 1-2 周内完成初步评估并给予反馈。" },
    {
        step: "线上/线下面试",
        desc: "通过基础知识、研究经历与英文交流三个维度综合考察。",
    },
    {
        step: "入组与课题匹配",
        desc: "结合双向意愿确定研究方向与合作导师，正式加入实验室。",
    },
];
