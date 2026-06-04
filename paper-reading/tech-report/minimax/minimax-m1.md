---
sidebar_position: 2
slug: minimax-m1
title: "MiniMax-M1"
---

# MiniMax-M1：开源 MoE 与 RL 扩展

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | MiniMax |
| 发布 | 2025 年 6 月 |
| 定位 | 开源 MoE 基座 + 强化学习扩展推理 |
| 代码 / 权重 | [GitHub MiniMax-AI/MiniMax-M1](https://github.com/MiniMax-AI/MiniMax-M1)、[Hugging Face](https://huggingface.co/MiniMaxAI) |

## 定位与问题

在 01 系列长上下文经验后，M1 将 **MoE 架构** 与 **RL 后训练** 结合并完全开源，对标 DeepSeek-R1 / Qwen3 等「推理增强」路线，同时保持 **1M 上下文** 量级叙事。

## 架构要点

- **MoE**：稀疏激活，降低推理 FLOPs。
- **上下文**：面向 **1M token** 长文与 Agent 场景（依赖推理栈支持）。
- 与 Text-01 的线性注意力路线形成 **产品矩阵互补**。

## 训练与数据

- 预训练 + SFT 基础上，引入 **RL 扩展** 提升推理与复杂任务。
- Agentic 数据与长链任务对齐（细节见官方 README / 发布页）。

## 后训练与推理

- RL 阶段强化数学、代码、多步推理等可验证或偏好奖励任务。
- 开源权重便于研究 RL 与 MoE 的组合。

## 关键结论

- 国内开源「MoE + 长上下文 + RL」的重要一员，与 DeepSeek、Qwen 形成对照实验素材。

## 个人理解

M1 适合与 **DeepSeek-R1、Qwen3** 三角对比：三者都押推理，但数据配方、MoE 粒度、上下文工程不同；部署前建议核对 HF 卡片与许可。

## 总结

MiniMax-M1 = **01 长文经验 + MoE + RL** 的开源旗舰；后续 M2 待补单篇领读。

## 参考链接

- GitHub：[https://github.com/MiniMax-AI/MiniMax-M1](https://github.com/MiniMax-AI/MiniMax-M1)
- 前作：[MiniMax-01](./minimax-01)
- 概览对比：[开源 LLM 技术报告索引](../)
