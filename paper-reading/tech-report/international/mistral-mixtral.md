---
sidebar_position: 3
slug: mistral-mixtral
title: "Mistral 7B / Mixtral"
---

# Mistral 7B 与 Mixtral：欧洲开源 MoE 先驱

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | Mistral AI |
| 代表发布 | Mistral 7B（2023.09）、**Mixtral 8×7B / 8×22B**（2023.12–2024） |
| 官方资料 | [Mistral 文档](https://docs.mistral.ai/)、[Hugging Face mistralai](https://huggingface.co/mistralai) |
| 许可 | Apache 2.0（多数权重） |

## 定位与问题

以 **7B 小而强** 打开局面，再以 **Mixtral MoE** 在激活参数量级下逼近更大稠密模型，影响后续全球 MoE 设计（专家数、路由、无共享专家等讨论）。

## 架构要点

### Mistral 7B

- **稠密** 7B，GQA + **Sliding Window Attention** 扩展有效上下文。
- 在 2023 年以小算力达到 Llama 2 13B 级效果。

### Mixtral 8×7B / 8×22B

- **MoE**：8 个专家，每 token 激活 2 个（8×7B ≈ 13B 激活；8×22B 更大）。
- 稀疏激活降低推理 FLOPs，成为开源 MoE 早期标杆。

## 训练与数据

- 多语言预训练；Mixtral 强化代码与推理。
- 后续 Mistral Large 2 等闭源/API 产品与开源线并行（本笔记聚焦开源 Mixtral 系）。

## 后训练与推理

- Instruct 版本经 SFT；适合 vLLM、TGI 等部署。
- 32K–128K 上下文随版本迭代（以 model card 为准）。

## 关键结论

- Mixtral 证明 **「小激活、大总参」** 在产业界可落地，催生 2024–2025 MoE 军备竞赛。

## 个人理解

读 DeepSeek-V2/V3、Qwen3 MoE 时，宜回头对照 Mixtral 的 **专家数少、路由简单** 基线，理解「细粒度专家 + 共享专家」等后续改动动机。

## 总结

Mistral = **7B 效率传奇 + Mixtral MoE 启蒙**；欧洲开源对全球架构影响深远。

## 参考链接

- 文档：[https://docs.mistral.ai/](https://docs.mistral.ai/)
- Mixtral 论文 / 卡片：见 Hugging Face 模型页
- 概览对比：[开源 LLM 技术报告索引](../)
