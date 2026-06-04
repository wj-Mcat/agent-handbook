#!/usr/bin/env python3
"""将幕布导出的 HTML 迁移为 llms 目录下的 Markdown。

用法（仓库根目录）:
    python3 scripts/mubu-html-to-md.py              # 基础概念 -> 01-foundations
    python3 scripts/mubu-html-to-md.py foundations
    python3 scripts/mubu-html-to-md.py transformer  # Transformer 系列知识点 -> 02-transformer
"""
from __future__ import annotations

import argparse
import html
import re
import subprocess
import sys
import urllib.parse
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

REPO_ROOT = Path(__file__).resolve().parents[1]
FOUNDATIONS = REPO_ROOT / "llms" / "01-foundations"
TRANSFORMER = REPO_ROOT / "llms" / "02-transformer"
T01 = TRANSFORMER / "01-transformer-principles"
T02 = TRANSFORMER / "02-transformer-details"
T03 = TRANSFORMER / "03-transformer-improvements"
T03_SPARSE = T03 / "06-sparse-attention"

# 顶层节点标题 -> 目标 md（相对 FOUNDATIONS 或绝对路径）
TOP_ROUTES: dict[str, Path] = {
    "常用算子": FOUNDATIONS / "04-deep-learning" / "03-activation-functions.md",
    "loss": FOUNDATIONS / "03-machine-learning" / "02-loss-regularization.md",
    "激活函数": FOUNDATIONS / "04-deep-learning" / "03-activation-functions.md",
    "glu": FOUNDATIONS / "04-deep-learning" / "03-activation-functions.md",
    "swish": FOUNDATIONS / "04-deep-learning" / "03-activation-functions.md",
    "silu": FOUNDATIONS / "04-deep-learning" / "03-activation-functions.md",
    "swiglu": FOUNDATIONS / "04-deep-learning" / "03-activation-functions.md",
    "regularization": FOUNDATIONS / "04-deep-learning" / "05-regularization.md",
    "High Bias & High Variance": FOUNDATIONS / "03-machine-learning" / "03-bias-variance.md",
    "量化": FOUNDATIONS / "04-deep-learning" / "07-quantization-intro.md",
    "llm 终生学习": FOUNDATIONS / "03-machine-learning" / "01-learning-paradigms.md",
    "transformer 类型": FOUNDATIONS / "01-introduction" / "03-tech-stack-overview.md",
    "warmup": FOUNDATIONS / "04-deep-learning" / "06-lr-scheduling.md",
    "小常识": FOUNDATIONS / "02-math-foundations" / "04-information-theory.md",
    "评估指标": FOUNDATIONS / "03-machine-learning" / "04-metrics-cross-validation.md",
    "bleu": FOUNDATIONS / "05-nlp-foundations" / "04-nlp-metrics.md",
    "PPL": FOUNDATIONS / "02-math-foundations" / "04-information-theory.md",
    "LLM Alignment 中的评估": FOUNDATIONS / "05-nlp-foundations" / "04-nlp-metrics.md",
    "Teacher Forcing": FOUNDATIONS / "05-nlp-foundations" / "02-classic-nlp-tasks.md",
}


def match_top_route(title: str) -> Path | None:
    t = normalize_title(title)
    if t in TOP_ROUTES:
        return TOP_ROUTES[t]
    for key, path in TOP_ROUTES.items():
        if normalize_title(key) == t:
            return path
    return None

# loss 子节点中归入学习率调度章节的标题
LOSS_CHILDREN_TO_LR = {
    "Batch Size vs Learning Rate",
    "不同 Size 的模型，Larger LLM 通常有 Larger Loss",
    "参考链接：",
}

# Metric Learning 及之后拆到 advanced-losses（若主文件过长）
ADVANCED_LOSS_ROOTS = {
    "Metric Learning",
    "Contrastive Learning",
    "Cross Entropy",
    "Parallal Cross Entropy",
    "DPO Loss",
}

ADVANCED_LOSS_PATH = FOUNDATIONS / "03-machine-learning" / "05-advanced-losses.md"
LOSS_SPLIT_THRESHOLD = 400

FOUNDATIONS_H1_OVERRIDES: dict[Path, str] = {
    FOUNDATIONS / "04-deep-learning" / "07-quantization-intro.md": (
        "# 1.4.7 量化基础（数据类型与 QLoRA / GPTQ / AWQ）"
    ),
    ADVANCED_LOSS_PATH: "# 1.3.5 进阶损失与偏好优化",
}

TRANSFORMER_H1_OVERRIDES: dict[Path, str] = {}

# Transformer 幕布顶层节点 -> 目标 md
TRANSFORMER_ROUTES: dict[str, Path] = {
    "softmax【softmax 中也是有很多优化方法】": T01 / "02-scaled-dot-product-attention.md",
    "归一化层": T01 / "06-residual-normalization.md",
    "面试常见问题": T01 / "01-architecture-overview.md",
    "为什么ffn总是要升维再降维呢": T01 / "05-feed-forward-network.md",
}

ATTENTION_VARIANT_KEYWORDS = (
    "grouped query",
    "gqa",
    "multi-lantent",
    "multi-latent",
    "mla",
)
ATTENTION_SPARSE_KEYWORDS = (
    "ring attention",
    "native sparse",
    "sparse attention",
)
SWA_KEYWORDS = (
    "sliding window",
    "滑动窗口",
    "attention sink",
    "attention-sink",
)
LOCAL_GLOBAL_KEYWORDS = (
    "longformer",
    "bigbird",
    "local global",
    "global token",
)

PE_IMPROVE_TITLES = {"Rotary Embedding", "NTK rope", "ReRope"}
FLASH_ATTN_TITLES = {"Flash Attention"}
FLASH_DECODE_TITLES = {"Flash Decoding", "TensorRT-LLM 框架"}

ML_METRIC_TITLES = {"pass @ K", "ACC", "Recall", "Precision"}
NLP_METRIC_TITLES = {"rouge", "bleu", "LLM Alignment 中的评估", "参考资料"}

NODE_MARKER = '<li class="node">'


@dataclass
class TreeNode:
    title: str
    note: str = ""
    images: list[str] = field(default_factory=list)
    children: list[TreeNode] = field(default_factory=list)


def normalize_title(title: str) -> str:
    t = html.unescape(title).strip()
    t = re.sub(r"\s+", " ", t)
    return t


def _li_close_end(fragment: str, start: int) -> int:
    """从 <li class="node"> 起始位置找到匹配的 </li>（image-item 的 li 不参与 node 栈）。"""
    stack: list[str] = ["node"]
    j = start + len(NODE_MARKER)
    while j < len(fragment) and stack:
        next_li = fragment.find("<li", j)
        next_close = fragment.find("</li>", j)
        if next_close == -1:
            return len(fragment)
        if next_li != -1 and next_li < next_close:
            tag_end = fragment.find(">", next_li)
            if tag_end == -1:
                return len(fragment)
            tag = fragment[next_li : tag_end + 1]
            if 'class="node"' in tag:
                stack.append("node")
            elif "image-item" in tag:
                stack.append("image")
            j = tag_end + 1
        else:
            end = next_close + len("</li>")
            stack.pop()
            if not stack:
                return end
            j = end
    return len(fragment)


def extract_direct_node_blocks(fragment: str) -> list[str]:
    blocks: list[str] = []
    pos = 0
    while True:
        start = fragment.find(NODE_MARKER, pos)
        if start == -1:
            break
        end = _li_close_end(fragment, start)
        blocks.append(fragment[start:end])
        pos = end
    return blocks


def inner_html_to_markdown(raw: str) -> str:
    if not raw.strip():
        return ""
    s = raw
    # links
    s = re.sub(
        r'<a[^>]+href="([^"]+)"[^>]*>.*?<span class="content-link-text">(.*?)</span>.*?</a>',
        lambda m: f"[{html.unescape(re.sub(r'<[^>]+>', '', m.group(2)).strip())}]({m.group(1)})",
        s,
        flags=re.DOTALL,
    )
    s = re.sub(
        r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',
        lambda m: f"[{html.unescape(re.sub(r'<[^>]+>', '', m.group(2)).strip())}]({m.group(1)})",
        s,
        flags=re.DOTALL,
    )
    s = re.sub(r'<span class="bold">(.*?)</span>', r"**\1**", s, flags=re.DOTALL)
    s = re.sub(r'<span class="highlight-yellow">(.*?)</span>', r"\1", s, flags=re.DOTALL)
    s = re.sub(r'<span class="text-color-red">(.*?)</span>', r"\1", s, flags=re.DOTALL)
    s = re.sub(r"<[^>]+>", "", s)
    return html.unescape(s).strip()


def extract_direct_images(block: str) -> list[str]:
    """仅提取当前节点自身的图片（不含子节点）。"""
    children_pos = block.find('<div class="children">')
    head = block[:children_pos] if children_pos != -1 else block
    return re.findall(
        r'src="(https://api2\.mubu\.com/v3/document_image/[^"]+)"',
        head,
    )


def extract_outer_children_fragment(block: str) -> str:
    """提取当前 li.node 直接子节点列表的 HTML 片段（不含 ul 外壳）。"""
    inner = block[len(NODE_MARKER) :]
    if inner.rstrip().endswith("</li>"):
        inner = inner.rstrip()[: -len("</li>")].rstrip()

    marker = '<div class="children"><ul class="node-list">'
    close = "</ul></div>"
    node_depth = 0
    i = 0
    while i < len(inner):
        if inner.startswith(NODE_MARKER, i):
            node_depth += 1
            i += len(NODE_MARKER)
            continue
        if inner.startswith("</li>", i) and node_depth > 0:
            node_depth -= 1
            i += len("</li>")
            continue
        if inner.startswith(marker, i) and node_depth == 0:
            start = i + len(marker)
            j = start
            ul_depth = 1
            while j < len(inner) and ul_depth > 0:
                next_open = inner.find("<ul", j)
                next_close = inner.find("</ul>", j)
                if next_close == -1:
                    break
                if next_open != -1 and next_open < next_close:
                    ul_depth += 1
                    j = next_open + 3
                else:
                    ul_depth -= 1
                    if ul_depth == 0:
                        return inner[start:next_close]
                    j = next_close + len("</ul>")
            return ""
        i += 1
    return ""


def parse_block(block: str) -> TreeNode:
    content_m = re.search(
        r'<div class="content mm-editor"[^>]*>(.*?)</div>',
        block,
        re.DOTALL,
    )
    title = ""
    if content_m:
        title = inner_html_to_markdown(content_m.group(1))

    note_m = re.search(
        r'<div class="note mm-editor"><span>(.*?)</span></div>',
        block,
        re.DOTALL,
    )
    note = ""
    if note_m:
        note = inner_html_to_markdown(note_m.group(1))

    images = extract_direct_images(block)

    children: list[TreeNode] = []
    child_frag = extract_outer_children_fragment(block)
    if child_frag:
        for frag in extract_direct_node_blocks(child_frag):
            children.append(parse_block(frag))

    return TreeNode(title=title, note=note, images=images, children=children)


def parse_html(html_text: str) -> list[TreeNode]:
    root_m = re.search(
        r'<div class="node collapsed drill-node">.*?<div class="children"><ul class="node-list">(.*)</ul></div>\s*</div>\s*</body>',
        html_text,
        re.DOTALL,
    )
    if not root_m:
        raise RuntimeError("无法定位幕布根节点")
    return [parse_block(b) for b in extract_direct_node_blocks(root_m.group(1))]


def image_filename(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    name = path.rsplit("/", 1)[-1]
    name = re.sub(r"^28704218_", "", name)
    return name


class ImageRegistry:
    def __init__(self) -> None:
        self.url_to_local: dict[str, str] = {}

    def register(self, url: str, md_path: Path) -> str:
        if url in self.url_to_local:
            return self.url_to_local[url]
        fname = image_filename(url)
        imgs_dir = md_path.parent / "imgs"
        imgs_dir.mkdir(parents=True, exist_ok=True)
        local = imgs_dir / fname
        if not local.exists():
            subprocess.run(
                ["curl", "-fsSL", "-o", str(local), url],
                check=True,
            )
        rel = f"./imgs/{fname}"
        self.url_to_local[url] = rel
        return rel


def node_to_markdown(
    node: TreeNode,
    depth: int,
    md_path: Path,
    registry: ImageRegistry,
) -> list[str]:
    lines: list[str] = []
    title = node.title.strip()
    is_link_only = title.startswith("http") or title.startswith("[")

    if title and not is_link_only:
        level = min(depth + 2, 4)  # H1 由文件提供；正文从 ## 起
        hashes = "#" * level
        lines.append(f"{hashes} {title}")
        lines.append("")
    elif title and is_link_only:
        lines.append(title if title.startswith("[") else f"<{title}>")
        lines.append("")

    if node.note:
        if "[TODO]" in node.note:
            lines.append(":::warning")
            lines.append(node.note)
            lines.append(":::")
        else:
            for para in node.note.split("\n"):
                para = para.strip()
                if para:
                    lines.append(para)
        lines.append("")

    for url in node.images:
        rel = registry.register(url, md_path)
        lines.append(f"![{node.title or '图示'}]({rel})")
        lines.append("")

    if depth >= 3 and node.children and title:
        for child in node.children:
            if child.title and not child.note and not child.images and not child.children:
                lines.append(f"- {child.title}")
            else:
                lines.extend(node_to_markdown(child, depth + 1, md_path, registry))
        if lines and lines[-1] != "":
            lines.append("")
    else:
        for child in node.children:
            lines.extend(node_to_markdown(child, depth + 1, md_path, registry))

    if not title and not node.note and not node.images and not node.children:
        return []
    return lines


def render_nodes(
    nodes: list[TreeNode],
    md_path: Path,
    registry: ImageRegistry,
    start_depth: int = 0,
) -> str:
    parts: list[str] = []
    for node in nodes:
        parts.extend(node_to_markdown(node, start_depth, md_path, registry))
    return "\n".join(parts).strip() + "\n"


def sanitize_markdown(content: str) -> str:
    """避免 MDX 将 `{var}`、标题中的 `<` 解析为 JSX。"""
    out: list[str] = []
    for line in content.splitlines():
        if line.startswith("#") and "<" in line and "`" not in line:
            line = line.replace("<", "&lt;")
        if "{" in line and "}" in line and "$" not in line and "`" not in line:
            if re.search(r"_\{[a-z]+\}", line) and not line.startswith("#"):
                line = f"`{line.strip()}`"
            elif re.search(r"\{[^{}]+\}", line):
                line = line.replace("{", "\\{").replace("}", "\\}")
        out.append(line)
    return "\n".join(out).rstrip() + "\n"


def read_h1(md_path: Path, h1_overrides: dict[Path, str] | None = None) -> str:
    overrides = h1_overrides or FOUNDATIONS_H1_OVERRIDES
    if md_path in overrides:
        return overrides[md_path]
    if md_path.exists():
        first = md_path.read_text(encoding="utf-8").splitlines()
        if first and first[0].startswith("# "):
            return first[0]
    return "# 章节"


def split_high_bias(reg_node: TreeNode) -> tuple[TreeNode, TreeNode | None]:
    """从 regularization 子树中拆出 High Bias & High Variance。"""
    bias_node: TreeNode | None = None
    new_top_children: list[TreeNode] = []

    for child in reg_node.children:
        if normalize_title(child.title) != "regularization":
            new_top_children.append(child)
            continue
        kept: list[TreeNode] = []
        for sub in child.children:
            if normalize_title(sub.title) == "High Bias & High Variance":
                bias_node = sub
            else:
                kept.append(sub)
        new_top_children.append(
            TreeNode(title=child.title, note=child.note, children=kept)
        )

    trimmed = TreeNode(
        title=reg_node.title, note=reg_node.note, children=new_top_children
    )
    return trimmed, bias_node


def split_eval_metrics(node: TreeNode) -> dict[Path, list[TreeNode]]:
    buckets: dict[Path, list[TreeNode]] = {}
    for child in node.children:
        t = normalize_title(child.title)
        if t in ML_METRIC_TITLES:
            p = FOUNDATIONS / "03-machine-learning" / "04-metrics-cross-validation.md"
        elif t in NLP_METRIC_TITLES or t == "参考资料":
            p = FOUNDATIONS / "05-nlp-foundations" / "04-nlp-metrics.md"
        elif t == "PPL":
            p = FOUNDATIONS / "02-math-foundations" / "04-information-theory.md"
        else:
            p = FOUNDATIONS / "03-machine-learning" / "04-metrics-cross-validation.md"
        buckets.setdefault(p, []).append(child)
    return buckets


def route_loss_children(loss_node: TreeNode) -> tuple[list[TreeNode], list[TreeNode]]:
    """将 loss 子树拆为 loss 主章与学习率调度章。"""
    main_children: list[TreeNode] = []
    lr_children: list[TreeNode] = []
    for child in loss_node.children:
        t = normalize_title(child.title)
        if t in LOSS_CHILDREN_TO_LR:
            lr_children.append(child)
        elif t == "ppo loss":
            main_children.append(child)
        elif t in ADVANCED_LOSS_ROOTS:
            main_children.append(child)  # 先放主文件，后续可能再拆
        else:
            main_children.append(child)
    return main_children, lr_children


def collect_for_route(top_nodes: list[TreeNode]) -> dict[Path, list[TreeNode]]:
    buckets: dict[Path, list[TreeNode]] = {}
    loss_note = ""
    loss_advanced: list[TreeNode] = []

    for node in top_nodes:
        title = normalize_title(node.title)
        if title == "loss":
            loss_note = node.note
            main_c, lr_c = route_loss_children(node)
            p = TOP_ROUTES["loss"]
            if loss_note:
                buckets.setdefault(p, []).append(
                    TreeNode(title="概览", note=loss_note, children=[])
                )
            buckets.setdefault(p, []).extend(main_c)
            if lr_c:
                lr_path = FOUNDATIONS / "04-deep-learning" / "06-lr-scheduling.md"
                buckets.setdefault(lr_path, []).append(
                    TreeNode(title="训练规模与学习率", children=lr_c)
                )
            continue

        if title == "regularization":
            trimmed, bias = split_high_bias(node)
            buckets.setdefault(TOP_ROUTES["regularization"], []).append(trimmed)
            if bias:
                buckets.setdefault(TOP_ROUTES["High Bias & High Variance"], []).append(
                    bias
                )
            continue

        if title == "评估指标":
            for path, nodes in split_eval_metrics(node).items():
                buckets.setdefault(path, []).extend(nodes)
            continue

        path = match_top_route(title)
        if not path:
            print(f"警告: 未映射顶层节点 «{title}»，已跳过")
            continue

        # 常用算子与激活函数合并到同一 md
        if title == "常用算子":
            buckets.setdefault(path, []).insert(0, node)
            continue

        buckets.setdefault(path, []).append(node)

    return buckets


def is_attention_variant(title: str) -> bool:
    t = normalize_title(title).lower()
    return any(k in t for k in ATTENTION_VARIANT_KEYWORDS)


def is_sparse_attention_topic(title: str) -> bool:
    t = normalize_title(title).lower()
    return any(k in t for k in ATTENTION_SPARSE_KEYWORDS)


def is_sliding_window_topic(title: str) -> bool:
    t = normalize_title(title).lower()
    return any(k in t for k in SWA_KEYWORDS)


def is_local_global_topic(title: str) -> bool:
    t = normalize_title(title).lower()
    return any(k in t for k in LOCAL_GLOBAL_KEYWORDS)


def sparse_route_path(title: str) -> Path:
    t = normalize_title(title).lower()
    if "ring" in t:
        return T03_SPARSE / "02-ring-attention.md"
    if "native sparse" in t or t == "nsa":
        return T03_SPARSE / "03-native-sparse-attention.md"
    if "deepseek" in t or "dsa" in t or "mla" in t and "sparse" in t:
        return T03_SPARSE / "04-deepseek-sparse-route.md"
    if "linear" in t or "performer" in t or "lightning" in t:
        return T03_SPARSE / "05-linear-attention.md"
    if is_sliding_window_topic(title):
        return T03_SPARSE / "06-sliding-window-attention.md"
    if is_local_global_topic(title):
        return T03_SPARSE / "07-local-global-sparse.md"
    return T03_SPARSE / "01-overview.md"


def split_position_info(node: TreeNode) -> dict[Path, list[TreeNode]]:
    basic: list[TreeNode] = []
    improve: list[TreeNode] = []
    for child in node.children:
        if normalize_title(child.title) in PE_IMPROVE_TITLES:
            improve.append(child)
        else:
            basic.append(child)
    return {
        T01 / "04-positional-encoding.md": [
            TreeNode(title="位置编码", children=basic),
        ],
        T03 / "01-positional-encoding-improvements.md": [
            TreeNode(title="位置编码改进", children=improve),
        ],
    }


def split_performance(node: TreeNode) -> dict[Path, list[TreeNode]]:
    flash_attn: list[TreeNode] = []
    decode: list[TreeNode] = []
    for child in node.children:
        t = normalize_title(child.title)
        if t in FLASH_ATTN_TITLES:
            flash_attn.append(child)
        elif t in FLASH_DECODE_TITLES or "Flash" in child.title:
            decode.append(child)
        else:
            flash_attn.append(child)
    buckets: dict[Path, list[TreeNode]] = {}
    if flash_attn:
        buckets[T03 / "05-flash-attention.md"] = [
            TreeNode(title="Flash Attention 与 IO 优化", children=flash_attn),
        ]
    if decode:
        buckets[T02 / "02-decoder-causal-mask.md"] = [
            TreeNode(title="解码加速", children=decode),
        ]
    return buckets


def split_attention(node: TreeNode) -> dict[Path, list[TreeNode]]:
    variants: list[TreeNode] = []
    sparse_by_path: dict[Path, list[TreeNode]] = {}
    core: list[TreeNode] = []
    for child in node.children:
        if is_attention_variant(child.title):
            variants.append(child)
        elif is_sparse_attention_topic(child.title) or is_sliding_window_topic(
            child.title
        ) or is_local_global_topic(child.title):
            path = sparse_route_path(child.title)
            sparse_by_path.setdefault(path, []).append(child)
        else:
            core.append(child)
    buckets: dict[Path, list[TreeNode]] = {
        T01 / "03-multi-head-attention.md": [node],
    }
    if variants:
        buckets[T03 / "04-attention-variants.md"] = [
            TreeNode(title="注意力变体（GQA / MLA）", children=variants),
        ]
    for path, items in sparse_by_path.items():
        buckets.setdefault(path, []).append(
            TreeNode(title="稀疏与长序列 Attention", children=items),
        )
    return buckets


def collect_for_route_transformer(top_nodes: list[TreeNode]) -> dict[Path, list[TreeNode]]:
    buckets: dict[Path, list[TreeNode]] = {}
    overview_misc: list[TreeNode] = []

    for node in top_nodes:
        title = normalize_title(node.title)

        if title == "position Info":
            for path, nodes in split_position_info(node).items():
                buckets.setdefault(path, []).extend(nodes)
            continue

        if title == "高性能":
            for path, nodes in split_performance(node).items():
                buckets.setdefault(path, []).extend(nodes)
            continue

        if title == "解码方法":
            buckets.setdefault(T02 / "02-decoder-causal-mask.md", []).append(
                TreeNode(title="解码与采样策略", children=node.children)
            )
            continue

        if title == "Attention":
            for path, nodes in split_attention(node).items():
                if path in buckets and str(path).startswith(str(T03_SPARSE)):
                    buckets[path].extend(nodes)
                else:
                    buckets.setdefault(path, []).extend(nodes)
            continue

        if title == "残差网络":
            buckets.setdefault(T01 / "06-residual-normalization.md", []).append(node)
            continue

        if title == "MoE":
            buckets.setdefault(T01 / "05-feed-forward-network.md", []).append(
                TreeNode(title="MoE 与 FFN", children=node.children)
            )
            continue

        if title.startswith("[TODO]") or title.startswith("HTP"):
            overview_misc.append(node)
            continue

        path = TRANSFORMER_ROUTES.get(title)
        if path is None:
            for key, p in TRANSFORMER_ROUTES.items():
                if normalize_title(key) == title:
                    path = p
                    break
        if path:
            buckets.setdefault(path, []).append(node)
        else:
            print(f"警告: 未映射 Transformer 顶层节点 «{title}»，归入架构概览")
            overview_misc.append(node)

    if overview_misc:
        buckets.setdefault(T01 / "01-architecture-overview.md", []).extend(overview_misc)

    return buckets


def transformer_file_extra(md_path: Path, body: str) -> str:
    extra = ""
    if md_path == T03 / "05-flash-attention.md":
        extra = (
            "> 本章幕布笔记侧重 Flash Attention / Flash Decoding 等 IO 与注意力加速；"
            "稀疏与长序列路线见 `06-sparse-attention/`；完整推理栈见 `llms/05-inference-deployment/`。\n\n"
        )
    if md_path == T03_SPARSE / "01-overview.md":
        extra = (
            "> Flash Attention 见 `05-flash-attention`；完整推理栈见 `llms/05-inference-deployment/`。\n\n"
        )
    if md_path == T02 / "02-decoder-causal-mask.md" and "speculative" in body.lower():
        extra = (
            "> 自回归解码基础见本章；投机解码、Assistant Decoding 等属推理加速技巧。\n\n"
        )
    return extra


def write_markdown_files(
    buckets: dict[Path, list[TreeNode]],
    *,
    h1_overrides: dict[Path, str] | None = None,
    file_extra: Callable[[Path, str], str] | None = None,
    split_loss: bool = False,
    loss_path: Path | None = None,
    advanced_loss_path: Path | None = None,
) -> None:
    registry = ImageRegistry()
    loss_path = loss_path or TOP_ROUTES.get("loss")
    advanced_loss_path = advanced_loss_path or ADVANCED_LOSS_PATH

    # 可能拆分 advanced losses（仅 foundations）
    if split_loss and loss_path and loss_path in buckets:
        preview = render_nodes(buckets[loss_path], loss_path, registry)
        line_count = preview.count("\n") + 1
        if line_count > LOSS_SPLIT_THRESHOLD:
            main_nodes: list[TreeNode] = []
            adv_nodes: list[TreeNode] = []
            for n in buckets[loss_path]:
                if n.title == "loss":
                    new_children: list[TreeNode] = []
                    for c in n.children:
                        if normalize_title(c.title) in ADVANCED_LOSS_ROOTS:
                            adv_nodes.append(c)
                        else:
                            new_children.append(c)
                    main_nodes.append(
                        TreeNode(title=n.title, note=n.note, children=new_children)
                    )
                else:
                    main_nodes.append(n)
            buckets[loss_path] = main_nodes
            if adv_nodes:
                buckets[advanced_loss_path] = [
                    TreeNode(title="进阶损失与偏好优化", children=adv_nodes)
                ]

    for md_path, nodes in sorted(buckets.items(), key=lambda x: str(x[0])):
        h1 = read_h1(md_path, h1_overrides)
        body = render_nodes(nodes, md_path, registry)
        md_path.parent.mkdir(parents=True, exist_ok=True)

        extra = file_extra(md_path, body) if file_extra else ""
        if md_path.name == "07-quantization-intro.md" and not extra:
            extra = (
                "> 更完整的推理期量化实践见 "
                "`llms/05-inference-deployment/03-quantization/`。\n\n"
            )
        if md_path.name == "04-nlp-metrics.md" and "bleu" in body:
            extra += (
                "> 分类任务常用指标（Accuracy / Recall / Precision）见 "
                "[1.3.4 评估指标与交叉验证](../03-machine-learning/04-metrics-cross-validation.md)。\n\n"
            )
        if md_path.name == "04-information-theory.md" and "PPL" in body:
            extra += (
                "> NLP 生成质量指标（BLEU / ROUGE）见 "
                "[1.5.4 评估指标](../05-nlp-foundations/04-nlp-metrics.md)。\n\n"
            )
        if md_path.name == "03-tech-stack-overview.md":
            extra += (
                "本节补充 Transformer 架构范式；更系统的原理见 "
                "`llms/02-transformer/`。\n\n"
            )
        if md_path.name == "01-learning-paradigms.md":
            extra += "以下为 LLM **终生学习 / 持续学习** 相关备忘。\n\n"
        if md_path.name == "02-classic-nlp-tasks.md":
            extra += "## 序列生成训练\n\n"
            if "Teacher Forcing" in body and len(body.strip()) < 80:
                body = (
                    "### Teacher Forcing\n\n"
                    "训练序列模型（如 RNN、Transformer Decoder）时，**Teacher Forcing** 指："
                    "解码第 $t$ 步时，把**真实上一 token**（来自标注序列）作为输入，"
                    "而不是模型上一步的预测。这样能加速收敛，但会造成 **exposure bias**——"
                    "训练时总看到正确历史，推理时只能用自己的预测，分布不一致。\n\n"
                    "常见缓解方式：Scheduled Sampling、Professor Forcing 等。\n"
                )

        content = sanitize_markdown(f"{h1}\n\n{extra}{body}")
        md_path.write_text(content, encoding="utf-8")
        print(f"写入 {md_path.relative_to(REPO_ROOT)} ({len(content.splitlines())} 行)")


def migrate_foundations() -> None:
    html_path = REPO_ROOT / "基础概念.html"
    html_text = html_path.read_text(encoding="utf-8")
    top_nodes = parse_html(html_text)
    print(f"[foundations] 解析 {html_path.name} -> {len(top_nodes)} 个顶层节点")
    buckets = collect_for_route(top_nodes)
    write_markdown_files(
        buckets,
        h1_overrides=FOUNDATIONS_H1_OVERRIDES,
        split_loss=True,
    )


def migrate_transformer() -> None:
    html_path = REPO_ROOT / "Transformer 系列知识点.html"
    html_text = html_path.read_text(encoding="utf-8")
    top_nodes = parse_html(html_text)
    print(f"[transformer] 解析 {html_path.name} -> {len(top_nodes)} 个顶层节点")
    buckets = collect_for_route_transformer(top_nodes)
    write_markdown_files(
        buckets,
        h1_overrides=TRANSFORMER_H1_OVERRIDES,
        file_extra=transformer_file_extra,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="幕布 HTML -> llms Markdown")
    parser.add_argument(
        "profile",
        nargs="?",
        default="all",
        choices=("all", "foundations", "transformer"),
        help="迁移目标（默认 all）",
    )
    args = parser.parse_args()
    if args.profile in ("all", "foundations"):
        migrate_foundations()
    if args.profile in ("all", "transformer"):
        migrate_transformer()


if __name__ == "__main__":
    main()
