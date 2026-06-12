#!/usr/bin/env python3
"""批量去除 llms 文档区三级及以上标题中的点分序号。

规则：
- 路径深度 <= 2（相对 llms/）：保留序号（如「第一部分」「1.2 机器学习」）
- 路径深度 >= 3：剥离 >=3 段点分序号前缀（如 4.4.1、2.3.6.1）

用法：
  python scripts/strip_llms_section_numbers.py --dry-run
  python scripts/strip_llms_section_numbers.py --write
"""
from __future__ import annotations

import argparse
import os
import re
import sys

LLMS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "llms")

# 至少 3 段点分数字 + 空格，如 4.4.1 、2.3.6.8
NUMBER_PREFIX = re.compile(r"^\d+(?:\.\d+){2,}\s+")

FRONT_MATTER_FIELDS = ("title:", "sidebar_label:")


def dir_depth(rel_path: str) -> int:
    """相对 llms/ 的目录深度（不含文件名本身）。"""
    parts = rel_path.replace("\\", "/").split("/")
    if parts[-1].endswith(".md") or parts[-1] == "_category_.yml":
        parts = parts[:-1]
    return len(parts)


def should_strip(rel_path: str) -> bool:
    depth = dir_depth(rel_path)
    if rel_path.endswith("_category_.yml"):
        # 嵌套分类目录（如 part/chapter/subsection/）深度 >= 3
        return depth >= 3
    if rel_path.endswith(".md"):
        # 章下小节文档（part/chapter/doc.md）深度 >= 2
        return depth >= 2
    return False


def strip_prefix(text: str) -> str:
    return NUMBER_PREFIX.sub("", text)


def process_category(content: str) -> tuple[str, bool]:
    changed = False
    lines = content.splitlines(keepends=True)
    out: list[str] = []
    for line in lines:
        if line.startswith("label:"):
            # label: "4.4.1 DPO" 或 label: 4.4.1 DPO
            m = re.match(r'^(label:\s*)(?:"([^"]*)"|\'([^\']*)\'|(.+))\s*$', line.rstrip("\n"))
            if m:
                prefix, dq, sq, bare = m.groups()
                raw = dq if dq is not None else (sq if sq is not None else bare)
                stripped = strip_prefix(raw)
                if stripped != raw:
                    changed = True
                    safe = stripped.replace('"', '\\"')
                    out.append(f'{prefix}"{safe}"\n')
                    continue
        out.append(line)
    return "".join(out), changed


def process_markdown(content: str) -> tuple[str, bool]:
    changed = False
    lines = content.splitlines(keepends=True)
    out: list[str] = []
    in_front_matter = False
    front_matter_done = False
    h1_done = False
    i = 0

    while i < len(lines):
        line = lines[i]

        # front matter 边界
        if i == 0 and line.strip() == "---":
            in_front_matter = True
            out.append(line)
            i += 1
            continue
        if in_front_matter:
            if line.strip() == "---":
                in_front_matter = False
                front_matter_done = True
                out.append(line)
                i += 1
                continue
            stripped_line = line
            for field in FRONT_MATTER_FIELDS:
                if line.startswith(field):
                    value = line[len(field) :].strip()
                    # 去掉引号
                    unquoted = value
                    if (value.startswith('"') and value.endswith('"')) or (
                        value.startswith("'") and value.endswith("'")
                    ):
                        unquoted = value[1:-1]
                    new_val = strip_prefix(unquoted)
                    if new_val != unquoted:
                        changed = True
                        stripped_line = f"{field} {new_val}\n"
                    break
            out.append(stripped_line)
            i += 1
            continue

        # 首个文档级 H1
        if not h1_done and line.startswith("# ") and not line.startswith("## "):
            h1_done = True
            title = line[2:].rstrip("\n")
            new_title = strip_prefix(title)
            if new_title != title:
                changed = True
                out.append(f"# {new_title}\n")
            else:
                out.append(line)
            i += 1
            continue

        out.append(line)
        i += 1

    return "".join(out), changed


def iter_targets() -> list[tuple[str, str]]:
    """返回 (abs_path, rel_path) 列表。"""
    targets: list[tuple[str, str]] = []
    for root, _dirs, files in os.walk(LLMS_DIR):
        for name in files:
            if name == "_category_.yml" or name.endswith(".md"):
                abs_path = os.path.join(root, name)
                rel_path = os.path.relpath(abs_path, LLMS_DIR)
                if should_strip(rel_path):
                    targets.append((abs_path, rel_path))
    return sorted(targets, key=lambda x: x[1])


def main() -> int:
    parser = argparse.ArgumentParser(description="去除 llms 三级及以上标题序号")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--dry-run", action="store_true", help="仅预览，不写回")
    group.add_argument("--write", action="store_true", help="写回文件")
    args = parser.parse_args()

    changed_files: list[str] = []
    for abs_path, rel_path in iter_targets():
        with open(abs_path, encoding="utf-8") as f:
            content = f.read()
        if abs_path.endswith("_category_.yml"):
            new_content, changed = process_category(content)
        else:
            new_content, changed = process_markdown(content)
        if changed:
            changed_files.append(rel_path)
            if args.write:
                with open(abs_path, "w", encoding="utf-8") as f:
                    f.write(new_content)

    mode = "写回" if args.write else "预览"
    print(f"[{mode}] 共处理 {len(iter_targets())} 个候选文件，变更 {len(changed_files)} 个：")
    for rel in changed_files:
        print(f"  - {rel}")

    if args.dry_run and changed_files:
        print("\n使用 --write 写回变更。")

    return 0


if __name__ == "__main__":
    sys.exit(main())
