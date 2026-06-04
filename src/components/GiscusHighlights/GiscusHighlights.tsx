/**
 * Post-Process 组件（运行期）：读取构建期注入的评论高亮数据，按当前页面定位并渲染高亮。
 *
 * 数据流：
 *   构建期插件（plugins/giscusHighlights.ts）→ setGlobalData →
 *   这里 usePluginData 读取 → 按 document.title 匹配（对应 Giscus mapping="title"）→
 *   用引用内容在正文中锚定为 Range → CSS Highlight 渲染 → 点击高亮弹出对应评论。
 *
 * 仅在浏览器端渲染（由 index.tsx 的 BrowserOnly 包裹）。
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import {resolveQuote} from './anchoring';
import {GiscusHighlighter, annotationAtPoint} from './highlighter';
import {
  GISCUS_HIGHLIGHTS_PLUGIN,
  type GiscusHighlight,
  type GiscusHighlightsData,
} from './types';
import styles from './styles.module.css';

const CONTENT_SELECTOR = '.markdown';
const GISCUS_SELECTOR = '.giscus';

interface HighlightGroup {
  quote: string;
  comments: GiscusHighlight[];
}

interface PopoverState {
  group: HighlightGroup;
  rect: {top: number; left: number; bottom: number};
}

interface BadgeLayout {
  groupIndex: number;
  top: number;
  left: number;
  count: number;
}

/** 角标锚点：放在高亮选区最后一行的右端 */
function getBadgeAnchor(range: Range): {top: number; left: number} | null {
  const rects = range.getClientRects();
  const last =
    rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect();
  if (last.width === 0 && last.height === 0) {
    return null;
  }
  return {
    top: last.top + last.height / 2,
    left: last.right + 4,
  };
}

function CommentIcon(): JSX.Element {
  return (
    <svg
      className={styles.badgeIcon}
      width="12"
      height="12"
      viewBox="0 0 16 16"
      aria-hidden>
      <path
        fill="currentColor"
        d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v6.5A1.75 1.75 0 0 1 13.25 11H8.5l-3.2 2.4A.75.75 0 0 1 4 12.75V11H2.75A1.75 1.75 0 0 1 1 9.25v-6.5Z"
      />
    </svg>
  );
}

function normalizeKey(quote: string): string {
  return quote.replace(/\s+/g, ' ').trim();
}

/** 按标题匹配高亮：先精确，再按归一化（去首尾空白）兜底 */
function pickByTitle(
  byTitle: Record<string, GiscusHighlight[]>,
  title: string,
): GiscusHighlight[] {
  if (byTitle[title]) {
    return byTitle[title];
  }
  const trimmed = title.trim();
  for (const key of Object.keys(byTitle)) {
    if (key.trim() === trimmed) {
      return byTitle[key];
    }
  }
  return [];
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function GiscusHighlights(): JSX.Element | null {
  const data = usePluginData(GISCUS_HIGHLIGHTS_PLUGIN) as
    | GiscusHighlightsData
    | undefined;
  const location = useLocation();

  const [highlights, setHighlights] = useState<GiscusHighlight[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [badges, setBadges] = useState<BadgeLayout[]>([]);

  const rootRef = useRef<HTMLElement | null>(null);
  const highlighterRef = useRef<GiscusHighlighter | null>(null);
  const rangesRef = useRef<Map<number, Range>>(new Map());
  const popoverElRef = useRef<HTMLDivElement | null>(null);
  const badgeLayerRef = useRef<HTMLDivElement | null>(null);

  const groups = useMemo<HighlightGroup[]>(() => {
    const map = new Map<string, HighlightGroup>();
    for (const item of highlights) {
      const key = normalizeKey(item.quote);
      if (!key) {
        continue;
      }
      if (!map.has(key)) {
        map.set(key, {quote: item.quote, comments: []});
      }
      map.get(key)!.comments.push(item);
    }
    return Array.from(map.values());
  }, [highlights]);

  // 初始化 highlighter
  useEffect(() => {
    const highlighter = new GiscusHighlighter();
    highlighterRef.current = highlighter;
    return () => {
      highlighter.destroy();
      highlighterRef.current = null;
    };
  }, []);

  // 路由变化：按 document.title 取当前页高亮（标题/正文可能异步更新，做有限重试）
  useEffect(() => {
    const byTitle = data?.byTitle;
    setActiveId(null);
    setPopover(null);
    if (!byTitle || Object.keys(byTitle).length === 0) {
      rootRef.current = null;
      setHighlights([]);
      return;
    }
    let cancelled = false;
    let tries = 0;
    const run = () => {
      if (cancelled) {
        return;
      }
      const root = document.querySelector<HTMLElement>(CONTENT_SELECTOR);
      const list = pickByTitle(byTitle, document.title);
      if ((!root || list.length === 0) && tries < 6) {
        tries += 1;
        window.setTimeout(run, 200);
        return;
      }
      rootRef.current = root;
      setHighlights(list);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, data]);

  const syncBadgeLayout = useCallback(() => {
    const layout: BadgeLayout[] = [];
    rangesRef.current.forEach((range, groupIndex) => {
      const anchor = getBadgeAnchor(range);
      const group = groups[groupIndex];
      if (!anchor || !group) {
        return;
      }
      layout.push({
        groupIndex,
        top: anchor.top,
        left: anchor.left,
        count: group.comments.length,
      });
    });
    setBadges(layout);
  }, [groups]);

  // 高亮分组 / active 变化时重新锚定并渲染
  useEffect(() => {
    const highlighter = highlighterRef.current;
    if (!highlighter) {
      return;
    }
    const root = rootRef.current;
    const ranges = new Map<number, Range>();
    if (root) {
      groups.forEach((group, index) => {
        const range = resolveQuote(group.quote, root);
        if (range) {
          ranges.set(index, range);
        }
      });
    }
    rangesRef.current = ranges;
    highlighter.update(ranges, activeId);
    syncBadgeLayout();
  }, [groups, activeId, syncBadgeLayout]);

  // 滚动 / 缩放：重算角标位置；overlay 回退模式同步重绘高亮矩形
  useEffect(() => {
    const handler = () => {
      highlighterRef.current?.reposition();
      syncBadgeLayout();
    };
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [syncBadgeLayout]);

  // 点击高亮文本 -> 命中对应分组并弹出评论
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (rangesRef.current.size === 0) {
        return;
      }
      const hit = annotationAtPoint(event.clientX, event.clientY, rangesRef.current);
      if (hit == null) {
        return;
      }
      const group = groups[hit];
      const range = rangesRef.current.get(hit);
      if (!group || !range) {
        return;
      }
      const rect = range.getBoundingClientRect();
      setActiveId(hit);
      setPopover({
        group,
        rect: {top: rect.top, left: rect.left, bottom: rect.bottom},
      });
    };
    root.addEventListener('click', handleClick);
    return () => root.removeEventListener('click', handleClick);
  }, [groups, location.pathname]);

  // 点击空白处关闭弹层
  useEffect(() => {
    if (!popover) {
      return;
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (popoverElRef.current?.contains(event.target as Node)) {
        return;
      }
      if (badgeLayerRef.current?.contains(event.target as Node)) {
        return;
      }
      setPopover(null);
      setActiveId(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [popover]);

  const closePopover = useCallback(() => {
    setPopover(null);
    setActiveId(null);
  }, []);

  const scrollToGiscus = useCallback(() => {
    const el = document.querySelector(GISCUS_SELECTOR);
    el?.scrollIntoView({behavior: 'smooth', block: 'center'});
    closePopover();
  }, [closePopover]);

  const openGroupPopover = useCallback((groupIndex: number) => {
    const group = groups[groupIndex];
    const range = rangesRef.current.get(groupIndex);
    if (!group || !range) {
      return;
    }
    const rect = range.getBoundingClientRect();
    setActiveId(groupIndex);
    setPopover({
      group,
      rect: {top: rect.top, left: rect.left, bottom: rect.bottom},
    });
  }, [groups]);

  const handleBadgeClick = useCallback(
    (event: React.MouseEvent, groupIndex: number) => {
      event.preventDefault();
      event.stopPropagation();
      openGroupPopover(groupIndex);
    },
    [openGroupPopover],
  );

  // 弹层定位：优先显示在高亮下方，靠近右边界时左移
  const popoverLeft = popover
    ? Math.min(popover.rect.left, window.innerWidth - 332)
    : 0;
  const popoverTop = popover ? popover.rect.bottom + 8 : 0;

  return (
    <>
      {badges.length > 0 && (
        <div ref={badgeLayerRef} className={styles.badgeLayer}>
          {badges.map((badge) => (
            <button
              key={badge.groupIndex}
              type="button"
              className={`${styles.badge} ${
                activeId === badge.groupIndex ? styles.badgeActive : ''
              }`}
              style={{top: badge.top, left: badge.left}}
              title={`${badge.count} 条评论`}
              aria-label={`查看 ${badge.count} 条评论`}
              onClick={(e) => handleBadgeClick(e, badge.groupIndex)}>
              <CommentIcon />
              <span className={styles.badgeCount}>{badge.count}</span>
            </button>
          ))}
        </div>
      )}

      {popover && (
    <div
      ref={popoverElRef}
      className={styles.popover}
      style={{top: popoverTop, left: Math.max(12, popoverLeft)}}>
      <div className={styles.popoverHeader}>
        <span className={styles.popoverTitle}>
          💬 评论 · {popover.group.comments.length}
        </span>
        <button
          type="button"
          className={styles.popoverClose}
          aria-label="关闭"
          onClick={closePopover}>
          ×
        </button>
      </div>
      {popover.group.comments.map((comment) => (
        <div key={comment.id} className={styles.comment}>
          <div className={styles.commentHead}>
            {comment.author.avatarUrl && (
              <img
                className={styles.avatar}
                src={comment.author.avatarUrl}
                alt={comment.author.login}
              />
            )}
            <span className={styles.author}>{comment.author.login}</span>
            <span className={styles.time}>{formatTime(comment.createdAt)}</span>
          </div>
          <div className={styles.text}>{comment.text || '(无正文)'}</div>
          <div className={styles.commentFooter}>
            <a
              className={styles.link}
              href={comment.url}
              target="_blank"
              rel="noopener noreferrer">
              在 GitHub 查看
            </a>
            <button type="button" className={styles.link} onClick={scrollToGiscus}>
              跳到评论区
            </button>
          </div>
        </div>
      ))}
    </div>
      )}
    </>
  );
}
