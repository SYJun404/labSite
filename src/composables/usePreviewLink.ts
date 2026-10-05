import { watch } from "vue";
import type { DatasetDetail } from "../api/dataset";

/** 远程读取预览文件文本：去除 BOM；非 2xx 抛出错误 */
export async function fetchPreviewText(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

export interface PreviewLinkOptions {
    /** 链接变化或重新加载前重置状态 */
    reset?: () => void;
    /** 成功读取到文本；url 为原始预览地址 */
    onText: (text: string, url: string) => void;
    /** 读取失败（此时 reset 已执行，调用方可在此记录错误） */
    onError?: (e: unknown) => void;
}

/**
 * 按 previewType 监听数据集预览地址并读取文本。
 * 仅当 previewLink 存在且 overview.previewType 匹配时才请求，其它情况只重置。
 * 提取自 DatasetPreviewTable 与 Json4u 的公共加载逻辑。
 */
export function usePreviewLink(
    getD: () => DatasetDetail | null | undefined,
    previewType: number,
    { reset, onText, onError }: PreviewLinkOptions,
) {
    async function load(link?: string | null) {
        reset?.();
        const type = getD()?.overview?.previewType;
        // previewType 为空时兼容旧数据，按传入类型直接加载
        if (!link || (type != null && type !== previewType)) return;
        try {
            onText(await fetchPreviewText(link), link);
        } catch (e) {
            onError?.(e);
        }
    }

    watch(() => getD()?.previewLink, load, { immediate: true });

    return { reload: () => load(getD()?.previewLink) };
}
