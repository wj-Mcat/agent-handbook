---
sidebar_position: 1
slug: deepseek-v2
title: "DeepSeek-V2 Technical Report"
---

# DeepSeek-V2：MLA 与 DeepSeekMoE

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | 深度求索（DeepSeek-AI） |
| 发布 | 2024 年 5 月 |
| 旗舰规格 | 236B 总参数，每 token 激活约 21B（MoE） |
| 官方报告 | [arXiv:2405.04434](https://arxiv.org/abs/2405.04434) |
| 代码 / 权重 | [GitHub](https://github.com/deepseek-ai/DeepSeek-V2)、[Hugging Face](https://huggingface.co/deepseek-ai) |

## 定位与问题

DeepSeek-V2 在开源社区首次系统性地把 **推理成本** 作为与效果同等重要的优化目标：在相近激活参数量下，通过 **MLA（Multi-head Latent Attention）** 压缩 KV Cache，通过 **DeepSeekMoE** 提升专家利用率，使长上下文与 MoE 训练/推理更可落地。

## 架构要点

- **MoE**：细粒度专家切分 + **共享专家**，缓解路由不均与知识冗余。
- **MLA**：将 K/V 压缩到低维 latent 再展开，显著降低 KV 显存（报告宣称可达数倍），并用解耦 RoPE 保留位置信息。
- **上下文**：支持 **128K** 上下文窗口。
- **对比前代**：相对 DeepSeek-V1 / 早期 67B 稠密模型，V2 在相同算力预算下追求更高吞吐。

## 训练与数据

- 预训练约 **8.1T tokens**，覆盖多语言、数学、代码等。
- 采用 MoE 专用负载均衡与路由策略（为 V3「无辅助损失均衡」奠基）。
- 训练稳定性与通信优化针对大规模 EP（专家并行）场景。

## 后训练与推理

- Chat 版本经 SFT 与偏好对齐，面向通用对话与代码场景。
- 推理侧收益主要来自 **更小的 KV** 与 **更少的激活参数**。

## 关键结论

- 在多项公开基准上，236B-A21B 可与当时同量级开源/部分闭源模型竞争。
- **MLA + DeepSeekMoE** 成为后续 V3/R1 的架构底座，影响 Kimi K2 等后续开源路线。

## 个人理解

V2 的价值不仅是分数，而是证明「开源模型可以把 **注意力与 MoE 的工程创新** 做到可复现」；读 V3 时应把 V2 当作 MLA/MoE 方法论的第一站。

## 总结

DeepSeek-V2 = **成本感知架构** 的里程碑：MLA 降 KV，DeepSeekMoE 提容量，为 V3 万亿 token 级 FP8 训练与 R1 推理模型铺路。

## 参考链接

- 技术报告：[https://arxiv.org/abs/2405.04434](https://arxiv.org/abs/2405.04434)
- 概览对比：[开源 LLM 技术报告索引](../)
