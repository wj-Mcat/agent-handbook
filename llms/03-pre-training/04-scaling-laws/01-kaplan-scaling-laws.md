# 3.4.1 Kaplan Scaling Laws

## 要解决的问题

训练大模型前需要回答：**加参数、加数据还是加算力**更划算？Kaplan 等（OpenAI, 2020）用系统实验拟合 loss 与规模的可预测曲线，使团队能在全量训练前用较小规模外推，并解释早期 GPT-3 路线中「参数优先」的资源分配。

## 核心概念

设模型参数量 $N$、数据 token 数 $D$、计算量 $C$（近似 $C \propto N \cdot D$）。交叉熵 loss 满足幂律：

$$
L(N) \approx \left(\frac{N_c}{N}\right)^{\alpha_N}, \quad
L(D) \approx \left(\frac{D_c}{D}\right)^{\alpha_D}
$$

联合形式（示意）：

$$
L(N, D) \approx A N^{-\alpha_N} + B D^{-\alpha_D} + L_\infty
$$

| 结论（Kaplan） | 含义 |
| --- | --- |
| 参数更重要 | 固定算力时倾向更大 $N$、相对较少 $D$ |
| 宽深比 | 深度与宽度需配合，过深/过浅偏离最优 |

## 方法/算法

实践用法：

1. 在多个 $(N, D)$ 点上训练至收敛附近，记录 final loss；
2. 对数坐标线性回归拟合 $\alpha_N, \alpha_D$；
3. 给定预算 $C$，解 $\min L(N,D)$ s.t. $N \cdot D \propto C$ → 得到推荐 $N$ vs $D$；
4. **注意**：Kaplan 与 [Chinchilla](./02-chinchilla-scaling-laws.md) 最优配比结论不同，因实验设定与 iso-loss 定义差异。

```mermaid
flowchart LR
  sweep[小规模扫_N_D] --> fit[拟合幂律]
  fit --> predict[外推全量配置]
  predict --> train[千亿级训练]
```

## 工程实践

- **不要盲信系数**：不同数据清洗、tokenizer、架构会使 $L_\infty$ 与指数变化。
- **监控**：用 1% 算力点验证预测 loss 是否落在置信区间。
- **与数据工程联动**：[3.1 数据](../01-pretraining-data/01-data-sources.md) 质量差会使幂律偏移。
- **docs**：[预训练](../../../../docs/01-llm-intro/05-training/02-pre-training) Scaling Law 章节。

## 代表工作

- Kaplan et al.：https://arxiv.org/abs/2001.08361
- Henighan et al.（后续扩展）：https://arxiv.org/abs/2102.01293

## 局限与注意点

- **Chinchilla 修正**：同等算力下应更均衡地增 $D$，见下一节。
- **下游任务**：训练 loss 幂律不一定等于 benchmark 线性提升。
- **推理成本**：训练最优 $N$ 可能推理太贵，见 [3.4.3](./03-compute-vs-inference-optimal.md)。
- **涌现**：[3.4.5](./05-emergent-abilities.md) 不一定在 Kaplan 曲线上显式出现。


## 延伸说明
Kaplan 系数随 tokenizer、数据质量变化；每次 data refresh 应重拟合小 sweep。
## 实践检查清单
- [ ] 幂律
- [ ] $N$ vs $D$
- [ ] iso-loss

## 小结

本节核心：幂律 与全链路 $N$ vs $D$ 协同；上线前用检查清单做回归。

新数据 refresh 后应重跑小规模 $(N,D)$ sweep，勿直接沿用旧论文系数。

## 相关章节

- 下一节：[3.4.2 Chinchilla](./02-chinchilla-scaling-laws.md)
- [3.4.4 数据-参数权衡](./04-data-parameter-tradeoff.md)
- 分布式：[3.5.1 DP](../05-distributed-training/01-data-parallelism.md)
- 入门：[1.1.1 什么是 LLM](../../01-foundations/01-introduction/01-what-is-llm.md)
