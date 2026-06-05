# 张量并行（Tensor Parallelism）

## 要解决的问题

当单层矩阵（如 MLP、Attention 投影）过大，**单卡放不下完整参数或激活**。张量并行（Tensor Parallelism, TP）将单层权重按列/行切到多卡，前向/反向中插入 **AllReduce / ReduceScatter** 交换部分结果，使每卡只持有一部分参数。

## 核心概念

Megatron-LM 风格（示意）：

- **Column Parallel**：$Y = XA$，$A$ 按列切分，每卡算 $Y_i = X A_i$，输出拼接或后续 ReduceScatter；
- **Row Parallel**：$Y = XA$，$A$ 按行切分，每卡需 AllReduce 聚合中间结果。

Attention 中 $Q,K,V$ 投影常 column-parallel，输出投影 row-parallel。

| 维度 | 切什么 | 典型组 |
| --- | --- | --- |
| TP | 单层权重 | 同机 NVLink 8 卡 |
| DP | 样本 batch | 跨机 thousands 卡 |
| PP | 层深度 | 跨 stage |

TP 度 $T$ 时，每卡参数量约 $\approx 1/T$（非严格，因 embedding 常复制）。

## 方法/算法

单层 MLP 两矩阵乘法：

1. $h_1 = f(X W_1)$，$W_1$ column-split；
2. $Y = h_1 W_2$，$W_2$ row-split，AllReduce 得完整 $Y$。

**Sequence Parallel（SP）**：在 TP 组内对 LayerNorm、Dropout 的激活按序列维切分，进一步降激活显存，常与 TP 绑定（Megatron-Core）。

通信量随 hidden size $h$、sequence $s$ 增长；宜 **同节点高带宽** 拓扑。

## 工程实践

- **框架**：Megatron-LM、Megatron-Core、部分 `torch.distributed.tensor`（DTensor）。
- **约束**：$T$ 常为 2、4、8；头数 $H$ 需能被 $T$ 整除。
- **与 DP**：全局组 = DP × TP × PP；数据仅在 DP 维切分。
- **推理**：vLLM TP 与训练类似，降低单卡权重。
- **调试**：TP 错误常表现为 logits 全 NaN 或 loss 不下降。

## 代表工作

- Shoeybi et al. Megatron-LM：https://arxiv.org/abs/1909.08053
- Narayanan et al. 高效大规模训练：https://arxiv.org/abs/2104.04473

## 局限与注意点

- **跨机 TP 昂贵**：NVLink 域外慎用大 $T$。
- **MoE**：专家并行（EP）与 TP 组合更复杂。
- **Checkpoint**：加载需按切分规则合并/切分权重。
- **小模型**：7B 以下常仅需 FSDP/ZeRO + DP，不必 TP。


## 延伸说明
确保 attention head 数能被 TP 度整除；否则需改模型配置。
## 实践检查清单
- [ ] Megatron
- [ ] column parallel
- [ ] NVLink

## 小结

本节核心：Megatron 与全链路 column parallel 协同；上线前用检查清单做回归。


## TP 宽度选型

| 模型规模 | 常见 TP |
| --- | --- |
| ≤13B | 1（仅 FSDP/DP） |
| 30B～70B | 2～8 |
| 100B+ | 8 + PP |

同机 8 卡 NVLink 常作为 TP 组上限；跨机 TP 需极高带宽才划算。

## 相关章节

- 上一节：[3.5.1 DP](./01-data-parallelism.md)
- 下一节：[3.5.3 PP](./03-pipeline-parallelism.md)
- [3.5.5 3D 并行](./05-three-d-sequence-parallelism.md)
- FlashAttention：[5.2.3](../../05-inference-deployment/02-kv-cache-attention-optimization/03-flash-attention.md)
