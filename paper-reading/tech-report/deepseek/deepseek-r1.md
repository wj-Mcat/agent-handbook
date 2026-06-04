---
sidebar_position: 3
slug: deepseek-r1
title: "DeepSeek-R1 Technical Report"
---

# DeepSeek-R1：GRPO 与推理能力激发

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | 深度求索（DeepSeek-AI） |
| 发布 | 2025 年 1 月（后发表于 Nature） |
| 基座 | DeepSeek-V3-Base 同规模 MoE |
| 官方报告 | [arXiv:2501.12948](https://arxiv.org/abs/2501.12948) |
| 代码 / 权重 | [GitHub](https://github.com/deepseek-ai/DeepSeek-R1)、[Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1) |

## 定位与问题

OpenAI o1 开启「推理时计算」范式后，R1 探索 **能否用纯强化学习**（少依赖人工 CoT 标注）在开源权重上复现长链推理、自验证等行为，并支持 **蒸馏到小模型**。

## 架构要点

- 基座架构与 **DeepSeek-V3** 一致（671B / 37B 激活，MLA + MoE）。
- 差异主要在 **后训练目标与采样行为**（长 CoT、反思、语言混杂等涌现现象）。

## 训练与数据

### DeepSeek-R1-Zero

- **跳过 SFT**，在可验证奖励（数学、代码判题等）上用 **GRPO** 训练。
- 涌现自我验证、反思、长思维链；但可读性与语言混杂存在问题。

### DeepSeek-R1

- **冷启动** 少量高质量 CoT 数据做 SFT，再交替 RL 与拒绝采样 SFT。
- **GRPO**：去掉 PPO Critic，用组内 reward 均值/方差作基线，降低显存。

### 蒸馏

- 将 R1 推理行为蒸馏到 **1.5B–70B 稠密模型**，小模型推理能力提升显著。

## 后训练与推理

- 面向数学、代码、逻辑推理任务；推理时需更长生成预算。
- 开源「推理模型」生态的重要参照（与 Qwen3 `/think`、GLM 混合推理等路线对照阅读）。

## 关键结论

- R1 在 AIME、Codeforces 等基准上接近 o1 水平（以报告发布时点为准）。
- 证明 **RL + 可验证奖励** 可激发推理，不必完全依赖人工长 CoT 数据集。

## 个人理解

R1 与 V3 的分工清晰：**V3 卖综合能力与成本，R1 卖 RL 方法论**。读 GRPO 时可对照 PPO/DPO 章节；读 Agent 应用时需注意延迟与 token 成本。

## 总结

DeepSeek-R1 = 开源推理模型的 **范式论文**：R1-Zero 探索极限，R1 工程化可读性，蒸馏打通「大思考 → 小部署」。

## 参考链接

- 技术报告：[https://arxiv.org/abs/2501.12948](https://arxiv.org/abs/2501.12948)
- 基座笔记：[DeepSeek-V3](./deepseek-v3)
- 后续：[DeepSeek-V4](./deepseek-v4)
- 概览对比：[开源 LLM 技术报告索引](../)
