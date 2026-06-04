# 8.1.3 DeepSeek-V3.1 / V3.2（DSA 稀疏注意力）

> **DSA 机制详解**：[2.3.6.4 DeepSeek 稀疏路线](../../02-transformer/03-transformer-improvements/06-sparse-attention/04-deepseek-sparse-route)  
> 技术报告：[DeepSeek-V3.2](https://arxiv.org/abs/2512.02556)（arXiv:2512.02556）  
> V4 领读：[paper-reading DeepSeek-V4](/paper-reading/tech-report/deepseek/deepseek-v4)

## 要解决的问题

在 **128K+ 上下文** 与 Agent 场景下，仅 MLA 压缩 KV 仍不足；需在 **保持远程关键信息可命中** 的前提下，将 attention **FLOPs 从 $O(L^2)$ 降为约 $O(Lk)$**。

## 核心改动：DSA

相对 V3.1-Terminus，V3.2 在 **continued training** 引入 **DeepSeek Sparse Attention（DSA）**：

1. **Lightning Indexer**：轻量 FP8 打分，内容相关重要性
2. **Top-$k$ token 选择**：仅子集做完整 attention（$k \ll L$，配置以官方为准）
3. **保留 MLA**：KV 仍压缩

## 与 NSA 的对比（简表）

| | DSA (V3.2) | NSA (论文) |
| --- | --- | --- |
| 场景 | 工业继续训练 | 可训练稀疏研究 |
| 结构 | Indexer + MLA | 压缩+选择+滑窗三分支 |

## 工程

- 非连续 KV 访存 → 定制 kernel（FlashMLA 等）
- 推理：vLLM / Transformers 需版本支持

## 后续：V4

V4 以 **CSA+HCA** 取代 MLA，面向 **1M** 上下文；见 [8.1 系列对比](/paper-reading/tech-report/deepseek/deepseek-v4) 与 [DeepSeek-V4 领读](/paper-reading/tech-report/deepseek/deepseek-v4)。

## 参考链接

- [arXiv:2512.02556](https://arxiv.org/abs/2512.02556)
- [DeepSeek-V3 领读](/paper-reading/tech-report/deepseek/deepseek-v3)
