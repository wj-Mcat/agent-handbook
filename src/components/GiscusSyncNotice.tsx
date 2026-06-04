/**
 * Giscus 发表评论后的同步提示。
 *
 * Giscus 运行在跨域 iframe 内，父页面无法直接监听 Comment 按钮点击；
 * 借助已开启的 emitMetadata，在 discussion 评论/回复总数增加时视为「刚发表成功」，
 * 在右上角弹出提示（正文高亮需等待 CI 重新构建，约 2–3 分钟）。
 */
import React, {useEffect, useRef, useState} from 'react';
import styles from './GiscusSyncNotice.module.css';

const GISCUS_ORIGIN = 'https://giscus.app';
const AUTO_HIDE_MS = 6000;

interface GiscusDiscussionMeta {
  id?: string;
  totalCommentCount?: number;
  totalReplyCount?: number;
}

function getTotal(discussion: GiscusDiscussionMeta): number {
  return (discussion.totalCommentCount ?? 0) + (discussion.totalReplyCount ?? 0);
}

export default function GiscusSyncNotice(): JSX.Element | null {
  const [visible, setVisible] = useState(false);
  const prevTotalRef = useRef<number | null>(null);
  const discussionIdRef = useRef<string | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const showNotice = () => {
      setVisible(true);
      if (hideTimerRef.current != null) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        hideTimerRef.current = null;
      }, AUTO_HIDE_MS);
    };

    const handler = (event: MessageEvent) => {
      if (event.origin !== GISCUS_ORIGIN) {
        return;
      }
      const payload = event.data as {giscus?: {discussion?: GiscusDiscussionMeta}} | null;
      const discussion = payload?.giscus?.discussion;
      if (!discussion?.id) {
        return;
      }

      const total = getTotal(discussion);

      if (discussion.id !== discussionIdRef.current) {
        discussionIdRef.current = discussion.id;
        prevTotalRef.current = total;
        return;
      }

      if (prevTotalRef.current !== null && total > prevTotalRef.current) {
        showNotice();
      }
      prevTotalRef.current = total;
    };

    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
      if (hideTimerRef.current != null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.title}>评论已发表</span>
      <p className={styles.body}>
        评论内容将在 2–3 分钟后同步渲染到文章内容当中（站点重新部署后生效）。
      </p>
    </div>
  );
}
