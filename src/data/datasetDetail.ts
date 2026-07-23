export interface DatasetVariable {
    name: string;
    role: "Feature" | "Target" | "ID";
    type: string;
    description?: string;
    unit?: string;
    missing: boolean;
}

export interface CitingPaper {
    title: string;
    authors: string;
    publishedIn: string;
    year?: number;
    url: string;
}

export interface DatasetPaper {
    title: string;
    authors: string;
    venue: string;
    year: number;
    href: string;
}

export interface DatasetDetail {
    id: string;
    name: string;
    /** 缩略图徽标里显示的 2-4 位字符代号，风格同列表页 */
    tag: string;
    /** 发布日期，展示用字符串 */
    donatedDate: string;
    description: string;

    // 顶部元信息网格（对应截图里的 Dataset Characteristics / Subject Area / Associated Tasks / Feature Type / #Instances / #Features）
    characteristics: string;
    subjectArea: string;
    associatedTasks: string[];
    featureType: string;
    instances: number;
    features: number;

    // 右侧栏
    downloadSizeLabel: string;
    citingPapers: CitingPaper[];
    citations: number;
    views: number;
    keywords: string[];
    creators: string[];
    doi: string;
    licenseName: string;
    licenseHref: string;
    licenseDescription: string;

    // Dataset Information 折叠区块
    whatInstancesRepresent: string;
    additionalInfo: string;
    hasMissingValues: boolean;

    // Introductory Paper 折叠区块
    paper: DatasetPaper;

    // Variables Table 折叠区块
    variables: DatasetVariable[];

    // 数据预览（新增板块）：类似 CSV 文件展示
    previewColumns: string[];
    previewRows: (string | number)[][];
    previewTotalRows: number;
}

export const datasetDetail: DatasetDetail = {
    id: "graphsci-mol",
    name: "GraphSci-Mol",
    tag: "GM",
    donatedDate: "2025-11-18",
    description:
        "面向 AI for Science 场景构建的分子图数据集，标注了分子量、脂水分配系数（logP）、水溶性与毒性等理化性质，适用于图神经网络在分子性质预测任务上的基准测试。",

    characteristics: "Graph / Tabular",
    subjectArea: "AI for Science · 化学信息学",
    associatedTasks: ["回归", "分类", "图学习"],
    featureType: "Real, Categorical",
    instances: 54700,
    features: 27,

    downloadSizeLabel: "186 MB",
    citingPapers: [
        {
            title: "A Submodularity-based Agglomerative Clustering Algorithm for the Privacy Funnel",
            authors: "Ni Ding, Parastoo Sadeghi",
            publishedIn: "ArXiv",
            year: 2019,
            url: "#",
        },
        {
            title: "Graph Neural Networks with Learnable Structural and Positional Representations",
            authors:
                "Vijay Prakash Dwivedi, Anh Tuan Luu, Thomas Laurent, Yoshua Bengio, Xavier Bresson",
            publishedIn: "ICLR",
            year: 2022,
            url: "#",
        },
        {
            title: "Pre-training Graph Neural Networks for Molecular Understanding",
            authors:
                "Weihua Hu, Bowen Liu, Joseph Gomes, Marinka Zitnik, Percy Liang, Vijay Pande, Jure Leskovec",
            publishedIn: "NeurIPS",
            year: 2020,
            url: "#",
        },
    ],
    citations: 47,
    views: 12860,
    keywords: ["molecular-graph", "ai4science", "property-prediction"],
    creators: ["王家豪", "周子涵", "张明远"],
    doi: "10.24432/IPLL-GM27",
    licenseName: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    licenseHref: "#",
    licenseDescription:
        "该数据集基于 CC BY 4.0 协议开放，允许在注明出处的前提下自由分享与二次改编，包括用于商业用途。",

    whatInstancesRepresent:
        "每条样本对应一个小分子，以分子图形式给出原子（节点）与化学键（边），并附带该分子在多个理化性质上的标注值。",
    additionalInfo:
        "数据集整合了公开分子性质数据库中的结构信息，并通过实验室内部的湿实验数据进行了补充校正。每个分子提供了原子级别的特征（元素类型、电荷、杂化方式）以及键级别的特征（键类型、是否为芳香键）。数据集覆盖了从小分子药物到常见有机化合物的多种结构类型，其中约 8% 的样本在毒性标签上存在缺失值，标注缺失的样本仍保留了完整的图结构信息，可用于自监督预训练。建议在使用毒性预测子任务时，先对缺失标签样本进行过滤或采用半监督策略处理。",
    hasMissingValues: true,

    paper: {
        title: "Expressive Graph Transformers for Molecular Property Prediction",
        authors: "周子涵, 王家豪",
        venue: "KDD",
        year: 2025,
        href: "#",
    },

    variables: [
        {
            name: "mol_id",
            role: "ID",
            type: "Categorical",
            description: "分子唯一标识符",
            missing: false,
        },
        {
            name: "smiles",
            role: "Feature",
            type: "Categorical",
            description: "分子的 SMILES 结构表示",
            missing: false,
        },
        {
            name: "num_atoms",
            role: "Feature",
            type: "Integer",
            description: "重原子数量",
            missing: false,
        },
        {
            name: "molecular_weight",
            role: "Feature",
            type: "Continuous",
            description: "分子量",
            unit: "g/mol",
            missing: false,
        },
        {
            name: "logp",
            role: "Feature",
            type: "Continuous",
            description: "脂水分配系数",
            missing: false,
        },
        {
            name: "solubility",
            role: "Target",
            type: "Continuous",
            description: "水溶性（回归任务标签）",
            unit: "log(mol/L)",
            missing: false,
        },
        {
            name: "toxicity_label",
            role: "Target",
            type: "Binary",
            description: "毒性标签（分类任务标签）",
            missing: true,
        },
        {
            name: "split",
            role: "Feature",
            type: "Categorical",
            description: "官方划分：train / valid / test",
            missing: false,
        },
    ],

    previewColumns: [
        "mol_id",
        "smiles",
        "num_atoms",
        "molecular_weight",
        "logp",
        "solubility",
        "toxicity_label",
        "split",
    ],
    previewRows: [
        [
            "GM-00001",
            "CC(=O)Oc1ccccc1C(=O)O",
            13,
            180.16,
            1.19,
            -2.32,
            0,
            "train",
        ],
        [
            "GM-00002",
            "CC(C)Cc1ccc(cc1)C(C)C(=O)O",
            15,
            206.28,
            3.07,
            -3.51,
            0,
            "train",
        ],
        [
            "GM-00003",
            "Clc1ccccc1Nc1ccccc1C(=O)O",
            15,
            247.69,
            4.02,
            -4.89,
            1,
            "train",
        ],
        ["GM-00004", "CC(=O)Nc1ccc(O)cc1", 9, 151.16, 0.91, -0.85, 0, "valid"],
        [
            "GM-00005",
            "COc1cc2c(cc1OC)C(=O)C(CC2)N1CCN(C)CC1",
            24,
            330.42,
            2.14,
            -3.02,
            "—",
            "train",
        ],
        [
            "GM-00006",
            "CN1CCC(CC1)Oc1ccc(Cl)cc1",
            16,
            225.72,
            3.44,
            -3.78,
            0,
            "test",
        ],
        [
            "GM-00007",
            "Oc1ccccc1C(=O)Nc1ccccc1",
            14,
            213.23,
            2.63,
            -3.1,
            1,
            "train",
        ],
        [
            "GM-00008",
            "CCN(CC)CCOC(=O)c1ccc(N)cc1",
            17,
            236.31,
            2.2,
            -2.44,
            "—",
            "valid",
        ],
        [
            "GM-00009",
            "Cc1ccc(cc1)S(=O)(=O)N1CCOCC1",
            15,
            241.3,
            0.78,
            -1.62,
            0,
            "train",
        ],
        [
            "GM-00010",
            "Brc1ccc(cc1)C1=NN=C(N1)c1ccccc1",
            16,
            300.14,
            3.55,
            -4.97,
            1,
            "test",
        ],
    ],
    previewTotalRows: 54700,
};
