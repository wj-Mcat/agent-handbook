import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {type AnnotationConfig, defaultConfig} from './config';
import styles from './styles.module.css';

interface Props {
  config?: Partial<AnnotationConfig>;
}

interface Draft {
  quote: string;
  rect: {top: number; left: number};
}

/** 根据选区在视口中的包围盒计算气泡位置（fixed 定位，需随滚动重算） */
function getPopoverRect(range: Range): {top: number; left: number} {
  const rect = range.getBoundingClientRect();
  return {
    top: Math.max(8, rect.top - 44),
    left: rect.left + rect.width / 2,
  };
}

/** 把划词内容转成 Markdown 引用格式：`> 第一行\n> 第二行\n\n`，留空行供用户补充评论 */
function buildQuoteMarkdown(quote: string): string {
  const quoted = quote
    .replace(/\r\n/g, '\n')
    .replace(/\n+$/g, '')
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
  return `${quoted}\n\n`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 继续走兜底方案
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

/** 从当前选区读取划词草稿；选区无效或不在正文容器内时返回 null */
function readDraftFromSelection(root: HTMLElement): {draft: Draft; range: Range} | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) {
    return null;
  }
  const quote = selection.toString();
  if (!quote.trim()) {
    return null;
  }
  const cloned = range.cloneRange();
  return {
    draft: {quote, rect: getPopoverRect(cloned)},
    range: cloned,
  };
}

export default function TextAnnotations({config: configOverride}: Props): JSX.Element {
  const config = useMemo<AnnotationConfig>(
    () => ({...defaultConfig, ...configOverride}),
    [configOverride],
  );

  const rootRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  /** 划词时的 DOM Range 副本，用于滚动时重新对齐气泡 */
  const selectionRangeRef = useRef<Range | null>(null);
  const selectionSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const clearDraft = useCallback(() => {
    selectionRangeRef.current = null;
    setDraft(null);
  }, []);

  const applySelection = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const result = readDraftFromSelection(root);
    if (result) {
      selectionRangeRef.current = result.range;
      setDraft(result.draft);
    }
  }, []);

  /** 移动端选区往往在 touchend / selectionchange 之后才稳定，做短延迟合并 */
  const scheduleSelectionSync = useCallback(() => {
    if (selectionSyncTimerRef.current != null) {
      clearTimeout(selectionSyncTimerRef.current);
    }
    selectionSyncTimerRef.current = setTimeout(() => {
      selectionSyncTimerRef.current = null;
      applySelection();
    }, 120);
  }, [applySelection]);

  useEffect(() => {
    rootRef.current = document.querySelector<HTMLElement>(config.contentSelector);
  }, [config.contentSelector]);

  // 划词：桌面 mouseup + 移动 touchend + selectionchange（手机主要依赖后两者）
  useEffect(() => {
    const handleMouseUp = () => {
      applySelection();
    };
    const handleTouchEnd = () => {
      scheduleSelectionSync();
    };
    const handleSelectionChange = () => {
      scheduleSelectionSync();
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd, {passive: true});
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (selectionSyncTimerRef.current != null) {
        clearTimeout(selectionSyncTimerRef.current);
      }
    };
  }, [applySelection, scheduleSelectionSync]);

  // 滚动 / 缩放时按当前选区视口坐标重算气泡位置（fixed 不会随文档滚动）
  useEffect(() => {
    if (!draft) {
      return;
    }
    const updatePosition = () => {
      const range = selectionRangeRef.current;
      if (!range) {
        return;
      }
      try {
        if (!range.startContainer.isConnected) {
          clearDraft();
          return;
        }
        const rect = getPopoverRect(range);
        setDraft((prev) => (prev ? {...prev, rect} : null));
      } catch {
        clearDraft();
      }
    };
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [draft?.quote, clearDraft]);

  // 点击气泡以外区域关闭；若正文内仍有有效选区则保留（避免手机抬手时误关）
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (popoverRef.current?.contains(event.target as Node)) {
        return;
      }
      const root = rootRef.current;
      if (root?.contains(event.target as Node)) {
        const stillSelected = readDraftFromSelection(root);
        if (stillSelected) {
          return;
        }
      }
      clearDraft();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [clearDraft]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const handleComment = useCallback(async () => {
    if (!draft) {
      return;
    }
    const markdown = buildQuoteMarkdown(draft.quote);
    const copied = await copyText(markdown);
    clearDraft();
    window.getSelection()?.removeAllRanges();

    const iframe = document.querySelector<HTMLElement>(config.giscusIframeSelector);
    if (iframe) {
      iframe.scrollIntoView({behavior: 'smooth', block: 'center'});
    }

    if (copied) {
      showToast(
        iframe
          ? '✅ 引用已复制，请在下方评论框粘贴并补充你的评论后发表'
          : '✅ 引用已复制，请到评论区粘贴并补充你的评论后发表',
      );
    } else {
      showToast('⚠ 自动复制失败，请手动复制选中的文字到评论框');
    }
  }, [draft, config.giscusIframeSelector, showToast, clearDraft]);

  return (
    <>
      {draft && (
        <div
          ref={popoverRef}
          className={styles.selectionPopover}
          style={{top: draft.rect.top, left: draft.rect.left}}>
          <button
            type="button"
            className={styles.selectionButton}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            onClick={handleComment}>
            💬 引用并评论
          </button>
        </div>
      )}
      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
