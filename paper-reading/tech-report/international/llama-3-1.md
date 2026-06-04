---
sidebar_position: 1
slug: llama-3-1
title: "Llama 3.1"
---

# Llama 3.1：405B 开源旗舰

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | Meta AI |
| 发布 | 2024 年 7 月 |
| 规格 | 8B / 70B / **405B** 稠密 |
| 官方资料 | [Meta 博客](https://ai.meta.com/blog/meta-llama-3-1/)、[Llama 模型](https://github.com/meta-llama/llama-models) |
| 许可 | Llama 社区许可 |

## 定位与问题

在 Llama 3 之后，Meta 以 **405B 稠密** 缩小与 GPT-4 等闭源模型的差距，并强化 **多语言、工具、128K 上下文**，巩固开源生态「默认基座」地位。

## 架构要点

- **稠密 Transformer**，GQA 降低 KV 成本。
- **128K** 上下文（相对 Llama 3 8K 大幅提升）。
- 无 MoE（MoE 留待 Llama 4）。

## 训练与数据

- 约 **15T+ tokens** 预训练，末期高质量数据上采样。
- 多语言与代码、推理数据增强。
- 后训练含 SFT 与 RLHF，提供 Instruct 与工具调用版本。

## 后训练与推理

- 强调 **开源可商用**（在许可范围内）与 Hugging Face / vLLM 生态。
- 405B 推理成本高，8B/70B 为产业主流部署尺寸。

## 关键结论

- 405B 成为 2024 下半年开源能力上限参照。
- 为 Llama 4 的 MoE 与多模态转型提供用户基础。

## 个人理解

Llama 3.1 代表 **「极致稠密」** 路线的收官；读 Llama 4 时对比其为何转向 MoE + 原生多模态。

## 总结

Llama 3.1 = Meta **稠密开源巅峰** + 128K + 工具生态；许可与合规需单独阅读 Llama License。

## 参考链接

- 博客：[https://ai.meta.com/blog/meta-llama-3-1/](https://ai.meta.com/blog/meta-llama-3-1/)
- 后续：[Llama 4](./llama-4)
- 概览对比：[开源 LLM 技术报告索引](../)
