/**
 * Giscus 评论高亮（Post-Process）入口。
 *
 * 高亮渲染依赖 window/document/CSS Highlight API，必须仅在浏览器端执行，故用 BrowserOnly 包裹。
 * 评论数据由构建期插件 plugins/giscusHighlights.ts 通过全局数据注入。
 */
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import './highlights.css';

export default function GiscusHighlightsRoot(): JSX.Element {
  return (
    <BrowserOnly>
      {() => {
        const GiscusHighlights = require('./GiscusHighlights').default;
        return <GiscusHighlights />;
      }}
    </BrowserOnly>
  );
}
