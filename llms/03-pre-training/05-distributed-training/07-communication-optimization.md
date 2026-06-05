# 通信优化与拓扑

## 要解决的问题

千亿参数训练时，**AllReduce / AllGather** 耗时可达总步时间 30%～50% 以上。通信优化通过硬件拓扑感知、梯度压缩、计算-通信重叠、集合算法选择，在固定集群上挤出有效吞吐（tokens/s/GPU）。

## 核心概念

| 集合操作 | 典型用途 | 带宽敏感 |
| --- | --- | --- |
| AllReduce | DDP 梯度 | 高 |
| AllGather | ZeRO-3 / FSDP 参数 | 高 |
| ReduceScatter | ZeRO 分片梯度 | 高 |
| AllToAll | CP / MoE 路由 | 很高 |

Ring AllReduce 通信量：

$$
\text{Data}_{\text{comm}} = 2 \frac{K-1}{K} \cdot |\theta|
$$

$K$ 为参与 GPU 数。NVLink 域内带宽 >> 跨机 InfiniBand >> TCP。

**α-β 模型**：延迟 $\alpha$ + 传输量/带宽 $\beta$，小消息受 $\alpha$ 主导，宜合并 bucket。

## 方法/算法

优化手段：

1. **重叠**：backward 中分层 AllReduce（DDP `overlap_comm`）；FSDP `forward_prefetch`；
2. **梯度压缩**：FP16 梯度、1-bit Adam（研究/谨慎）；
3. **拓扑**：同机 8 卡 NVLink 全互联；跨机尽量 **机内 TP、机间 DP**；
4. **SHARP / NCCL 调优**：`NCCL_IB_HCA`、`NCCL_SOCKET_IFNAME` 指定网卡；
5. **消息融合**：小 tensor 合并为大 bucket 减少 launch 次数。

```mermaid
flowchart LR
  comp[反向计算] -->|重叠| comm[NCCL集合]
  comm --> comp2[下一层反向]
```

## 工程实践

- **监控**：`torch.distributed` 计时、`nccl-tests` all_reduce_perf、Prometheus + 集群监控。
- **故障**：挂起常因防火墙、错误 `MASTER_PORT`、GPU P2P 被禁。
- **云环境**：虚拟 NIC 带宽虚标，实测 tokens/s 再扩容。
- **与 [3.5.5 3D](./05-three-d-sequence-parallelism.md)**：PP bubble 与 comm 叠加，profile 后决定减 PP 或减 TP。

## 代表工作

- NVIDIA NCCL 文档与性能指南
- Li et al. 带宽最优 AllReduce（Ring）：经典教材
- Chowdhury et al. 网络拓扑与训练：https://arxiv.org/abs/2003.01886（背景）

## 局限与注意点

- **压缩损精度**：低 bit 梯度需与 [loss spike](../06-training-stability/05-loss-spike.md) 监控联动。
- **多租户集群**：网络争抢导致性能日波动。
- **推理不同于训练**：推理更重 KV 带宽，见 [5.2](../../05-inference-deployment/02-kv-cache-attention-optimization/01-kv-cache.md)。
- **法律/合规**：与通信无关，但跨地域数据传输需注意数据驻留。


## 延伸说明
记录 `NCCL_DEBUG=INFO` 一次基线，排查 hang 与 slow rank。
## 实践检查清单
- [ ] bucket
- [ ] 重叠
- [ ] IB

## 小结

本节核心：bucket 与全链路 重叠 协同；上线前用检查清单做回归。

多机作业前用 `nccl-tests` 实测 all_reduce，带宽异常节点应剔除。

## 相关章节

- [3.5.1 DP](./01-data-parallelism.md) · [3.5.4 ZeRO](./04-zero-deepspeed.md) · [3.5.6 FSDP](./06-fsdp.md)
- [3.5.5 3D/CP](./05-three-d-sequence-parallelism.md)
- 训练稳定：[3.6.1](../06-training-stability/01-mixed-precision.md)
- Chinchilla 算力规划：[3.4.2](../04-scaling-laws/02-chinchilla-scaling-laws.md)
