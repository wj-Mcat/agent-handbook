# 混合精度训练（FP16、BF16、FP8）

## 要解决的问题

FP32 训练百亿参数模型**显存与算力双倍浪费**。混合精度用低精度做矩阵乘、高精度存关键状态，在几乎不损收敛的前提下将吞吐提升 1.5～2×，并释放显存给更大 batch 或更长序列。

## 核心概念

| 格式 | 指数位 | 尾数位 | 特点 |
| --- | --- | --- | --- |
| FP32 | 8 | 23 | 基准 |
| FP16 | 5 | 10 | 易溢出，需 loss scaling |
| BF16 | 8 | 7 | 动态范围≈FP32，LLM 首选 |
| FP8 (E4M3/E5M2) | 更窄 | H100+ | 需 per-tensor scale |

**自动混合精度（AMP）**：前向/反向 matmul 用 BF16/FP16，权重主副本常 FP32（或 BF16 master weight），优化器更新 FP32。

Loss scaling（FP16）：

$$
L' = s \cdot L, \quad \frac{\partial L}{\partial \theta} = \frac{1}{s}\frac{\partial L'}{\partial \theta}
$$

$s$ 动态调整以防梯度下溢/上溢。

## 方法/算法

PyTorch 典型配置：

```python
autocast(dtype=torch.bfloat16)
# GradScaler 仅 FP16 需要
```

Transformer Engine / `torch.float8` 路径：

- 前向量化权重与激活，**amax** 历史估计 scale；
- 反向用 FP8 或 BF16 累加；
- 对 LayerNorm、softmax 常保持 FP32/BF16。

与 [分布式](../05-distributed-training/06-fsdp.md) 结合时，注意 reduce 精度（FP32 累加梯度更稳）。

## 工程实践

- **硬件**：A100 强推 BF16；V100 仅 FP16；H100/MI300 探索 FP8。
- **指标**：监控 `grad_norm`、是否出现 Inf/NaN；对比 FP32 基线 loss 曲线。
- **推理衔接**：训练 BF16 权重可直接 BF16/INT8 部署，见 [5.3 量化](../../05-inference-deployment/03-quantization/01-quantization-basics.md)。
- **框架**：`transformers` `bf16=True`、`torch.autocast`。

## 代表工作

- Micikevicius et al. 混合精度训练：https://arxiv.org/abs/1710.03740
- NVIDIA Transformer Engine 文档
- NVIDIA FP8 训练白皮书（Hopper）

## 局限与注意点

- **FP16 溢出**：大模型常直接 BF16 跳过 loss scaling 调参痛苦。
- **FP8 敏感**：小模型或不稳定架构可能需更长 warmup。
- **LayerNorm**：部分实现强制 FP32 计算，勿全局关闭。
- **Checkpoint**：保存 dtype 与加载时 `cast` 需一致。


## 延伸说明
A100+ 优先 BF16；V100 用 FP16 + GradScaler；H100 再评估 FP8。
## 实践检查清单
- [ ] amax
- [ ] master weight
- [ ] Inf

## 小结

本节核心：amax 与全链路 master weight 协同；上线前用检查清单做回归。

## 相关章节

- [3.6.2 梯度累积与裁剪](./02-gradient-accumulation-clipping.md)
- [3.6.5 Loss Spike](./05-loss-spike.md)
- [3.5.1 DP](../05-distributed-training/01-data-parallelism.md)
- 发散诊断：[3.6.4](./04-divergence-diagnosis.md)
