import { request } from "../utils/request";

// 数据集介绍段落
export interface DatasetIntro {
    title?: string;
    content?: string;
}

// 创建者
export interface DatasetCreator {
    name?: string;
    contact?: string;
}

// 许可证
export interface DatasetLicense {
    title?: string;
    description?: string;
}

// 参考文献
export interface DatasetReference {
    title?: string;
    authors?: string;
    publishedIn?: string;
    year?: string;
    url?: string;
}

// 数据集 字段解释：列以稳定 id 标识，避免同名列互相覆盖
// - columns：有序的列定义数组（id + 列名），数组顺序即列顺序
// - data：每行一个对象，键为列 id
export interface DatasetFieldExplain {
    columns: Array<{ id: string; name: string }>;
    data: Array<Record<string, string>>;
}

// 数据集 类型定义
export interface Dataset {
    id?: number;

    // 业务编号（唯一，后端创建时自动生成）
    datasetId?: string;

    // 基本信息
    donatedDate?: string | null; // donated_date date [not null]
    name?: string; // name varchar(255) [not null]
    tag?: string;
    description?: string; // description text [not null]
    characteristics?: string; // characteristics varchar(255)
    subjectArea?: string; // subject_area varchar(255)
    tasks?: string; // tasks varchar(255)
    featureType?: string; // feature_type varchar(255)
    instances?: number | null; // instances integer [not null]
    features?: number | null; // features integer [not null]
    downloadSize?: string; // download_size varchar(255) [not null]
    status?: number; // status tinyint [not null, default: 1]
    previewType?: number | null; // preview_type tinyint [not null]
    views?: number; // views integer 浏览次数

    // 数据信息
    intro?: DatasetIntro[]; // intro json [not null]
    fieldExplain?: DatasetFieldExplain;
    previewLink?: string; // preview_link varchar(255) [not null]

    // 其他信息
    creators?: DatasetCreator[]; // creators json
    license?: DatasetLicense[]; // license json
    reference?: DatasetReference[]; // reference json
    keywords?: string[]; // keywords json

    createTime?: string;
    updateTime?: string;
}

// 数据集完整详情（概览 + 详情），对应后端 DatasetDetailVO
export interface DatasetDetail {
    overview?: Dataset;
    datasetId?: string;
    intro?: DatasetIntro[] | null;
    fieldExplain?: DatasetFieldExplain | null;
    previewLink?: string | null;
    creators?: DatasetCreator[] | null;
    license?: DatasetLicense[] | null;
    reference?: DatasetReference[] | null;
    keywords?: string[] | null;
}

// 数据集 API
export const datasetApi = {
    // 根据业务编号获取完整信息（概览 + 详情），编辑时使用
    getByDatasetId(datasetId: string): Promise<DatasetDetail> {
        return request({
            url: `/web/dataset/datasetId/${datasetId}`,
            method: "get",
        });
    },
};
