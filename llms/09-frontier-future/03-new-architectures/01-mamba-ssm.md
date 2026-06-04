# 9.3.1 Mamba 与状态空间模型

> Transformer 路线中的 SSM 简介见 [2.3.7 Mamba 与 SSM](../../02-transformer/03-transformer-improvements/07-mamba-ssm)。

## 要解决的问题

突破 Transformer $O(L^2)$ attention 瓶颈，用 **线性递推状态** 处理超长序列，同时尽量保持并行训练能力。

## 状态空间模型（SSM）

连续形式 $\dot{\mathbf{h}} = \mathbf{A}\mathbf{h} + \mathbf{B}\mathbf{x}$，离散化后：

$$
\mathbf{h}_t = \bar{\mathbf{A}}\mathbf{h}_{t-1} + \bar{\mathbf{B}}\mathbf{x}_t, \quad \mathbf{y}_t = \mathbf{C}\mathbf{h}_t
$$

推理每步 **$O(1)$** 更新固定维状态（相对 KV 线性增长）。

## Mamba（选择性 SSM）

- **输入相关** $\mathbf{B},\mathbf{C},\Delta$，使模型能 **选择性记住或忽略** 输入
- **并行扫描** 训练
- 论文：[Mamba: Linear-Time Sequence Modeling](https://arxiv.org/abs/2312.00752)

## 与 Transformer 的取舍

| | Transformer | Mamba |
| --- | --- | --- |
| 精确拷贝/检索 | 强 | 需验证 |
| 训练生态 | 极成熟 | 成长中 |
| 推理长序列 | KV 贵 | 状态固定 |

## 混合架构

[Jamba](../../09-frontier-future/03-new-architectures/03-hybrid-architectures)、Zamba 等 **Attention 层 + SSM 层** 交替，兼顾质量与吞吐。

## 参考

- [2.3.7](../../02-transformer/03-transformer-improvements/07-mamba-ssm)
- [2.3.6.5 线性注意力](../../02-transformer/03-transformer-improvements/06-sparse-attention/05-linear-attention)
