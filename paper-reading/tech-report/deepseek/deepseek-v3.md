---
sidebar_position: 2
slug: deepseek-v3
title: "DeepSeek-V3 Technical Report"
---

# DeepSeek-V3：671B MoE 与 FP8 预训练

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | 深度求索（DeepSeek-AI） |
| 发布 | 2024 年 12 月 |
| 旗舰规格 | **671B** 总参数，每 token 激活约 **37B** |
| 官方报告 | [arXiv:2412.19437](https://arxiv.org/abs/2412.19437) |
| 代码 / 权重 | [GitHub](https://github.com/deepseek-ai/DeepSeek-V3)、[Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V3) |

## 定位与问题

在 V2 的 MLA + MoE 基础上，V3 目标是在 **极低训练成本** 下达到当时顶尖闭源模型的综合能力，并维持开源权重可复现，引发「训练效率」讨论。

## 架构要点

- **DeepSeekMoE**：256 个 routed 专家 + 共享专家，细粒度切分。
- **MLA**：延续 V2，优化长上下文推理显存。
- **无辅助损失负载均衡**：用动态 bias 调节专家负载，避免传统 aux loss 损伤效果。
- **MTP（Multi-Token Prediction）**：训练时预测多个后续 token，提高训练信号密度，可用于投机解码加速。
- **上下文**：128K。

## 训练与数据

- 预训练约 **14.8T tokens**。
- **FP8 混合精度** 训练，配合精细 scaling 与硬件映射，降低万亿 token 训练算力。
- 多语言、数学、代码、推理类数据配比优化。

## 后训练与推理

- 经 SFT 与 RLHF 类对齐得到 Instruct 版本。
- MTP 与 MLA 使 **推理吞吐与 KV 成本** 相对同规模稠密模型更优。

## 关键结论

- 报告与社区评测显示：开源权重在数学、代码、多语言等维度接近 GPT-4o / Claude 3.5 梯队（以发布时点为准）。
- 训练稳定性（无灾难性 loss spike）与 **$/token** 成本成为行业关注焦点。

## 个人理解

V3 把「**架构即效率**」推到主流：后续模型（Kimi K2 等）借鉴 MLA 与超稀疏 MoE 并不意外。读 R1 前建议先理解 V3 基座与 MTP/均衡策略。

## 总结

DeepSeek-V3 = V2 架构思想的 **规模化兑现**：更大 MoE、更长预训练、FP8 与 MTP，构成 2025 开源旗舰的参照系。

## 参考链接

- 技术报告：[https://arxiv.org/abs/2412.19437](https://arxiv.org/abs/2412.19437)
- 后续：[DeepSeek-V4](./deepseek-v4)
- 概览对比：[开源 LLM 技术报告索引](../)
