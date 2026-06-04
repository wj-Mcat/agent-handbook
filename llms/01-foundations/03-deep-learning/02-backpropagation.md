# 1.3.2 反向传播与计算图

## 要解决的问题

前向网络参数众多，如何高效计算 **损失对每一参数的梯度**？反向传播（Backpropagation）利用链式法则，在计算图上自输出向输入传播梯度。

## 链式法则

若 $L = f(g(h(x)))$，则 $\frac{\partial L}{\partial x} = \frac{\partial L}{\partial f}\frac{\partial f}{\partial g}\frac{\partial g}{\partial h}\frac{\partial h}{\partial x}$。

深度学习框架（PyTorch、JAX）对算子注册 **backward**，自动组装全图梯度。

## 计算图

- **节点**：张量运算（matmul、softmax、LayerNorm…）
- **边**：数据依赖
- **训练一步**：前向 → 算 loss → `loss.backward()` → 优化器 `step()`

```mermaid
flowchart RL
  loss[Loss] --> n3[节点3]
  n3 --> n2[节点2]
  n2 --> n1[节点1]
  n1 --> params[参数_W_b]
```

## 关键算子的梯度直觉

| 算子 | 梯度要点 |
| --- | --- |
| 线性 $Wx+b$ | $\partial L/\partial W = (\partial L/\partial z)\, x^\top$ |
| ReLU | 门控：正区间传递梯度 |
| Softmax+CE | 组合后梯度形式简洁，数值稳定 |
| LayerNorm | 对均值方差归一化路径求导 |

## 激活重计算（与 LLM 训练相关）

长序列训练显存不足时，可 **不保存** 部分中间激活，反向时 **重算**（见 [3.6.3 检查点与重计算](../../03-pre-training/06-training-stability/03-checkpointing-recomputation)、[Flash Attention](../02-transformer/03-transformer-improvements/05-flash-attention)）。

## 梯度问题

- **消失/爆炸**：深层 RNN 时代突出；Transformer 中仍依赖 **残差、Pre-LN、合适初始化**。
- **梯度裁剪**：见 [3.6.2](../../03-pre-training/06-training-stability/02-gradient-accumulation-clipping)。

## 参考链接

- [1.3.1 前向传播](./01-neural-networks-forward)
- [1.3.4 优化器](./04-optimizers)
