/**
 * 构建期插件：拉取 GitHub Discussion 评论，解析出「引用块 + 评论」，
 * 生成高亮数据并通过 setGlobalData 注入站点。
 *
 * 为什么放在构建期：
 *   - giscus.app 的公共 API CORS 锁定为 giscus.app 自身，浏览器跨域读不到评论正文；
 *   - GitHub 仓库 Discussions 只能走 GraphQL，且必须带 token；
 *   - 因此在构建期用 Actions 的 token 一次性拉好，运行期读静态数据即可（对匿名访客可见）。
 *
 * 约定（与 src/components/TextAnnotation 一致）：评论正文开头连续的 `>` 引用行即「划词内容」，
 * 其后为评论内容。不以引用开头的评论不参与高亮。
 *
 * Token 来源：环境变量 GISCUS_HIGHLIGHTS_TOKEN 或 GITHUB_TOKEN（需要 discussions:read）。
 * 无 token（如本地开发）时静默跳过，产出空数据，不阻断构建。
 */
import type {LoadContext, Plugin} from '@docusaurus/types';
import {
  GISCUS_HIGHLIGHTS_PLUGIN,
  type GiscusHighlight,
  type GiscusHighlightsData,
} from '../src/components/GiscusHighlights/types';

export interface GiscusHighlightsPluginOptions {
  owner: string;
  repo: string;
  /** 仅采集该分类下的 Discussion（与 Giscus 配置保持一致），不填则全部采集 */
  category?: string;
}

interface GraphQLComment {
  id: string;
  url: string;
  body: string;
  createdAt: string;
  author: {login: string; url: string; avatarUrl: string} | null;
}

interface GraphQLDiscussion {
  title: string;
  category: {name: string} | null;
  comments: {nodes: GraphQLComment[]};
}

interface GraphQLResponse {
  data?: {
    repository?: {
      discussions: {
        pageInfo: {hasNextPage: boolean; endCursor: string | null};
        nodes: GraphQLDiscussion[];
      };
    };
  };
  errors?: {message: string}[];
}

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const QUERY = `
query ($owner: String!, $name: String!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    discussions(first: 50, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        title
        category { name }
        comments(first: 100) {
          nodes {
            id
            url
            body
            createdAt
            author { login url avatarUrl }
          }
        }
      }
    }
  }
}`;

/**
 * 从评论正文中解析「引用块（划词内容）+ 评论内容」。
 * 开头连续的 `>` 行视为引用块，其后为评论。无引用块返回 null。
 */
function decodeCommentBody(body: string): {quote: string; text: string} | null {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const quoteLines: string[] = [];
  let index = 0;
  while (index < lines.length && /^>\s?/.test(lines[index])) {
    quoteLines.push(lines[index].replace(/^>\s?/, ''));
    index += 1;
  }
  if (quoteLines.length === 0) {
    return null;
  }
  const quote = quoteLines.join('\n').trim();
  const text = lines.slice(index).join('\n').trim();
  if (!quote) {
    return null;
  }
  return {quote, text};
}

async function fetchAllDiscussions(
  options: GiscusHighlightsPluginOptions,
  token: string,
): Promise<GraphQLDiscussion[]> {
  const all: GraphQLDiscussion[] = [];
  let cursor: string | null = null;

  // 安全上限，避免异常情况下的死循环
  for (let page = 0; page < 50; page += 1) {
    const response = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'agent-handbook-giscus-highlights',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {owner: options.owner, name: options.repo, cursor},
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL ${response.status}: ${await response.text()}`);
    }

    const json = (await response.json()) as GraphQLResponse;
    if (json.errors?.length) {
      throw new Error(json.errors.map((e) => e.message).join('; '));
    }

    const discussions = json.data?.repository?.discussions;
    if (!discussions) {
      break;
    }
    all.push(...discussions.nodes);
    if (discussions.pageInfo.hasNextPage && discussions.pageInfo.endCursor) {
      cursor = discussions.pageInfo.endCursor;
    } else {
      break;
    }
  }
  return all;
}

function buildHighlights(
  discussions: GraphQLDiscussion[],
  options: GiscusHighlightsPluginOptions,
): Record<string, GiscusHighlight[]> {
  const byTitle: Record<string, GiscusHighlight[]> = {};

  for (const discussion of discussions) {
    if (options.category && discussion.category?.name !== options.category) {
      continue;
    }
    const highlights: GiscusHighlight[] = [];
    for (const comment of discussion.comments.nodes) {
      const parsed = decodeCommentBody(comment.body);
      if (!parsed) {
        continue;
      }
      highlights.push({
        id: comment.id,
        url: comment.url,
        quote: parsed.quote,
        text: parsed.text,
        author: {
          login: comment.author?.login ?? 'ghost',
          avatarUrl: comment.author?.avatarUrl ?? '',
          url: comment.author?.url ?? '',
        },
        createdAt: comment.createdAt,
      });
    }
    if (highlights.length > 0) {
      byTitle[discussion.title] = highlights;
    }
  }
  return byTitle;
}

export default function giscusHighlightsPlugin(
  _context: LoadContext,
  options: GiscusHighlightsPluginOptions,
): Plugin<GiscusHighlightsData> {
  return {
    name: GISCUS_HIGHLIGHTS_PLUGIN,

    async loadContent() {
      const empty: GiscusHighlightsData = {byTitle: {}, generatedAt: new Date().toISOString()};
      const token = process.env.GISCUS_HIGHLIGHTS_TOKEN || process.env.GITHUB_TOKEN;
      if (!token) {
        console.warn(
          `[${GISCUS_HIGHLIGHTS_PLUGIN}] 未检测到 GISCUS_HIGHLIGHTS_TOKEN / GITHUB_TOKEN，跳过评论高亮数据采集。`,
        );
        return empty;
      }
      try {
        const discussions = await fetchAllDiscussions(options, token);
        const byTitle = buildHighlights(discussions, options);
        const count = Object.values(byTitle).reduce((sum, list) => sum + list.length, 0);
        console.log(
          `[${GISCUS_HIGHLIGHTS_PLUGIN}] 采集到 ${Object.keys(byTitle).length} 个页面、${count} 条高亮评论。`,
        );
        return {byTitle, generatedAt: new Date().toISOString()};
      } catch (error) {
        // 采集失败不应阻断站点构建
        console.warn(
          `[${GISCUS_HIGHLIGHTS_PLUGIN}] 采集评论高亮数据失败，将以空数据继续构建：`,
          error instanceof Error ? error.message : error,
        );
        return empty;
      }
    },

    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
}
