# 8.4.2 Kimi K2（MuonClip + 超稀疏 MoE + Agent）

> 完整论文：[Kimi K2: Open Agentic Intelligence](https://arxiv.org/abs/2507.20534)（arXiv:2507.20534，2025）

## 要解决的问题

在 **万亿参数 MoE** 规模下，如何用 **token 高效的 Muon 优化器** 稳定预训练，并产出面向 **Agent / 软件工程** 的开源旗舰模型？

## 架构要点

| 项目 | 规格 |
| --- | --- |
| 总参数 | **1T**（MoE） |
| 激活参数 | **32B** / token |
| 专家 | 384 routed + 1 shared，每 token 选 8 |
| 上下文 | **128K** |
| 注意力 | **MLA**（与 DeepSeek 路线相近） |
| 激活 | SwiGLU |

## MuonClip 优化器

- 基于 **Muon**（相对 AdamW 更高 token 效率）
- **QK-Clip**：更新后缩放 Q/K 投影权重，约束 attention logit 爆炸
- K2 在 **15.5T tokens** 预训练上报告 **零 loss spike**

详见 [3.6 训练稳定性](../../03-pre-training/06-training-stability/) 与 DeepSeek V4 的 Muon 采用。

## 后训练

- 大规模 **Agentic 数据合成**
- **联合 RL** 阶段：与真实/合成环境交互
- 定位：**开源非 thinking 设置** 下 Agent、代码、数学、推理 SOTA 梯队之一

## 代表基准（论文摘要量级）

| 基准 | 分数（非 extended thinking） |
| --- | --- |
| SWE-Bench Verified | 65.8 |
| Tau2-Bench | 66.1 |
| GPQA-Diamond | 75.1 |
| LiveCodeBench v6 | 53.7 |

## 与相邻模型

| 对比 | Kimi K2 | DeepSeek-V3 |
| --- | --- | --- |
| 优化器亮点 | MuonClip | FP8 + MTP |
| Agent | 核心卖点 | V3.2+ DSA 长文 |
| 开源权重 | 发布 base/instruct | 开源 |

## 参考链接

- 论文：[arXiv:2507.20534](https://arxiv.org/abs/2507.20534)
- GitHub：[MoonshotAI/Kimi-K2](https://github.com/MoonshotAI/Kimi-K2)
- [8.4.1 Kimi K1.5](./01-kimi-k1-5)
- [技术报告索引](/paper-reading/tech-report/)
