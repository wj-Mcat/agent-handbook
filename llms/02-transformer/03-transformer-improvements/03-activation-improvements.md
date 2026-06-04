# 2.3.3 激活函数改进：SwiGLU、GeGLU

## 要解决的问题

FFN 中间层需非线性。ReLU 简单但表达力有限；**门控线性单元（GLU）** 用 sigmoid 门控一路；**SwiGLU / GeGLU** 成为大模型 FFN 默认。

## 标准 FFN（原始）

$$
\text{FFN}(\mathbf{x}) = W_2 \,\sigma(W_1 \mathbf{x} + b_1) + b_2
$$

常 $\sigma=\text{ReLU}$，$d_{ff}=4d$。

## SwiGLU（Llama 等）

$$
\text{SwiGLU}(\mathbf{x}) = (W_1 \mathbf{x}) \odot \text{Swish}(W_2 \mathbf{x}), \quad \text{Swish}(t)=t\cdot\sigma(t)
$$

- 再经 $W_3$ 投影回 $d$
- 参数量略增（三路矩阵），实践中常调 $d_{ff}$ 保持总参不变

## GeGLU

将 Swish 换为 **GELU** 门控：$(W_1\mathbf{x}) \odot \text{GELU}(W_2\mathbf{x})$。PaLM 等采用。

## 选型

| 激活 | 特点 |
| --- | --- |
| ReLU | 简单，早期 Transformer |
| GELU | 平滑，BERT/GPT-2 |
| **SwiGLU** | 当前开源 LLM 最常见 |
| GeGLU | 闭源/部分 Google 路线 |

## 参考链接

- [2.1.5 前馈网络](../01-transformer-principles/05-feed-forward-network)
- [1.3.3 激活函数基础](../../01-foundations/03-deep-learning/03-activation-functions)
