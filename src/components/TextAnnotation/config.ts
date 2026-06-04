/**
 * 划词评论插件配置。
 *
 * 当前实现（方案 D）：完全复用 Giscus 的评论模块，不需要任何后端，也不需要 GitHub Token。
 * 流程为「划词 → 复制 `> 引用` 到剪贴板 → 滚动定位到 Giscus 评论框 → 用户粘贴并补充后发表」。
 *
 * 受浏览器同源策略限制，无法把光标直接 focus 进 Giscus 的跨域 iframe 评论框，
 * 因此采用「复制 + 滚动定位 + 提示」的方式衔接。
 *
 * 该目录内代码不依赖站点其它模块，便于后续抽取为独立插件。
 */

export interface AnnotationConfig {
  /**
   * 文档正文容器选择器。Docusaurus 的 Markdown 正文统一渲染在 `.markdown` 中，
   * docs / blog 均适用。仅在该容器内的划词才会触发评论气泡。
   */
  contentSelector: string;
  /** Giscus iframe 的选择器，用于划词后滚动定位到评论框 */
  giscusIframeSelector: string;
}

export const defaultConfig: AnnotationConfig = {
  contentSelector: '.markdown',
  giscusIframeSelector: 'iframe.giscus-frame',
};
