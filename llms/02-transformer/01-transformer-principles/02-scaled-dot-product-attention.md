# 缩放点积注意力（Scaled Dot-Product Attention）

## 要解决的问题

序列中每个位置需要 **聚合其他位置的信息**。缩放点积注意力用 Query-Key 相似度做 **加权求和**，并行计算整个序列，成为 Transformer 核心。

## 公式

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

- $Q \in \mathbb{R}^{L \times d_k}$，$K,V \in \mathbb{R}^{L \times d_k}$（单头情形）
- **缩放因子** $\sqrt{d_k}$：防止 $d_k$ 大时点积方差过大，softmax 进入饱和区、梯度变小

## 因果掩码（Decoder）

对语言模型，位置 $i$ 只能 attend $j \le i$。掩码矩阵 $M_{ij}=0$ 若 $j\le i$，否则 $-\infty$，再加到 $QK^\top$ 上。

## Softmax 与数值稳定

实际实现常用 **online softmax**（分块累加 max 与 exp 和），[Flash Attention](../03-transformer-improvements/05-flash-attention) 即在分块上完成等价计算。

延伸阅读：[【手撕 online softmax】](https://zhuanlan.zhihu.com/p/5078640012)

## 与多头、变体的关系

- **多头**：多组 $(Q,K,V)$ 并行，见 [2.1.3](./03-multi-head-attention)
- **GQA/MLA**：共享或压缩 $K,V$，见 [2.3.4](../03-transformer-improvements/04-attention-variants)
- **稀疏掩码**：SWA、DSA 等，见 [2.3.6](../03-transformer-improvements/06-sparse-attention/01-overview)

## 复杂度

时间 $\approx O(L^2 d_k)$，空间（朴素）存 $L\times L$ 注意力矩阵。$L$ 增大是长上下文瓶颈根源。

## 参考链接

- [2.1.3 多头注意力](./03-multi-head-attention)
- [2.3.5 Flash Attention](../03-transformer-improvements/05-flash-attention)
