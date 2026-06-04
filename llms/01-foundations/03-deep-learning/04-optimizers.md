# 1.3.4 优化器（SGD、Adam、AdamW、Lion、Sophia）

## 要解决的问题

得到 loss 对参数的梯度 $\mathbf{g}$ 后，如何更新 $\boldsymbol{\theta}$ 以减小 loss？优化器定义 **更新规则**；LLM 预训练几乎离不开 **AdamW** 及其变体，大模型前沿亦出现 **Muon** 等。

## SGD 与带动量 SGD

$$
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \,\mathbf{g}_t
$$

动量累积历史梯度方向，加速收敛、抑制震荡。大批次 LLM 训练中纯 SGD 较少单独使用。

## Adam / AdamW

**Adam**：为一阶、二阶矩估计自适应学习率：

$$
\mathbf{m}_t = \beta_1 \mathbf{m}_{t-1} + (1-\beta_1)\mathbf{g}, \quad
\mathbf{v}_t = \beta_2 \mathbf{v}_{t-1} + (1-\beta_2)\mathbf{g}^2
$$

**AdamW**：将 **权重衰减** 与梯度更新解耦（decoupled weight decay），成为 GPT、Llama 等默认选择。

| 优化器 | LLM 中的角色 |
| --- | --- |
| **AdamW** | 预训练、SFT、多数 RLHF 的主流 |
| **Lion** | 内存更省的二阶矩简化变体，部分实验场景 |
| **Sophia** | 曲率感知，研究向 |
| **Muon** | DeepSeek V4 等万亿级训练报道采用（含 QK-Clip 等稳定技巧） |

## 学习率调度

Warmup + Cosine / WSD 等与优化器正交，见 [1.3.6 学习率调度](./06-lr-scheduling)。

## 工程要点

- **$\beta_1,\beta_2,\epsilon$**：常用 $(0.9, 0.95, 10^{-8})$ 量级，以 recipe 为准。
- **全局梯度范数裁剪**：防止单步更新过大。
- **混合精度**：FP16/BF16/FP8 下 master weight 常为 FP32。

## 参考链接

- [1.3.6 学习率调度](./06-lr-scheduling)
- [3.6.1 混合精度训练](../../03-pre-training/06-training-stability/01-mixed-precision)
- DeepSeek V4 训练：[技术报告领读](/paper-reading/tech-report/deepseek/deepseek-v4)
