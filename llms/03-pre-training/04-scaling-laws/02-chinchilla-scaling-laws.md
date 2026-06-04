# 3.4.2 Chinchilla Scaling Laws

## 要解决的问题

Kaplan 建议偏大模型、偏少数据；Hoffmann 等（DeepMind, 2022）在**固定算力**下重新拟合，发现多数已发布大模型处于「欠训练」状态。Chinchilla 定律给出参数量与 token 数的近似最优配比，指导在相同 FLOPs 下选更小 $N$、更多 $D$，往往得到更好下游表现。

## 核心概念

对 compute-optimal 预训练，经验关系（近似）：

$$
D_{\text{opt}} \approx 20 \times N
$$

其中 $N$ 为**非 embedding** 参数量，$D$ 为训练 token 数（不同论文常数在 10～20 间，以复现为准）。

Chinchilla-70B：用约 70B 参数 + **1.4T tokens**（相对 Gopher 280B + 300B）在多项评测上更优。

| 对比 | Kaplan 倾向 | Chinchilla 倾向 |
| --- | --- | --- |
| 固定 $C$ | 更大 $N$ | 更多 $D$，适中 $N$ |
| 代表 | 早期 GPT-3 规划 | LLaMA 1（1T/65B）等 |

损失联合缩放（Hoffmann 式）：

$$
L(N,D) = E + \frac{A}{N^\alpha} + \frac{B}{D^\beta}
$$

最优 $N^\*(C)$、$D^\*(C)$ 满足 $N \propto C^a$，$D \propto C^b$，且 $D \propto N$ 近线性。

## 方法/算法

预算规划步骤：

1. 确定 FLOPs 预算 $C \approx 6 N D$（每 token 约 $6N$ FLOPs，系数随架构略变）；
2. 由 $D \approx k N$（$k\approx 20$）解 $N$、$D$；
3. 校验集群能否在合理时间内吃完 $D$（IO 与 [数据管道](../01-pretraining-data/01-data-sources.md)）；
4. 若推理延迟敏感，可故意 **under-train 大模型**（推理最优，见 3.4.3）。

## 工程实践

- **LLaMA 2/3、Qwen、DeepSeek** 技术报告中的 token/参数比常高于 Chinchilla 常数（「过训练」换推理单次质量，属产品策略）。
- **小模型复现**：7B 模型按 Chinchilla 应 ~140B tokens，许多开源仅 2T 总数据但多 epoch，需区分 **unique tokens** vs **总见过次数**。
- **监控**：loss 随 $D$ 继续下降则尚未 Chinchilla-optimal。

## 代表工作

- Hoffmann et al. Chinchilla：https://arxiv.org/abs/2203.15556
- Touvron et al. LLaMA（数据量讨论）：https://arxiv.org/abs/2302.13971

## 局限与注意点

- **常数 20 非普适**：代码/数学占比高时最优 $D$ 可能更大（待验证）。
- **多 epoch**：重复数据降低有效 $D$；应用 unique token 计数。
- **MoE**：活跃参数 $N_{\text{active}}$ 与总参数量不同，scaling 需分开（见 MoE 报告）。
- **与 Kaplan 并存**：两者都是经验拟合，新数据清洗会移动曲线。


## 延伸说明
报告训练时 **不重复** token 数；多 epoch 会降低有效 $D$。
## 实践检查清单
- [ ] $D \approx 20N$
- [ ] 70B
- [ ] 欠训练

## 小结

本节核心：$D \approx 20N$ 与全链路 70B 协同；上线前用检查清单做回归。


## 算力估算（便于排期）

训练 FLOPs 粗算：$C \approx 6 N D$（decoder-only，系数随实现略变）。

| $N$ | $D$（Chinchilla $\approx 20N$） | $C$ 量级 |
| --- | --- | --- |
| 7B | 140B | $\sim 6\times 10^{21}$ |
| 70B | 1.4T | $\sim 6\times 10^{23}$ |

集群有效 tokens/s 决定墙钟时间；数据 IO 与 [通信](../05-distributed-training/07-communication-optimization.md) 常是瓶颈。

## 相关章节

- 上一节：[3.4.1 Kaplan](./01-kaplan-scaling-laws.md)
- 下一节：[3.4.3 计算 vs 推理最优](./03-compute-vs-inference-optimal.md)
- [3.4.4 数据-参数权衡](./04-data-parameter-tradeoff.md)
- 预训练数据：[3.1.4 混合](../01-pretraining-data/04-data-mixture.md)
