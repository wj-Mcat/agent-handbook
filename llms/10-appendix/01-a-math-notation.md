# 附录 A　数学符号与公式速查

本附录汇总 LLM 大纲各章常用 **符号、损失与复杂度**，便于跨章节对照。详细推导见对应正文。

## 通用符号

| 符号 | 含义 |
| --- | --- |
| $L$ | 序列长度（token 数） |
| $B$ | batch size |
| $d, d_\text{model}$ | 隐藏维度 |
| $H$ | 注意力头数 |
| $d_h$ | 每头维度，常 $d_h = d/H$ |
| $N, N_l$ | Transformer 层数 |
| $V$ | 词表大小 |
| $\theta$ | 模型参数 |

## 语言建模

**下一 token 负对数似然（因果 LM）：**

$$
\mathcal{L}_\text{LM} = -\sum_{t=1}^{L} \log p_\theta(x_t \mid x_{<t})
$$

**交叉熵与 perplexity：**

$$
\text{PPL} = \exp\left(-\frac{1}{L}\sum_t \log p(x_t \mid x_{<t})\right)
$$

## 注意力

**Scaled dot-product：**

$$
\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_h}}\right) V
$$

**多头：**

$$
\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V),\quad \text{MHA} = \text{Concat}(\text{head}_1,\ldots) W^O
$$

**复杂度（稠密）：** 每层约 $O(L^2 d)$ FLOPs，KV 存储 $O(L d)$ per layer。

## 位置编码（RoPE 直觉）

对二维子空间应用旋转矩阵 $R_{\theta,m}$，$\theta$ 与维度、位置 $m$ 相关；外推时调整 base 或插值（见 [9.1.2](../09-frontier-future/01-long-context/02-context-extension)）。

## 归一化

**LayerNorm：**

$$
\text{LN}(x) = \gamma \odot \frac{x - \mu}{\sigma + \epsilon} + \beta
$$

**RMSNorm：** 省略均值项，只 RMS 缩放。

## 优化

**AdamW 更新：**

$$
\theta_{t+1} = \theta_t - \eta \left( \frac{\hat{m}}{\sqrt{\hat{v}}+\epsilon} + \lambda \theta_t \right)
$$

**梯度裁剪：** 若 $\|g\|_2 > \tau$，则 $g \leftarrow g \cdot \tau / \|g\|_2$。

## 对齐损失

**DPO（示意）：**

$$
\mathcal{L}_\text{DPO} = -\mathbb{E}\left[\log \sigma\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_\text{ref}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_\text{ref}(y_l|x)}\right)\right]
$$

**RLHF 奖励目标：** $\max_\theta \mathbb{E}[r(x,y) - \beta \text{KL}(\pi_\theta \| \pi_\text{ref})]$。

## MoE

**路由：** top-$k$ 专家选择，负载均衡 aux loss 或动态 bias（DeepSeek 无 aux）。

**激活参数量：** 每 token 仅计 $k$ 个专家 FFN + 共享部分。

## 推理与 KV

**KV cache 体积（每层、每序列，量级）：**

$$
\text{Mem}_\text{KV} \approx 2 \times L \times H \times d_h \times \text{bytes}
$$

（MLA 等压缩结构见 [5.2.1](../05-inference-deployment/02-kv-cache-attention-optimization/01-kv-cache)。）

## Scaling（Chinchilla 直觉）

最优 token 数 $D$ 与参数量 $N$ 近似 $D \propto N^{0.74}$（以 Hoffmann 等为准，具体指数随设定略变）。

## 相关章节

- 注意力：[2.1.2](../02-transformer/01-transformer-principles/02-scaled-dot-product-attention)
- 优化器：[3.3.4](../01-foundations/03-deep-learning/04-optimizers)
- DPO：[4.4.1](../04-post-training-alignment/04-preference-optimization/01-dpo)
- 术语表：[附录 B](./02-b-glossary)
