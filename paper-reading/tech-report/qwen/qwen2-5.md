---
sidebar_position: 1
slug: qwen2-5
title: "Qwen2.5 Technical Report"
---

# Qwen2.5：全尺寸开源与多语言

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | 阿里巴巴通义团队 |
| 发布 | 2024 年 9 月 |
| 规格 | **0.5B–72B** 稠密 + **MoE**（如 57B-A14B） |
| 官方资料 | [Qwen2.5 博客](https://qwenlm.github.io/blog/qwen2.5/)、[Hugging Face Qwen](https://huggingface.co/Qwen) |
| 许可 | Apache 2.0 |

## 定位与问题

在 Qwen2 基础上全面升级 **知识、代码、数学、多语言**，以 **全尺寸矩阵**（含端侧 0.5B）覆盖研究与产业部署，巩固开源「全家桶」地位。

## 架构要点

- **稠密 + MoE**：小模型端侧部署，大模型 MoE 提效。
- **GQA**：分组查询注意力，平衡 KV 与效果。
- **上下文**：128K 及长上下文变体（Coder、Math 专长版另列）。

## 训练与数据

- 预训练约 **18T+ tokens** 量级（官方博客）。
- **29 种语言**与方言覆盖，代码与数学数据增强。
- 多阶段预训练与高质量数据末期上采样（与 Llama 3 等路线类似）。

## 后训练与推理

- SFT + DPO/RLHF 类对齐；提供 Instruct、Coder、Math 等专用版本。
- **工具调用**与 Agent 能力在 2.5 世代显著加强。

## 关键结论

- 在 MMLU、代码、数学等基准上相对 Qwen2 大幅提升，成为 2024 下半年默认开源基线之一。

## 个人理解

Qwen2.5 是 **「尺寸覆盖 + 专长模型」** 范本；读 Qwen3 时关注其如何从「多模型」走向「单模型双模式（think/no_think）」。

## 总结

Qwen2.5 = 通义 **2024 开源全家桶**：稠密/MoE、多语言、Coder/Math 支线，为 Qwen3 统一推理框架奠基。

## 参考链接

- 博客：[https://qwenlm.github.io/blog/qwen2.5/](https://qwenlm.github.io/blog/qwen2.5/)
- 后续：[Qwen3](./qwen3)
- 概览对比：[开源 LLM 技术报告索引](../)
