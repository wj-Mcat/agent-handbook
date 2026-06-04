# 3.5.3 流水线并行（Pipeline Parallelism）

## 要解决的问题

极深模型（数百层）即使用 TP 仍可能**单卡层数过多**。流水线并行（Pipeline Parallelism, PP）按层划分为 $S$ 个 stage，每 stage 驻留不同 GPU，微批次像流水线一样穿过各 stage，提高设备利用率。

## 核心概念

设 $S$ 个 stage，每 stage 含连续层子集。朴素 PP 存在 **bubble**（流水线启动/排空时空闲）。

| 调度 | bubble 比例（近似） | 复杂度 |
| --- | --- | --- |
| GPipe（填充微批） | $\frac{S-1}{M+S-1}$ | 需 $M$ 个微批 |
| 1F1B | 更低 | 前向反向交错 |
| Interleaved | 更低 | 每卡多 virtual stage |

有效吞吐量：

$$
\text{TF} \propto \frac{M}{M + S - 1}
$$

$M$ 为 micro-batch 数量，增大 $M$ 可减 bubble 但增激活显存（需 [重计算](../06-training-stability/03-checkpointing-recomputation.md)）。

## 方法/算法

1F1B 概要：

- 先预热：连续 $S-1$ 个前向；
- 稳态：每步一个前向 + 一个反向，保持流水线满；
- 冷却：排空剩余反向。

**激活检查点**：每 stage 只存边界激活，中间层重算，换显存。

```mermaid
flowchart LR
  s0[Stage0_层0-10] --> s1[Stage1_层11-20]
  s1 --> s2[Stage2_层21-30]
  s2 --> s3[Stage3_层31-40]
```

## 工程实践

- **划分**：均匀按层数或按 **FLOPs/显存** 均衡（embedding 与 lm_head 常放首尾 stage）。
- **框架**：Megatron PP、DeepSpeed PP、Alpa（研究）。
- **与 TP**：单 stage 内再做 TP（3D 并行）。
- **故障**：某 stage OOM 需重划 layer map；PP 调试难度高于纯 DP。

## 代表工作

- Huang et al. GPipe：https://arxiv.org/abs/1811.06965
- Narayanan et al. Megatron 流水线：https://arxiv.org/abs/2104.04473
- Lamy et al. PipeDream（异步 PP 研究）：https://arxiv.org/abs/1806.03377

## 局限与注意点

- **bubble 不可避免**：$S$ 很大时需很多 micro-batch，延迟敏感训练不友好。
- **负载不均**：MoE 专家负载可能拖慢某一 stage。
- **梯度累积**：与 PP 调度交互复杂，配置错误易 deadlock。
- **推理**：PP 较少用于低延迟在线推理；训练为主。


## 延伸说明
增大 $M$ 减 bubble 但增激活；配合 checkpoint。
## 实践检查清单
- [ ] 1F1B
- [ ] bubble
- [ ] stage

## 小结

本节核心：1F1B 与全链路 bubble 协同；上线前用检查清单做回归。

Interleaved PP 可进一步压 bubble，适合每卡多 virtual stage 的超大模型。

## 相关章节

- [3.5.2 TP](./02-tensor-parallelism.md)
- [3.5.5 3D 并行](./05-three-d-sequence-parallelism.md)
- 重计算：[3.6.3](../06-training-stability/03-checkpointing-recomputation.md)
- 通信：[3.5.7](./07-communication-optimization.md)
