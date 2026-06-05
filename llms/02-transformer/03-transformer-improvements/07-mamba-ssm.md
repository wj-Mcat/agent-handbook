# Mamba 与状态空间模型（SSM）作为替代方案

> 深入展开见 [9.3.1 Mamba 与状态空间模型](../../09-frontier-future/03-new-architectures/01-mamba-ssm)；[2.3.6.5 线性注意力](./06-sparse-attention/05-linear-attention) 讨论核近似路线。

## 要解决的问题

Transformer 的 $O(L^2)$ attention 限制超长序列与推理效率。**状态空间模型（SSM）** 用线性动力系统递推隐藏状态，实现 **$O(L)$ 推理步长**（固定状态维）。

## 核心思想

连续系统离散化：

$$
\mathbf{h}_t = \mathbf{A}\mathbf{h}_{t-1} + \mathbf{B}\mathbf{x}_t, \quad \mathbf{y}_t = \mathbf{C}\mathbf{h}_t
$$

**Mamba** 引入 **输入相关** 的 $\mathbf{B},\mathbf{C},\Delta$（选择性 SSM），克服传统 SSM 对输入不敏感的问题。

## 与 Transformer 对比

| | Transformer | Mamba / SSM |
| --- | --- | --- |
| 交互 | 全局 pairwise attention | 递推状态压缩历史 |
| 训练并行 | 天然并行 | 并行扫描算法 |
| 长程拷贝 | 强 | 依赖选择性机制 |
| 生态 | 极成熟 | 成长中（Jamba 等混合） |

## 混合架构

**Jamba、Zamba** 等交替 **Mamba 层与 Attention 层**，兼顾吞吐与精确检索。见 [9.3.3 混合架构](../../09-frontier-future/03-new-architectures/03-hybrid-architectures)。

## 参考链接

- Mamba：[arXiv:2312.00752](https://arxiv.org/abs/2312.00752)
- [9.3.1 前沿 Mamba 章节](../../09-frontier-future/03-new-architectures/01-mamba-ssm)
