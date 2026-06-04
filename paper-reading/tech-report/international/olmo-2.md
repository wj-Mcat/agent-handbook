---
sidebar_position: 5
slug: olmo-2
title: "OLMo 2"
---

# OLMo 2：全链路开放语言模型

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | Allen Institute for AI（Ai2） |
| 发布 | 2024 年 11 月（OLMo 2） |
| 规格 | 7B、**32B** 等 |
| 官方资料 | [OLMo 官网](https://allenai.org/olmo)、[GitHub allenai/OLMo](https://github.com/allenai/OLMo) |
| 许可 | Apache 2.0 |

## 定位与问题

相对「只开源权重」，OLMo 系列强调 **数据、代码、训练日志、检查点** 全链路开放，服务可复现研究与对齐研究，而非仅榜单分数。

## 架构要点

- **稠密** Transformer，标准全注意力（对比 MLA/线性注意力路线）。
- 上下文常见 **4K–32K**（以具体 checkpoint 为准），偏研究复现而非极限长文。

## 训练与数据

- 使用开放 **Dolma** 等数据混合；OLMo 2 继续扩展数据与训练配方透明度。
- **Model Soup**：Mid 训练阶段多随机种子/checkpoint 平均，榨取高质量数据收益（与 Phi、Llama 3 末期策略类似）。

## 后训练与推理

- 提供 base 与 instruct；对齐流程与评估脚本开源。
- 适合作为 **「从零复现预训练」** 的教学素材。

## 关键结论

- 在同等规模下效果接近 Llama 2/3 同级开源模型，但 **开放度** 为首要卖点。
- 对 Agent Handbook 读者：若关心「如何训练」而非「如何用 API」，OLMo 优先级高于纯权重发布。

## 个人理解

OLMo 2 与 DeepSeek/Qwen **产品旗舰** 互补：前者教「训练科学」，后者教「推理效率与 MoE 工程」。做数据课程设计时可与 Dolma 文档交叉阅读。

## 总结

OLMo 2 = **最开放的开源 LLM 研究栈之一**：权重 + 数据 + 代码 + 日志，牺牲部分极限规模与长上下文噱头。

## 参考链接

- 官网：[https://allenai.org/olmo](https://allenai.org/olmo)
- 论文 / 技术报告：见 Ai2 发布页与 arXiv
- 概览对比：[开源 LLM 技术报告索引](../)
