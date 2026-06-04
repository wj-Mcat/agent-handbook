/**
 * 划词评论插件入口（方案 D：完全复用 Giscus，无后端、无 Token）。
 *
 * - 划词后把 `> 引用` 复制到剪贴板并滚动定位到 Giscus 评论框，由用户粘贴补充后发表。
 * - 交互层依赖 window/document/clipboard，必须仅在浏览器端渲染，这里用 BrowserOnly 包裹。
 *
 * 该目录内的代码不依赖站点其它模块，后续可整体抽取为独立的 npm 包 / Docusaurus 插件。
 */
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type {AnnotationConfig} from './config';

export interface TextAnnotationsProps {
  config?: Partial<AnnotationConfig>;
}

export default function TextAnnotationsRoot(props: TextAnnotationsProps): JSX.Element {
  return (
    <BrowserOnly>
      {() => {
        const TextAnnotations = require('./TextAnnotations').default;
        return <TextAnnotations {...props} />;
      }}
    </BrowserOnly>
  );
}
