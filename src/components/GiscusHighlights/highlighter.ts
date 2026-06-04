/**
 * Giscus 评论高亮渲染器。
 *
 * 首选 CSS Custom Highlight API（CSS.highlights + ::highlight()），它在不修改 DOM 的前提下渲染高亮，
 * 天然避开 React 水合（hydration）冲突；不支持时回退到绝对定位的 overlay 矩形层（同样不改正文 DOM）。
 *
 * 本文件自包含（不依赖站点其它模块），便于 GiscusHighlights 整体抽取。
 */

// CSS Custom Highlight API 目前在部分 TS lib 中缺少类型声明，这里做最小化补充。
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Highlight {
    add(range: AbstractRange): void;
    clear(): void;
  }
  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention
  var Highlight: {
    new (...ranges: AbstractRange[]): Highlight;
  };
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace CSS {
    const highlights: Map<string, Highlight> & {
      set(name: string, highlight: Highlight): void;
      delete(name: string): boolean;
      clear(): void;
    };
  }
}

export function supportsHighlightApi(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    typeof (CSS as {highlights?: unknown}).highlights !== 'undefined' &&
    typeof (globalThis as {Highlight?: unknown}).Highlight !== 'undefined'
  );
}

const HIGHLIGHT_NAME = 'giscus-highlight';
const ACTIVE_HIGHLIGHT_NAME = 'giscus-highlight-active';
const OVERLAY_LAYER_ID = 'giscus-highlight-overlay-layer';

export class GiscusHighlighter {
  private readonly useApi: boolean;
  private overlayLayer: HTMLDivElement | null = null;
  private ranges: Map<number, Range> = new Map();
  private activeId: number | null = null;

  constructor() {
    this.useApi = supportsHighlightApi();
  }

  update(ranges: Map<number, Range>, activeId: number | null): void {
    this.ranges = ranges;
    this.activeId = activeId;
    this.render();
  }

  /** overlay 回退模式下，滚动 / 缩放时重新计算矩形位置 */
  reposition(): void {
    if (!this.useApi) {
      this.renderOverlay();
    }
  }

  private render(): void {
    if (this.useApi) {
      this.renderWithApi();
    } else {
      this.renderOverlay();
    }
  }

  private renderWithApi(): void {
    const normal = new Highlight();
    const active = new Highlight();
    this.ranges.forEach((range, id) => {
      if (id === this.activeId) {
        active.add(range);
      } else {
        normal.add(range);
      }
    });
    CSS.highlights.set(HIGHLIGHT_NAME, normal);
    CSS.highlights.set(ACTIVE_HIGHLIGHT_NAME, active);
  }

  private ensureOverlayLayer(): HTMLDivElement {
    if (this.overlayLayer && document.body.contains(this.overlayLayer)) {
      return this.overlayLayer;
    }
    const layer = document.createElement('div');
    layer.id = OVERLAY_LAYER_ID;
    layer.className = 'giscusHighlightOverlayLayer';
    document.body.appendChild(layer);
    this.overlayLayer = layer;
    return layer;
  }

  private renderOverlay(): void {
    const layer = this.ensureOverlayLayer();
    layer.innerHTML = '';
    this.ranges.forEach((range, id) => {
      const rects = range.getClientRects();
      for (let i = 0; i < rects.length; i += 1) {
        const rect = rects[i];
        if (rect.width === 0 || rect.height === 0) {
          continue;
        }
        const div = document.createElement('div');
        div.className =
          'giscusHighlightOverlayRect' + (id === this.activeId ? ' active' : '');
        div.style.left = `${rect.left}px`;
        div.style.top = `${rect.top}px`;
        div.style.width = `${rect.width}px`;
        div.style.height = `${rect.height}px`;
        layer.appendChild(div);
      }
    });
  }

  destroy(): void {
    if (this.useApi) {
      CSS.highlights.delete(HIGHLIGHT_NAME);
      CSS.highlights.delete(ACTIVE_HIGHLIGHT_NAME);
    }
    if (this.overlayLayer && document.body.contains(this.overlayLayer)) {
      this.overlayLayer.remove();
    }
    this.overlayLayer = null;
    this.ranges = new Map();
    this.activeId = null;
  }
}

/**
 * 根据点击坐标判断命中了哪条高亮。
 * CSS Highlight 本身不可点击，因此通过 caret 定位拿到文本位置，再用 Range.isPointInRange 反查。
 */
export function annotationAtPoint(
  x: number,
  y: number,
  ranges: Map<number, Range>,
): number | null {
  let node: Node | null = null;
  let offset = 0;

  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => {offsetNode: Node; offset: number} | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };

  if (typeof doc.caretPositionFromPoint === 'function') {
    const pos = doc.caretPositionFromPoint(x, y);
    if (!pos) {
      return null;
    }
    node = pos.offsetNode;
    offset = pos.offset;
  } else if (typeof doc.caretRangeFromPoint === 'function') {
    const range = doc.caretRangeFromPoint(x, y);
    if (!range) {
      return null;
    }
    node = range.startContainer;
    offset = range.startOffset;
  } else {
    return null;
  }

  if (!node) {
    return null;
  }

  let hit: number | null = null;
  ranges.forEach((range, id) => {
    if (hit === null && node && range.isPointInRange(node, offset)) {
      hit = id;
    }
  });
  return hit;
}
