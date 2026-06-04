---
sidebar_position: 1
slug: minimax-01
title: "MiniMax-01 / Text-01"
---

# MiniMax-01：闪电注意力与超长上下文

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | MiniMax |
| 发布 | 2025 年 1 月 |
| 产品 | **MiniMax-Text-01**、**MiniMax-VL-01**（多模态另系） |
| 代码 / 权重 | [GitHub MiniMax-AI/MiniMax-01](https://github.com/MiniMax-AI/MiniMax-01)、[Hugging Face](https://huggingface.co/MiniMaxAI) |

## 定位与问题

在 MoE 成为行业默认前，MiniMax 已押注稀疏架构；01 系列强调 **线性/闪电注意力（Lightning Attention）** 降低长序列 KV 成本，并宣称 **百万级上下文** 能力，与同期 DeepSeek、GLM 长文路线竞争。

## 架构要点

- **Lightning Attention**：线性注意力变体，减少长上下文推理的 KV 显存与计算。
- **规模**：Text-01 为大规模参数（公开资料约 456B 级），面向通用与长文。
- **上下文**：宣称可达 **4M token** 量级（需结合官方评测与部署条件理解）。
- **VL-01**：视觉-语言分支，与本篇文本基座分开阅读。

## 训练与数据

- 长文档、书籍、代码等长序列数据占比提升。
- 预训练与对齐细节以 GitHub 技术报告 README 为主。

## 后训练与推理

- 标准 SFT 对齐 Chat 能力。
- 长文场景需关注 **实际可用上下文** 与推理框架支持。

## 关键结论

- 开源权重与长上下文叙事提升 MiniMax 在开源社区能见度。
- 为 **MiniMax-M1**（MoE + RL 扩展）铺垫工程经验。

## 个人理解

闪电注意力与 MLA、iRoPE 同属「**长上下文成本**」工具箱，实现与生态成熟度需以实际推理框架为准；读 M1 时对比 MoE 路由设计。

## 总结

MiniMax-01 = **长上下文 + 线性注意力** 的开源宣言；多模态见 VL-01，MoE 旗舰见 M1。

## 参考链接

- GitHub：[https://github.com/MiniMax-AI/MiniMax-01](https://github.com/MiniMax-AI/MiniMax-01)
- 后续：[MiniMax-M1](./minimax-m1)
- 概览对比：[开源 LLM 技术报告索引](../)
