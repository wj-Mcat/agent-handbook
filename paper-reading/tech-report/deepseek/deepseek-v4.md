---
sidebar_position: 4
slug: deepseek-v4
title: "DeepSeek-V4 Technical Report"
---

# DeepSeek-V4：百万 Token 上下文与 Agent 效率

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | 深度求索（DeepSeek-AI） |
| 发布 | 2026 年 4 月（预览版） |
| 系列型号 | **V4-Pro**（1.6T / 49B 激活）、**V4-Flash**（284B / 13B 激活） |
| 官方报告 | [DeepSeek_V4.pdf](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf) |
| 发布说明 | [api-docs.deepseek.com](https://api-docs.deepseek.com/news/news260424) |
| 权重 | [HF 合集](https://huggingface.co/collections/deepseek-ai/deepseek-v4)、[V4-Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)、[V4-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash) |

报告标题：**DeepSeek-V4: Towards Highly Efficient Million-Token Context Intelligence**。

## 定位与问题

V3/R1 将 MLA + MoE 与推理 RL 推到开源前列后，V4 的核心矛盾变为：**Agent 与长程任务需要百万级上下文，但 FLOPs 与 KV Cache 随序列长度线性恶化**。V4 不再单纯追求榜单 SOTA，而是让 **1M token 上下文在同等硬件上可负担**，成为开源 Agent 基座候选。

## 架构要点

### 双规格 MoE

| 型号 | 总参数 | 激活参数 | 上下文 |
| --- | --- | --- | --- |
| **V4-Pro** | 1.6T | 49B | **1M** |
| **V4-Flash** | 284B | 13B | **1M** |

提供 Base 与 Instruct 共四个 checkpoint（Pro/Flash × Base/Instruct）。

### 混合注意力：CSA + HCA（取代 MLA）

- **CSA（Compressed Sparse Attention）**：压缩稀疏注意力，面向长程依赖。
- **HCA（Heavily Compressed Attention）**：重度压缩注意力；V4-Pro 前几层用 HCA bootstrap，中间层 **CSA/HCA 交替**，末端 MTP 块为滑动窗口。
- 相对 V3.2 在 **1M 上下文**下：V4-Pro 单 token 推理 FLOPs 约 **27%**、KV Cache 约 **10%**；V4-Flash 约 **10% / 7%**。

### Manifold-Constrained Hyper-Connections（mHC）

- 用 **mHC** 替代标准残差连接，经 Sinkhorn-Knopp 归一化稳定深层信号传播（`hc_mult` 并行残差流）。

### Hash-MoE Bootstrap

- 前几层 MoE 采用 **Hash-MoE**：按 `token_id → expert_id` 静态映射路由，再过渡到常规 top-k MoE，降低早期训练不稳定。

### 其它工程

- **Grouped output projection**：将超大 head 维度分组投影，降低注意力输出层每 token 成本。
- Instruct 版：**MoE 专家 FP4 + 其余 FP8** 混合精度（Base 版主要为 FP8）。

## 训练与数据

- 预训练约 **32–33T tokens**（报告区间）。
- 大规模采用 **Muon** 优化器（含 QK-Clip 等稳定技巧），支撑 1.6T 级训练。
- **FP4 量化感知训练（QAT）**、确定性内核等面向量产推理的优化。
- **On-policy 蒸馏** 等后训练数据配方（报告工程章节）。

## 后训练与推理

Instruct 模型提供三种推理模式：

| 模式 | 说明 |
| --- | --- |
| **Non-think** | 快速直答，无显式 CoT |
| **Think High** | 专用推理块（redacted_reasoning）内显式 CoT |
| **Think Max** | 最大推理投入；建议上下文 **≥384K** |

推荐采样：`temperature=1.0, top_p=1.0`（官方 README）。

## 关键结论

- **效率曲线**是报告主轴：在 1M token 场景下相对 V3.2 的数量级降本，使长上下文 Agent **可部署**而非仅可演示。
- 能力上 V4-Pro-Max 等变体在知识、推理、Agent 基准上处于 **开源前排**；报告亦坦诚与顶尖闭源仍有数月差距（以发布时点为准）。
- 架构上 **MLA → CSA/HCA 混合** 标志 DeepSeek 长上下文路线的第二次换代。

## 个人理解

读 V4 宜与 **Llama 4 Scout（10M 宣称）**、**GLM-5 / Kimi 百万上下文** 对照：大家争的是「Agent 可读完整仓库/日志」，V4 用可量化的 FLOPs/KV 比例证明设计目标。若做 Agent，应优先在 **真实 128K–1M 工作负载** 下测延迟与显存，而非只看短上下文榜单。

## 总结

DeepSeek-V4 = **百万上下文 + 极致 token 经济学**：Pro/Flash 双档 MoE、CSA/HCA、mHC、Muon；从「更强模型」转向「更长上下文更便宜」。

## 参考链接

- 技术报告 PDF：[DeepSeek_V4.pdf](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf)
- 发布说明：[news260424](https://api-docs.deepseek.com/news/news260424)
- HF 博客解读：[DeepSeek-V4 on Hugging Face](https://huggingface.co/blog/deepseekv4)
- 前作：[DeepSeek-V3](./deepseek-v3)、[DeepSeek-R1](./deepseek-r1)
- 概览对比：[开源 LLM 技术报告索引](../)
