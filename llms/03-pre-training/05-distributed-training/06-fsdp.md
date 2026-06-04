# 3.5.6 FSDP（Fully Sharded Data Parallel）

## 要解决的问题

PyTorch 生态需要**原生、可组合**的大模型训练 API，避免强绑定单一框架。FSDP（Fully Sharded Data Parallel）将 ZeRO-3 类分片融入 `torch.nn`，与 DDP、激活检查点、混合精度协同，成为许多开源 LLM 训练的默认选择。

## 核心概念

FSDP 包装子模块后：

- **SHARDED**：参数分片存各 rank；
- **forward**：`all_gather` 临时完整参数；
- **backward**：`reduce_scatter` 梯度到分片 rank；
- **优化器**：仅更新本地分片。

策略枚举（PyTorch 2.x）：

| 策略 | 行为 |
| --- | --- |
| `FULL_SHARD` | 等同 ZeRO-3 |
| `SHARD_GRAD_OP` | 等同 ZeRO-2 |
| `NO_SHARD` | 接近 DDP |
| `HYBRID_SHARD` | 节点内 shard、节点间 replicate |

## 方法/算法

典型用法：

```python
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
model = FSDP(model, auto_wrap_policy=transformer_auto_wrap_policy, ...)
```

`auto_wrap_policy` 按 Transformer layer 分块，平衡通信频率与显存峰值。

**CPU Offload**：`cpu_offload=True` 将参数 offload 到 host RAM，适合超大模型试探，吞吐下降明显。

与 [梯度累积](../06-training-stability/02-gradient-accumulation-clipping.md)：`no_sync()` 上下文在累积步禁用梯度同步。

## 工程实践

- **PyTorch 2.4+**：`fully_shard`（FSDP2）更细粒度，性能改进。
- **HF Transformers**：`device_map` + `accelerate` FSDP 插件；注意 `save_pretrained` 需 `FULL_STATE_DICT` 聚合。
- **与 TP**：2D 组合（FSDP × TP）在超大模型使用；配置见 PyTorch 文档。
- **对比 DeepSpeed**：纯 PyTorch 栈选 FSDP；需 ZeRO-Infinity 等选 DeepSpeed。
- **稳定性**：配合 [BF16](../06-training-stability/01-mixed-precision.md)、[clip grad](../06-training-stability/02-gradient-accumulation-clipping.md)。

## 代表工作

- Zhao et al. PyTorch FSDP：https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/
- Rajbhandari ZeRO（理论基础）：https://arxiv.org/abs/1910.02054

## 局限与注意点

- **首步编译慢**：FSDP 包装后第一次 forward 较慢。
- **小模型 overhead**：不足 1B 参数时可能不如 DDP 快。
- **权重导出**：必须正确 `summon_full_params` 再保存，否则 shard 文件无法直接推理。
- **自定义层**：需手动指定 wrap policy，否则整网一张卡 shard 失败。


## 延伸说明
推理前 `FULL_STATE_DICT` 聚合；勿直接部署分片 shard。
## 实践检查清单
- [ ] auto_wrap
- [ ] FSDP2
- [ ] HYBRID_SHARD

## 小结

本节核心：auto_wrap 与全链路 FSDP2 协同；上线前用检查清单做回归。


## FSDP vs DeepSpeed 选型

| 场景 | 倾向 |
| --- | --- |
| 纯 PyTorch、HF 生态 | FSDP |
| 需 ZeRO-Infinity、复杂 pipeline | DeepSpeed |
| 超大 MoE | 厂商定制 + EP |

迁移时对比相同 global batch 下的 **tokens/s 与 loss 曲线**，而非只看峰值显存。

## 相关章节

- [3.5.4 ZeRO](./04-zero-deepspeed.md)
- [3.5.1 DP](./01-data-parallelism.md)
- [3.5.7 通信](./07-communication-optimization.md)
- 检查点：[3.6.3](../06-training-stability/03-checkpointing-recomputation.md)
