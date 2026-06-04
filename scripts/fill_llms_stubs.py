#!/usr/bin/env python3
"""为 llms 目录中仅含 H1 的占位 Markdown 填充结构化正文（不覆盖已有长文）。"""
from __future__ import annotations

import os
import re
import sys

# 复用 gen_llms_outline 的结构定义
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_llms_outline import APPENDIX, LLMS_DIR, PARTS  # noqa: E402

MIN_LINES = 20  # 低于此行数视为待填充

# paper-reading 映射（llms 08 相对路径 -> paper-reading slug）
TECH_REPORT_LINKS: dict[str, str] = {
    "08-technical-reports/01-deepseek/01-deepseek-v3.md": "/paper-reading/tech-report/deepseek/deepseek-v3",
    "08-technical-reports/01-deepseek/02-deepseek-r1.md": "/paper-reading/tech-report/deepseek/deepseek-r1",
    "08-technical-reports/01-deepseek/03-deepseek-v3-2.md": "/paper-reading/tech-report/deepseek/deepseek-v4",
    "08-technical-reports/02-qwen/01-qwen2-5.md": "/paper-reading/tech-report/qwen/qwen2-5",
    "08-technical-reports/02-qwen/02-qwen3.md": "/paper-reading/tech-report/qwen/qwen3",
    "08-technical-reports/03-llama/01-llama-4.md": "/paper-reading/tech-report/international/llama-4",
    "08-technical-reports/05-glm/01-glm-4-5.md": "/paper-reading/tech-report/glm/glm-4-5",
    "08-technical-reports/06-others/01-minimax.md": "/paper-reading/tech-report/minimax/minimax-01",
    "08-technical-reports/06-others/03-gemma-3.md": "/paper-reading/tech-report/international/gemma-2-3",
    "08-technical-reports/06-others/04-olmo-2.md": "/paper-reading/tech-report/international/olmo-2",
    "08-technical-reports/06-others/05-mistral.md": "/paper-reading/tech-report/international/mistral-mixtral",
}

# 按 slug 补充的要点（2024–2026 主流实践）
SLUG_EXTRAS: dict[str, list[str]] = {
    "data-sources": [
        "**Common Crawl / C4**：网页语料基座。",
        "**The Pile / Dolma / FineWeb**：开源社区高质量混合语料，含去重与质量分。",
        "**代码与数学**：GitHub、StackExchange、arXiv 等提升推理与代码能力。",
    ],
    "dpo": [
        "直接优化偏好对 $(x, y_w, y_l)$，无需显式 RM；Stable 且易复现。",
        "与 PPO-RLHF 对比：实现简单、无 critic 网络。",
    ],
    "grpo-rloo": [
        "**GRPO**（DeepSeek-R1）：组内相对奖励，省 critic。",
        "**RLOO**：leave-one-out 基线减方差。",
    ],
    "deepseek-r1": [
        "纯 RL（GRPO）激发长链推理；开源权重与训练思路影响 2025 推理模型潮。",
        "领读：[DeepSeek-R1](/paper-reading/tech-report/deepseek/deepseek-r1)。",
    ],
    "kv-cache": [
        r"自回归推理缓存历史 $K,V$；体积 $\approx 2 \cdot L \cdot H \cdot d \cdot \text{layers}$。",
        "与 [PagedAttention](./02-paged-attention) 结合管理显存碎片。",
    ],
    "o1-o3-paradigm": [
        "测试时增加 **思考 token / 搜索**，用算力换推理准确率。",
        "与训练时 scaling 正交，见 [推理时 Scaling Laws](./05-inference-scaling-laws)。",
    ],
    "lora-qlora": [
        r"低秩适配 $\Delta W = BA$；**QLoRA** 在 4bit 基座上训练适配器。",
        "消费级 GPU 微调 LLM 的事实标准。",
    ],
}


def rel_path_from_llms(abs_path: str) -> str:
    return os.path.relpath(abs_path, LLMS_DIR).replace("\\", "/")


def iter_doc_paths():
    for part_idx, (part_dir, _part_label, chapters) in enumerate(PARTS, 1):
        part_path = os.path.join(LLMS_DIR, f"{part_idx:02d}-{part_dir}")
        for ch_idx, chapter in enumerate(chapters, 1):
            ch_dir, ch_title, sections = chapter[0], chapter[1], chapter[2]
            ch_path = os.path.join(part_path, f"{ch_idx:02d}-{ch_dir}")
            for sec_idx, section in enumerate(sections, 1):
                if len(section) == 3:
                    sec_slug, sec_title, subsections = section
                    sub_path = os.path.join(ch_path, f"{sec_idx:02d}-{sec_slug}")
                    for sub_idx, (sub_slug, sub_title) in enumerate(subsections, 1):
                        fp = os.path.join(sub_path, f"{sub_idx:02d}-{sub_slug}.md")
                        num = f"{part_idx}.{ch_idx}.{sec_idx}.{sub_idx}"
                        yield fp, num, sub_title, ch_title
                else:
                    sec_slug, sec_title = section
                    fp = os.path.join(ch_path, f"{sec_idx:02d}-{sec_slug}.md")
                    num = f"{part_idx}.{ch_idx}.{sec_idx}"
                    yield fp, num, sec_title, ch_title

    ap_dir, _, ap_items = APPENDIX
    ap_path = os.path.join(LLMS_DIR, f"{len(PARTS) + 1:02d}-{ap_dir}")
    for idx, (_slug, title) in enumerate(ap_items, 1):
        fp = os.path.join(ap_path, f"{idx:02d}-{_slug.replace('a-', 'a-').split('-', 1)[0] if False else _slug}.md")
        # appendix files: 01-a-math-notation.md pattern from gen - check actual names
        pass


def appendix_paths():
    ap_dir, _, ap_items = APPENDIX
    ap_path = os.path.join(LLMS_DIR, f"{len(PARTS) + 1:02d}-{ap_dir}")
    for idx, (slug, title) in enumerate(ap_items, 1):
        yield os.path.join(ap_path, f"{idx:02d}-{slug}.md"), title


def count_lines(path: str) -> int:
    if not os.path.isfile(path):
        return 0
    with open(path, encoding="utf-8") as f:
        return sum(1 for _ in f)


def generate_body(num: str, title: str, chapter: str, slug: str, rel: str) -> str:
    extras = SLUG_EXTRAS.get(slug, [])
    pr_link = TECH_REPORT_LINKS.get(rel)

    lines = [
        f"## 要解决的问题",
        f"",
        f"本节「{title}」属于 **{chapter}**，是 LLM 知识体系中需要掌握的一环。理解其动机有助于在阅读论文、技术报告或工程方案时快速定位设计选择。",
        f"",
        f"## 核心概念",
        f"",
    ]
    if extras:
        for e in extras:
            lines.append(f"- {e}")
        lines.append("")
    else:
        lines.extend([
            f"- **定义**：{title} 在工业界与开源社区中的主流含义（以 2024–2026 实践为准）。",
            f"- **与上下游关系**：与同一章相邻小节及前后部分模块配合使用。",
            "",
        ])

    lines.extend([
        f"## 方法 / 流程要点",
        f"",
        f"1. 明确输入、输出与评价指标。",
        f"2. 选择与本节主题匹配的算法、系统或数据配方。",
        f"3. 在小规模上验证后再扩展规模（数据量、参数量或集群规模）。",
        f"",
        f"## 工程与成本",
        f"",
        f"- **算力**：训练/推理各阶段的瓶颈可能不同（FLOPs、显存、通信、KV 带宽）。",
        f"- **实现**：优先选用成熟开源栈（PyTorch、DeepSpeed、vLLM、Hugging Face 等）。",
        f"- **可观测**：记录 loss、吞吐、延迟与质量基准，便于回归对比。",
        f"",
        f"## 代表工作（2024–2026）",
        f"",
    ])

    if pr_link:
        lines.extend([
            f"完整技术报告领读见 [paper-reading 专栏]({pr_link})。",
            f"",
            f":::tip 学习路径",
            f"",
            f"本页为 **第八部分学习大纲摘要**；深度拆解、架构表与链接索引以 paper-reading 为准，避免双处全文维护。",
            f"",
            f":::",
            f"",
        ])
    else:
        lines.extend([
            f"- 查阅本节标题对应的 **原始论文、官方博客或技术报告**（发布年份以官方为准）。",
            f"- 本仓库 [paper-reading](/paper-reading/) 与 [docs 默认文档区](/docs/) 可能有相关领读或笔记。",
            f"",
        ])

    lines.extend([
        f"## 局限与注意点",
        f"",
        f"- 不同厂商 recipe 不可直接照搬，需结合自己的数据与算力。",
        f"- 评测基准存在 **污染、过拟合提示词** 等风险（见第七部分评估方法）。",
        f"",
        f":::note 持续更新",
        f"",
        f"正文由大纲自动补全生成；欢迎按 [CLAUDE.md](../CLAUDE.md) 规范增补公式、图示与最新论文链接。",
        f"",
        f":::",
        f"",
        f"## 相关章节",
        f"",
        f"- 所属章：**{chapter}**",
        f"- 全站索引：[LLMs 入口](/llms/intro)",
        f"",
    ])
    return "\n".join(lines)


def main() -> None:
    filled = 0
    skipped = 0
    for fp, num, title, chapter in iter_doc_paths():
        if not os.path.isfile(fp):
            continue
        if count_lines(fp) >= MIN_LINES:
            skipped += 1
            continue
        slug = re.sub(r"^\d+-", "", os.path.basename(fp).replace(".md", ""))
        rel = rel_path_from_llms(fp)
        h1 = f"# {num} {title}"
        body = generate_body(num, title, chapter, slug, rel)
        with open(fp, "w", encoding="utf-8") as f:
            f.write(h1 + "\n\n" + body + "\n")
        filled += 1

    for fp, title in appendix_paths():
        if not os.path.isfile(fp):
            continue
        if count_lines(fp) >= MIN_LINES:
            skipped += 1
            continue
        h1 = f"# {title}"
        body = generate_body("附录", title, "附录", os.path.basename(fp), rel_path_from_llms(fp))
        with open(fp, "w", encoding="utf-8") as f:
            f.write(h1 + "\n\n" + body + "\n")
        filled += 1

    print(f"filled={filled} skipped={skipped}")


if __name__ == "__main__":
    main()
