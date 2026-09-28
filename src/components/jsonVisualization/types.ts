/**
 * jsonVisualization 内各模块共享的类型定义。
 */

/** 解析后的 JSON 值 */
export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

/** 解析 / 读取失败时的错误信息（含行列坐标） */
export interface JsonError {
    message: string;
    line?: number;
    column?: number;
}

/* ---------- 图 ---------- */

/** 卡片中的“基础类型字段”行 */
export interface LeafRow {
    key: string;
    path: string;
    type: string;
    text: string;
    container?: false;
    more?: false;
}

/** 卡片中的“嵌套容器”行，通过连线指向子卡片 */
export interface ContainerRow {
    key: string;
    path: string;
    container: true;
    more?: false;
    isArray: boolean;
    size: number;
    collapsed: boolean;
    child: GraphNode | null;
}

/** “另有 N 项 / 空对象”之类的占位行 */
export interface MoreRow {
    key: string;
    path?: string;
    text: string;
    more: true;
    container?: false;
}

export type GraphRow = LeafRow | ContainerRow | MoreRow;

/** 一张卡片：一个 object / array */
export interface GraphNode {
    id: string;
    title: string;
    depth: number;
    isArray: boolean;
    rows: GraphRow[];
    x: number;
    y: number;
    h: number;
}

export interface GraphEdge {
    id: string;
    d: string;
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    truncated: boolean;
    width: number;
    height: number;
}

/* ---------- 文本位置 <-> JSON 路径索引 ---------- */

export interface JsonIndexEntry {
    path: string;
    keyStart: number;
    from: number;
    to: number;
}

export interface JsonIndex {
    entries: JsonIndexEntry[];
    byPath: Map<string, JsonIndexEntry>;
}
