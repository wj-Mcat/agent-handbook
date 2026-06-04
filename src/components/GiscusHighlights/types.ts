/**
 * Giscus 评论高亮（Post-Process）相关类型。
 *
 * 该文件不依赖浏览器或 React，可被构建期 Node 插件（plugins/giscusHighlights.ts）
 * 与运行期组件同时引用。
 */

/** 构建期 / 运行期使用的插件名（usePluginData 需与之一致） */
export const GISCUS_HIGHLIGHTS_PLUGIN = 'docusaurus-plugin-giscus-highlights';

/** 一条由评论引用块解析得到的高亮 */
export interface GiscusHighlight {
  /** Giscus / GitHub Discussion 评论的 node id */
  id: string;
  /** 指向 GitHub 上该评论的链接 */
  url: string;
  /** 评论中引用的正文片段（高亮锚定依据） */
  quote: string;
  /** 评论正文（去掉引用块后的内容） */
  text: string;
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };
  createdAt: string;
}

/**
 * 注入到站点全局数据中的结构。
 * `byTitle` 以 Discussion 标题（即页面 document.title，对应 Giscus mapping="title"）为 key。
 */
export interface GiscusHighlightsData {
  byTitle: Record<string, GiscusHighlight[]>;
  generatedAt: string;
}
