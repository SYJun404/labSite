/**
 * JSON -> 图布局（无外部依赖）
 * 每个 object / array 是一张卡片：基础类型字段直接列在卡片里，
 * 嵌套的 object / array 通过连线连接到子卡片（与 json4u 的 Graph 视图一致）。
 */
import type {
    ContainerRow,
    Graph,
    GraphEdge,
    GraphNode,
    JsonError,
} from "./types";

export const CARD_W = 240;
export const HEAD_H = 28;
export const ROW_H = 24;
export const GAP_X = 72;
export const GAP_Y = 16;
export const PAD = 24;
export const MAX_ROWS = 100; // 单张卡片最多展示的字段数

const isContainer = (
    v: unknown,
): v is unknown[] | Record<string, unknown> =>
    v !== null && typeof v === "object";

function typeOf(v: unknown): string {
    if (v === null) return "null";
    return typeof v; // string | number | boolean
}

function display(v: unknown): string {
    if (typeof v === "string") {
        const s = v.length > 200 ? v.slice(0, 200) + "…" : v;
        return JSON.stringify(s);
    }
    return String(v);
}

/**
 * @param root 已解析的 JSON 值
 * @param collapsed 已折叠节点的 path 集合
 * @param maxNodes 最多生成的卡片数量
 */
export function buildGraph(
    root: unknown,
    collapsed: Set<string> = new Set(),
    maxNodes = 2000,
): Graph {
    const nodes: GraphNode[] = [];
    let truncated = false;

    function build(
        value: unknown,
        path: string,
        title: string,
        depth: number,
    ): GraphNode | null {
        if (nodes.length >= maxNodes) {
            truncated = true;
            return null;
        }
        const isArray = Array.isArray(value);
        const node: GraphNode = {
            id: path,
            title,
            depth,
            isArray,
            rows: [],
            x: 0,
            y: 0,
            h: 0,
        };
        nodes.push(node);

        // 根节点是基础类型时，包一层展示
        const entries: [string, unknown][] = isContainer(value)
            ? isArray
                ? value.map((v, i) => [String(i), v] as [string, unknown])
                : Object.entries(value)
            : [["value", value]];

        const shown = entries.slice(0, MAX_ROWS);
        for (const [k, v] of shown) {
            const childPath = `${path}/${encodeURIComponent(k)}`;
            if (isContainer(v)) {
                const size = Array.isArray(v)
                    ? v.length
                    : Object.keys(v).length;
                const row: ContainerRow = {
                    key: k,
                    container: true,
                    isArray: Array.isArray(v),
                    size,
                    path: childPath,
                    collapsed: collapsed.has(childPath),
                    child: null,
                };
                if (!row.collapsed && size > 0)
                    row.child = build(v, childPath, k, depth + 1);
                node.rows.push(row);
            } else {
                node.rows.push({
                    key: k,
                    path: childPath,
                    type: typeOf(v),
                    text: display(v),
                });
            }
        }
        if (entries.length > shown.length) {
            node.rows.push({
                key: "",
                more: true,
                text: `… 另有 ${entries.length - shown.length} 项`,
            });
        }
        if (node.rows.length === 0) {
            node.rows.push({
                key: "",
                more: true,
                text: isArray ? "空数组" : "空对象",
            });
        }
        node.h = HEAD_H + node.rows.length * ROW_H;
        return node;
    }

    const rootNode = build(root, "", "root", 0);

    // 递归布局：子树自上而下堆叠，父节点相对子节点垂直居中
    function layout(node: GraphNode, top: number): number {
        node.x = PAD + node.depth * (CARD_W + GAP_X);
        const kids: GraphNode[] = [];
        for (const r of node.rows) {
            if (r.container && r.child) kids.push(r.child);
        }
        if (!kids.length) {
            node.y = top;
            return node.h;
        }
        let cursor = top;
        for (const kid of kids) cursor += layout(kid, cursor) + GAP_Y;
        const span = cursor - GAP_Y - top;
        node.y = span > node.h ? top + (span - node.h) / 2 : top;
        return Math.max(span, node.h);
    }

    let height = 0;
    if (rootNode) height = layout(rootNode, PAD);

    const edges: GraphEdge[] = [];
    let width = 0;
    for (const n of nodes) {
        width = Math.max(width, n.x + CARD_W);
        n.rows.forEach((r, i) => {
            if (!r.container || !r.child) return;
            const x1 = n.x + CARD_W;
            const y1 = n.y + HEAD_H + i * ROW_H + ROW_H / 2;
            const x2 = r.child.x;
            const y2 = r.child.y + HEAD_H / 2;
            const dx = (x2 - x1) / 2;
            edges.push({
                id: r.path,
                d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`,
            });
        });
    }

    return {
        nodes,
        edges,
        truncated,
        width: width + PAD,
        height: height + PAD,
    };
}

/** 从 JSON.parse 的报错中提取行列信息 */
export function explainError(err: unknown, src: string): JsonError {
    const e = err as { message?: unknown } | null | undefined;
    const msg = String((e && e.message) || err);
    let line: number | undefined;
    let column: number | undefined;
    const lc = /line (\d+) column (\d+)/i.exec(msg);
    if (lc) {
        line = +lc[1];
        column = +lc[2];
    } else {
        const pos = /position (\d+)/i.exec(msg);
        if (pos) {
            const before = src.slice(0, +pos[1]);
            const lines = before.split("\n");
            line = lines.length;
            column = lines[lines.length - 1].length + 1;
        }
    }
    return { message: msg, line, column };
}
