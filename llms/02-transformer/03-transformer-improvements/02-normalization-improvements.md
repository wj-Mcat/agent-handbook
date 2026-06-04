# 2.3.2 归一化改进：RMSNorm、DeepNorm

## 要解决的问题

深层 Transformer 训练需 **稳定激活尺度**。LayerNorm 有效但略重；**RMSNorm** 在 LLM 中更常见；**DeepNorm** 针对极深网络的残差缩放。

## RMSNorm

$$
\bar{\mathbf{x}} = \frac{\mathbf{x}}{\text{RMS}(\mathbf{x})}, \quad \text{RMS}(\mathbf{x}) = \sqrt{\frac{1}{d}\sum_i x_i^2 + \epsilon}
$$

再乘可学习增益 $\mathbf{g}$。相比 LayerNorm **不做减均值**，少一次统计量，吞吐略优。

**采用**：Llama、Qwen、DeepSeek 等主流开源栈。

## LayerNorm vs RMSNorm

| | LayerNorm | RMSNorm |
| --- | --- | --- |
| 中心化 | 是 | 否 |
| 计算 | 略高 | 略低 |
| 大模型实践 | 早期 GPT-2/3 | 当前主流 |

## DeepNorm

通过 **放大残差分支系数**（随层数调整），缓解 Post-LN 深层梯度问题；多用于 **Post-LN 架构的加深实验**，与 Pre-LN+RMSNorm 路线并行存在。

## 与 Pre-LN 的配合

现代 recipe：**Pre-LN + RMSNorm + SwiGLU FFN**，见 [2.2.4 Pre-LN](../02-transformer-details/04-pre-ln-post-ln)、[2.3.3 激活](./03-activation-improvements)。

## 参考链接

- [2.1.6 残差与归一化](../01-transformer-principles/06-residual-normalization)
- [1.3.5 正则化中的 LayerNorm](../../01-foundations/03-deep-learning/05-regularization)
