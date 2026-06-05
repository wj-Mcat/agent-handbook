# 位置编码（正弦位置编码、可学习位置编码）

## 要解决的问题

Self-Attention 对 token **置换不变**（仅依赖两两关系），无法区分顺序。位置编码（Positional Encoding）向表示中注入 **位置信息**。

## 正弦位置编码（原始 Transformer）

$$
PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d}), \quad
PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d})
$$

- 不同维度不同波长，可外推一定长度
- 与词嵌入 **相加** 后进入第一层

## 可学习位置编码

为每个位置 $pos \in [0, L_{\max})$ 学习向量 $\mathbf{p}_{pos}$。灵活但 **超过 $L_{\max}$ 需外推或插值**。

## 现代主流：RoPE（相对位置）

不在输入相加，而在 **Q、K 上旋转**，编码相对距离；长上下文外推见 [2.3.1 位置编码改进](../03-transformer-improvements/01-positional-encoding-improvements)（RoPE、ALiBi、YaRN）。

| 方案 | 类型 | LLM 采用度 |
| --- | --- | --- |
| 正弦 | 绝对 | 早期 Transformer |
| 可学习绝对 | 绝对 | BERT 等 |
| **RoPE** | 相对 | Llama、Qwen、DeepSeek |
| **ALiBi** | 线性偏置 | 部分长上下文模型 |

## 与嵌入的关系

$$
\mathbf{x}_t = \mathbf{E}_{token(t)} + \mathbf{PE}_t \quad \text{（绝对方案）}
$$

Decoder-only LM 通常 **因果 mask + RoPE** 组合。

## 参考链接

- [2.3.1 RoPE / ALiBi / NoPE](../03-transformer-improvements/01-positional-encoding-improvements)
- [3.2 分词](../../03-pre-training/02-tokenization/)（token 与位置一一对应）
