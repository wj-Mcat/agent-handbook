# 线性注意力

> 总览见 [稀疏注意力总览](./01-overview)。状态空间 **替代架构** 见 [Mamba 与 SSM](../07-mamba-ssm)。

## 要解决的问题

标准 attention 的 $O(L^2)$ 来自显式构造 $\text{softmax}(QK^\top)V$。当 $L$ 极大（100K+）时，即便有 [Flash Attention](../05-flash-attention) 与 token 稀疏，仍希望 **推理步长与 $L$ 呈近线性**，并可用 **固定大小状态** 承载历史信息。

**线性注意力（Linear Attention）** 通过 **核函数技巧** 或 **递推形式**，避免物化 $L\times L$ 矩阵。

## 核函数技巧（Kernel Trick）

若存在特征映射 $\phi$ 使得：

$$
\text{sim}(q,k) \approx \phi(q)^\top \phi(k)
$$

则注意力可写为：

$$
\text{Attn}(Q,K,V) \approx \frac{\phi(Q)\big(\phi(K)^\top V\big)}{\phi(Q)\big(\phi(K)^\top \mathbf{1}\big)}
$$

**关键**：先算 $\phi(K)^\top V$（规模与 $L$ 线性相关），再与 $\phi(Q)$ 相乘，**无需 $L\times L$ 中间矩阵**。

### 与 softmax 的差异

标准 softmax 无法精确表示为有限维 $\phi$ 的核内积；线性注意力常用：

- **替代核**：如 $\phi(x)=\text{elu}(x)+1$ 等保证非负；
- **低秩近似**：Performers 的 **FAVOR+** 用随机特征近似 softmax 核。

:::warning 近似带来的质量权衡

线性核注意力在长程检索、精确拷贝等任务上可能弱于 softmax attention；需用下游任务与长序列基准验证，不宜默认「线性=无损加速」。

:::

## 递推形式（推理 $O(1)$ 每步）

定义状态（单头）：

$$
S_t = S_{t-1} + \phi(k_t)^\top v_t, \quad z_t = z_{t-1} + \phi(k_t)^\top
$$

则第 $t$ 步输出：

$$
o_t = \frac{\phi(q_t) S_t}{\phi(q_t) z_t}
$$

推理时 **只需缓存 $S_t, z_t$**，内存 **不随 $L$ 增长**（与 KV Cache 线性增长对比）。训练仍可对全长用并行化递推或 chunkwise 形式。

## 代表工作

| 工作 | 要点 | 备注 |
| --- | --- | --- |
| **Linear Transformer** | $\phi(x)=\text{elu}(x)+1$ | 早期 $O(L)$ 注意力探索 |
| **Performers** | FAVOR+ 随机特征近似 softmax | 理论连接标准 attention |
| **Lightning Attention** | 工业级线性/分块线性变体 | **MiniMax-01** 等超长上下文产品宣传点 |
| **RetNet / RWKV** | 保留递推与并行训练桥接 | 更偏新架构，见 [前沿架构](../../09-frontier-future/03-new-architectures/) |

## 复杂度对比

|  | 标准 Attention | 线性 Attention（递推推理） |
| --- | --- | --- |
| 训练（并行） | $O(L^2)$ | 常 $O(L)$ 或 chunk 线性 |
| 推理每步 | $O(L)$（读全 KV） | $O(1)$ 状态更新（固定状态维） |
| 长程精确拷贝 | 强 | 可能弱（依赖核） |

## 与其它高效手段的关系

| 组合 | 关系 |
| --- | --- |
| **Flash Attention** | Flash 优化稠密/块稀疏的 **IO**；线性 attention 改 **算法形式** |
| **滑动窗口 / DSA** | 仍可用 softmax，只是掩码稀疏；线性 attention 是另一条数学路径 |
| **Mamba / SSM** | 同为递推状态，SSM 用连续动力系统；见 [07-mamba-ssm](../07-mamba-ssm) |

## 工程落地

- **MiniMax-01** 等将「闪电注意力」与超长上下文绑定，需区分 **营销名称** 与 **具体是否纯线性核**（阅读对应技术报告为准）。
- 开源实现分散在 Performers、xFormers 实验分支等，**不如 FlashAttention 生态统一**。
- 若与稠密层 **混合**（hybrid model），需注意层间分布与训练稳定性。

## 局限

1. **近似误差** 在需要精确 attention 权重（如复制、少数 shot 检索）的任务上更明显。
2. **训练基础设施** 成熟度低于 Flash + 稠密 Transformer。
3. **与 KV 压缩正交**：线性递推解决「状态大小」；若仍用 softmax 层，可叠加 GQA/MLA。

## 参考链接

- Performers: [arXiv:2009.14794](https://arxiv.org/abs/2009.14794)
- Linear Transformers: [arXiv:2006.16236](https://arxiv.org/abs/2006.16236)
- 总览：[稀疏注意力总览](./01-overview)
- 替代架构：[Mamba 与 SSM](../07-mamba-ssm)
