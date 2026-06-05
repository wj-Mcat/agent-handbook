# Pre-LN vs Post-LN

## 要解决的问题

残差块中 **LayerNorm 放在子层之前还是之后**，影响训练稳定性与梯度传播。大模型时代 **Pre-LN** 成为默认。

## Post-LN（原始 Transformer）

$$
\mathbf{x}' = \text{LN}(\mathbf{x} + \text{Sublayer}(\mathbf{x}))
$$

- 残差支路末端才归一化
- 深层训练易出现 **梯度不稳定**，需 careful 学习率 warmup

## Pre-LN（主流 LLM）

$$
\mathbf{x}' = \mathbf{x} + \text{Sublayer}(\text{LN}(\mathbf{x}))
$$

- 梯度经残差 **高速公路** 更直接
- 更易训练 **上百层** 模型；GPT-3、Llama 等均采用

## RMSNorm 替代 LayerNorm

去掉均值中心化，仅缩放 RMS，计算更省；见 [2.3.2 归一化改进](../03-transformer-improvements/02-normalization-improvements)。

## DeepNorm 等变体

极深网络中的残差缩放策略，见 [2.3.2](../03-transformer-improvements/02-normalization-improvements)。

## 参考链接

- [2.1.6 残差与归一化](../01-transformer-principles/06-residual-normalization)
- [3.6.4 训练发散诊断](../../03-pre-training/06-training-stability/04-divergence-diagnosis)
