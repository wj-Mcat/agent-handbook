/**
 * 文本锚定：用「引用内容」在正文中搜索匹配，命中后还原为 DOM Range 以供高亮。
 *
 * 仅做文本匹配，搜索时对空白做归一化（换行/多空格折叠为单空格），以兼容 Markdown 引用换行、
 * 正文换行等差异；多处相同文本时取第一处。
 *
 * 本文件不依赖站点其它模块，使 GiscusHighlights 可整体抽取。
 */

interface Segment {
  node: Text;
  start: number;
  end: number;
}

interface RootIndex {
  text: string;
  segments: Segment[];
}

/** 遍历容器内的全部文本节点，建立「全局字符偏移 -> 文本节点」的索引 */
function buildIndex(root: HTMLElement): RootIndex {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const segments: Segment[] = [];
  let text = '';
  let node = walker.nextNode() as Text | null;
  while (node) {
    const content = node.nodeValue ?? '';
    segments.push({node, start: text.length, end: text.length + content.length});
    text += content;
    node = walker.nextNode() as Text | null;
  }
  return {text, segments};
}

/** 把全局字符偏移定位到具体文本节点及其内部偏移 */
function locate(offset: number, segments: Segment[]): {node: Text; offset: number} | null {
  if (segments.length === 0) {
    return null;
  }
  for (const seg of segments) {
    if (offset >= seg.start && offset <= seg.end) {
      return {node: seg.node, offset: offset - seg.start};
    }
  }
  const last = segments[segments.length - 1];
  return {node: last.node, offset: (last.node.nodeValue ?? '').length};
}

/**
 * 归一化文本：把连续空白折叠为单个空格。
 * 同时返回 map：归一化后第 i 个字符对应原始文本中的下标。
 */
function normalizeWithMap(text: string): {normalized: string; map: number[]} {
  let normalized = '';
  const map: number[] = [];
  let prevSpace = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      if (!prevSpace) {
        normalized += ' ';
        map.push(i);
        prevSpace = true;
      }
    } else {
      normalized += ch;
      map.push(i);
      prevSpace = false;
    }
  }
  return {normalized, map};
}

function normalizeQuote(quote: string): string {
  return quote.replace(/\s+/g, ' ').trim();
}

/**
 * 用引用内容在正文中定位，并还原为 DOM Range。找不到则返回 null。
 */
export function resolveQuote(quote: string, root: HTMLElement): Range | null {
  const target = normalizeQuote(quote);
  if (!target) {
    return null;
  }

  const {text, segments} = buildIndex(root);
  const {normalized, map} = normalizeWithMap(text);

  const matchIndex = normalized.indexOf(target);
  if (matchIndex === -1) {
    return null;
  }

  const startOffset = map[matchIndex];
  const lastCharIndex = matchIndex + target.length - 1;
  if (lastCharIndex >= map.length) {
    return null;
  }
  const endOffset = map[lastCharIndex] + 1;

  const startPoint = locate(startOffset, segments);
  const endPoint = locate(endOffset, segments);
  if (!startPoint || !endPoint) {
    return null;
  }

  const result = document.createRange();
  try {
    result.setStart(startPoint.node, startPoint.offset);
    result.setEnd(endPoint.node, endPoint.offset);
  } catch {
    return null;
  }
  return result;
}
