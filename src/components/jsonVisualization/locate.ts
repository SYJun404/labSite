/**
 * 文本位置 <-> JSON 路径 的双向索引。
 * 路径格式与 graph.ts 中的节点 id 完全一致：`/key/0/child`（key 经 encodeURIComponent）。
 */
import type { JsonIndex, JsonIndexEntry } from "./types";

/** 扫描 JSON 文本，返回每个值的 { path, keyStart, from, to }；文本非法时返回 null */
export function indexJson(text: string): JsonIndex | null {
    const entries: JsonIndexEntry[] = [];
    let i = 0;
    const isWs = (c: string) =>
        c === " " || c === "\n" || c === "\r" || c === "\t";
    const ws = () => {
        while (i < text.length && isWs(text[i])) i++;
    };
    const str = (): string => {
        const s = i;
        i++;
        while (i < text.length && text[i] !== '"') {
            if (text[i] === "\\") i++;
            i++;
        }
        i++;
        return JSON.parse(text.slice(s, i));
    };

    function value(path: string, keyStart: number | undefined) {
        ws();
        const from = i;
        const entry: JsonIndexEntry = {
            path,
            keyStart: keyStart === undefined ? from : keyStart,
            from,
            to: from,
        };
        entries.push(entry);
        const ch = text[i];
        if (ch === "{") {
            i++;
            ws();
            if (text[i] === "}") i++;
            else {
                for (;;) {
                    ws();
                    const ks = i;
                    const k = str();
                    ws();
                    i++; // :
                    value(path + "/" + encodeURIComponent(k), ks);
                    ws();
                    if (text[i] === ",") {
                        i++;
                        continue;
                    }
                    i++; // }
                    break;
                }
            }
        } else if (ch === "[") {
            i++;
            ws();
            if (text[i] === "]") i++;
            else {
                for (let idx = 0; ; idx++) {
                    value(path + "/" + idx, undefined);
                    ws();
                    if (text[i] === ",") {
                        i++;
                        continue;
                    }
                    i++; // ]
                    break;
                }
            }
        } else if (ch === '"') {
            str();
        } else {
            while (
                i < text.length &&
                !isWs(text[i]) &&
                ",]}".indexOf(text[i]) < 0
            )
                i++;
        }
        entry.to = i;
    }

    try {
        value("", undefined);
    } catch {
        return null;
    }
    const byPath = new Map<string, JsonIndexEntry>(
        entries.map((e) => [e.path, e] as const),
    );
    return { entries, byPath };
}

/** 找到包含 offset 的最深一层节点 */
export function pathAt(index: JsonIndex, offset: number): string | null {
    let best: JsonIndexEntry | null = null;
    for (const e of index.entries) {
        if (offset >= e.keyStart && offset <= e.to) {
            if (!best || e.to - e.keyStart <= best.to - best.keyStart) best = e;
        }
    }
    return best ? best.path : null;
}
