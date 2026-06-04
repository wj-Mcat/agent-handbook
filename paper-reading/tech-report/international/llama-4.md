---
sidebar_position: 2
slug: llama-4
title: "Llama 4"
---

# Llama 4：MoE、iRoPE 与原生多模态

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | Meta AI |
| 发布 | 2025 年 4 月 |
| 代表型号 | **Scout**（109B/17B）、**Maverick**（400B/17B）；Behemoth 教师未开源 |
| 官方资料 | [Meta 博客](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)、[Hugging Face meta-llama](https://huggingface.co/meta-llama) |
| 许可 | Llama 4 Community License |

## 定位与问题

Meta 首次在 Llama 主线采用 **MoE**，并强调 **原生多模态（Early Fusion）** 与 **超长上下文**（Scout 宣称 10M），对抗 Gemini、GPT-4o 等多模态闭源产品。

## 架构要点

- **Scout**：16 专家，17B 激活 / 109B 总参，**10M** 上下文叙事，单 H100 部署目标。
- **Maverick**：128 routed + 1 共享专家，17B 激活 / 400B 总参。
- **iRoPE**：交替局部 RoPE 层与 **NoPE** 全因果层，推理时 attention temperature tuning 增强长度泛化。
- **Early Fusion**：图文 token 早期融合，非外挂视觉塔。

## 训练与数据

- 大规模图文交错预训练；Behemoth（~2T）作教师蒸馏（未开源）。
- MoE 训练与多模态对齐细节见官方 model card。

## 后训练与推理

- SFT + 安全对齐；多模态 Instruct 版本。
- Scout 面向 **超长文档**；Maverick 面向 **高质量通用+视觉**。

## 关键结论

- 开源社区首个大规模 **「MoE + 原生多模态 + 超长上下文」** 组合之一。
- 许可与地域限制需仔细阅读 Llama 4 Community License。

## 个人理解

Llama 4 的 iRoPE 与 DeepSeek MLA、MiniMax 线性注意力同属 **长序列工程**；选 Scout 还是 Maverick 取决于任务是「极长文」还是「通用质量」。

## 总结

Llama 4 = Meta **架构换代**：MoE + 多模态 + iRoPE 长文；Behemoth 闭源教师略遗憾。

## 参考链接

- 博客：[https://ai.meta.com/blog/llama-4-multimodal-intelligence/](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- 前作：[Llama 3.1](./llama-3-1)
- 概览对比：[开源 LLM 技术报告索引](../)
