# 数据量与参数量的权衡

## 要解决的问题

给定参数量 $N$，应收集多少 **unique token** $D$？过少则欠拟合、浪费参数；过多 epoch 则过拟合重复、收益递减。本节在 Chinchilla 框架下细化 **数据-参数 tradeoff** 的工程含义，并与数据质量、混合配比联动。

## 核心概念

有效训练量：

$$
D_{\text{eff}} = D_{\text{unique}} + (E-1)\cdot \eta \cdot D_{\text{unique}}
$$

$E$ 为 epoch 数，$\eta \in [0,1]$ 表示重复样本的边际收益折扣（启发式，非严格理论）。

Chinchilla 建议（固定 $C$）：

$$
D^* \propto N, \quad N^* \propto C^{0.5},\; D^* \propto C^{0.5}
$$

| 区域 | 现象 |
| --- | --- |
| $D \ll D^*$ | loss 随 $D$ 快速下降，参数闲置 |
| $D \approx D^*$ | compute-optimal 拐点 |
| $D \gg D^*$ | loss 改善缓慢，数据管线成本上升 |

## 方法/算法

规划 checklist：

1. 选定目标 $N$（架构与推理约束）；
2. 查 Chinchilla $D \approx 20N$ 作首版目标 unique tokens；
3. 评估语料是否够：不够则降 $N$ 或扩充 [数据来源](../01-pretraining-data/01-data-sources.md)；
4. 若语料过剩：优先 **提高质量与混合** 而非盲目加 epoch；
5. 用代理模型扫 $D \in \{0.5,1,2\}\times D^*$ 看验证 loss 与 2～3 个下游任务。

数据质量乘数（工程经验，待验证）：

$$
D_{\text{req}} \approx D^* / q_{\text{data}}^{\gamma}
$$

低质数据 $q_{\text{data}}$ 小，需要更多 token 或更强过滤。

## 工程实践

- **重复 epoch**：LLaMA 1 对 1T tokens 训练 65B 接近 Chinchilla；部分中文模型 2T 语料训 7B 多 epoch，需报告 unique vs total。
- **课程学习**：后期换 [混合](../01-pretraining-data/04-data-mixture.md) 不算增加 $D$，但改变有效分布。
- **继续预训练**：下游 CPT 的 $D_{\text{cpt}}$ 通常 $\ll D_{\text{pretrain}}$，见 docs [继续预训练](../../../../docs/01-llm-intro/05-training/03-continue-pre-training)。
- **存储**：$D$ 翻倍等于清洗、去重、训练时间近乎线性增（通信优化见 [3.5.7](../05-distributed-training/07-communication-optimization.md)）。

## 代表工作

- Hoffmann et al.：https://arxiv.org/abs/2203.15556
- Muennighoff et al.（数据重复与遗忘）：https://arxiv.org/abs/2305.16264
- Xie et al. Doremi（数据权重）：https://arxiv.org/abs/2305.10409

## 局限与注意点

- **任务相关**：代码/数学可能需要高于比例的 $D$（相对 Chinchilla 常数）。
- **污染**：重复 benchmark 文本虚高下游指标。
- **法律**：$D$ 扩大常触及 [版权](../01-pretraining-data/05-data-licensing.md) 边界。
- **与涌现**：能力跃迁未必在 $D^*$ 附近出现。


## 延伸说明
重复数据边际收益递减；优先扩 unique 数据再考虑第二 epoch。
## 实践检查清单
- [ ] $D_{eff}$
- [ ] CPT
- [ ] 代理实验

## 小结

本节核心：$D_{eff}$ 与全链路 CPT 协同；上线前用检查清单做回归。

## 相关章节

- [3.4.1 Kaplan](./01-kaplan-scaling-laws.md) · [3.4.2 Chinchilla](./02-chinchilla-scaling-laws.md)
- [3.4.3 推理最优](./03-compute-vs-inference-optimal.md)
- 数据混合：[3.1.4](../01-pretraining-data/04-data-mixture.md)
- 训练稳定：[3.6.5 Loss Spike](../06-training-stability/05-loss-spike.md)
