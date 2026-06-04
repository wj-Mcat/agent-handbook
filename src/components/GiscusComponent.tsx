import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';
import GiscusHighlights from "@site/src/components/GiscusHighlights";
import GiscusSyncNotice from "@site/src/components/GiscusSyncNotice";

export default function GiscusComponent() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Giscus    
        repo="wj-Mcat/agent-handbook"
        repoId="R_kgDOMKUZww"
        category="General"
        categoryId="DIC_kwDOMKUZw84ChvU1"  // E.g. id of "General"
        mapping="title"                        // Important! To map comments to URL
        term="Welcome to @giscus/react component!"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="1"
        inputPosition="top"
        theme={colorMode}
        lang="en"
        loading="lazy"
        crossorigin="anonymous"
        async
      />
      {/* 读取构建期采集的评论引用，将其在正文中高亮渲染 */}
      <GiscusHighlights />
      {/* 检测到新评论/回复后提示正文高亮同步时间 */}
      <GiscusSyncNotice />
    </>
  );
}