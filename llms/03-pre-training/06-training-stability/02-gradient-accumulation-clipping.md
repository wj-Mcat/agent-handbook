# 3.6.2 梯度累积与梯度裁剪

## 要解决的问题

目标全局 batch $B_{\text{global}}$ 受显存限制，单步只能放 $B_{\text{local}}$。**梯度累积**在 $G_{\text{acc}}$ 步后再更新，等价更大 batch。深层网络梯度范数偶发爆炸会导致 [loss spike](./05-loss-spike.md) 或发散，**梯度裁剪**将更新幅度约束在稳定区间。

## 核心概念

累积 $G_{\text{acc}}$ 步后：

$$
g_{\text{eff}} = \frac{1}{G_{\text{acc}}} \sum_{i=1}^{G_{\text{acc}}} g^{(i)}
$$

等价全局 batch $B_{\text{global}} = B_{\text{local}} \cdot K \cdot G_{\text{acc}}$（$K$ 为 DP 卡数）。

**Global norm clipping**：设所有参数梯度拼接向量 $g$，阈值 $\tau$：

$$
g \leftarrow g \cdot \min\left(1, \frac{\tau}{\|g\|_2 + \epsilon}\right)
$$

| 技术 | 作用 |
| --- | --- |
| 累积 | 显存 ↔ 有效 batch |
| Clip | 抑制尖刺梯度 |
| LR warmup | 与累积步数配合 |

## 方法/算法

实现模式：

```python
for i, batch in enumerate(loader):
    loss = model(batch) / grad_accum_steps
    loss.backward()
    if (i + 1) % grad_accum_steps == 0:
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()
        optimizer.zero_grad()
```

**FSDP/DDP**：累积步内用 `model.no_sync()`（DDP）避免中间 AllReduce；最后一步同步。

学习率缩放：线性规则 $\eta' = \eta \cdot B_{\text{global}}/B_{\text{ref}}$ 仅近似；大 batch 常需 **warmup 更长** 或 sqrt scaling。

## 工程实践

- **典型 clip**：`max_norm=1.0`（GPT、LLaMA 类）；不稳定时可降到 0.5。
- **监控**：记录 `grad_norm` 直方图；突刺对应数据 batch 或数值问题。
- **与 ZeRO**：裁剪在 `optimizer.step` 前对 unshard 梯度或分片梯度统一处理（框架内封装）。
- **有效吞吐**：累积不增算力吞吐，只换等效 batch；要更快需加 GPU。

## 代表工作

- Pascanu et al. 梯度裁剪与 RNN：https://arxiv.org/abs/1211.5063
- GPT-3 训练细节（梯度范数监控）：https://arxiv.org/abs/2005.14165

## 局限与注意点

- **过大 $G_{\text{acc}}$**：BN 统计（若有）偏差；优化器动量滞后感增强。
- **裁剪过狠**：限制学习速度，欠拟合风险。
- **与 AdamW**：裁剪作用于梯度，权重衰减解耦仍在 `optimizer`。
- **混合精度**：FP16 下溢梯度在裁剪前可能已为 0，见 [3.6.1](./01-mixed-precision.md)。


## 延伸说明
FSDP/DDP 仅在最后累积步同步梯度，避免通信翻倍。
## 实践检查清单
- [ ] grad_norm
- [ ] $\tau$
- [ ] warmup

## 小结

本节核心：grad_norm 与全链路 $\tau$ 协同；上线前用检查清单做回归。

## 相关章节

- [3.6.1 混合精度](./01-mixed-precision.md)
- [3.5.1 DP](../05-distributed-training/01-data-parallelism.md)
- [3.6.4 发散诊断](./04-divergence-diagnosis.md)
- [3.6.5 Loss Spike](./05-loss-spike.md)
