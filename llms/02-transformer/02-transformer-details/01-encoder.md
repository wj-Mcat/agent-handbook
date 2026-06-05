# 编码器结构

## 要解决的问题

Encoder 将 **源序列** 编码为上下文相关的表示，供 Decoder 在 cross-attention 中查询。在 Encoder-Decoder 模型（机器翻译、摘要）中承担「理解输入」角色。

## 单层 Encoder Block

1. **多头 Self-Attention**（无因果掩码，双向）
2. 残差 + LayerNorm
3. **FFN**（常 $d_{ff}=4d$）
4. 残差 + LayerNorm

$$
\mathbf{H} = \text{Encoder}(\mathbf{X}) \in \mathbb{R}^{L \times d}
$$

## 与 Decoder 的区别

| | Encoder | Decoder |
| --- | --- | --- |
| Self-Attention | 双向 | 因果（masked） |
| Cross-Attention | 无 | 对 Encoder 输出 |
| 典型用途 | 理解输入 | 自回归生成 |

## Encoder-only 模型

**BERT** 等仅用 Encoder + MLM，擅长分类与理解，不原生做自回归生成。现代 **LLM 主线为 Decoder-only**（见 [2.2.3 三大范式](./03-architecture-paradigms)）。

## 工程要点

- 双向 attention 的 KV 在推理时通常 **整段一次前向**（非逐 token 生成）
- 长序列成本仍 $O(L^2)$，可用稀疏或 Flash 加速

## 参考链接

- [2.1.1 架构概览](../01-transformer-principles/01-architecture-overview)
- [2.2.2 解码器](./02-decoder-causal-mask)
- [3.3.2 MLM](../../03-pre-training/03-pretraining-objectives/02-masked-lm)
