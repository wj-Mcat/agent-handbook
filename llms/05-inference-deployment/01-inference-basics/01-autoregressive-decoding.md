# 5.1.1 自回归解码流程

## 要解决的问题

LLM 在推理阶段需要**逐 token 生成**完整回复。与训练时一次前向处理整段序列不同，解码必须在每一步根据已生成前缀预测下一个 token，并反复调用模型直到遇到停止条件。理解自回归流程是分析延迟、KV Cache、批处理与加速解码的共同基础。

## 核心概念

自回归语言模型将序列概率分解为：

$$
p(x_1,\ldots,x_T) = \prod_{t=1}^{T} p(x_t \mid x_{<t})
$$

单步解码在时刻 $t$ 计算 logits $\mathbf{z}_t \in \mathbb{R}^{|V|}$，再经 softmax 与采样策略得到 $x_t$：

$$
p(x_t = v \mid x_{<t}) = \frac{\exp(z_{t,v})}{\sum_{v'} \exp(z_{t,v'})}
$$

| 阶段 | 输入 | 输出 | 典型瓶颈 |
| --- | --- | --- | --- |
| Prefill | 完整 prompt | 首 token logits + 各层 KV | 计算密集（长 prompt） |
| Decode | 上一 token + KV Cache | 下一 token logits | 内存带宽、KV 读写 |

```mermaid
flowchart TD
  prompt[Prompt tokens] --> prefill[Prefill 一次前向]
  prefill --> kv[写入 KV Cache]
  kv --> loop{生成下一 token?}
  loop -->|是| decode[Decode 单 token 前向]
  decode --> sample[采样 / 贪心]
  sample --> append[追加到序列]
  append --> kv
  loop -->|EOS / 达 max_tokens| end[结束]
```

## 方法 / 解码循环

典型实现（伪代码）：

```python
# Prefill：处理 prompt，缓存 K/V
logits, kv_cache = model.forward(prompt_ids, use_cache=True)
next_id = sample(logits[-1])

# Decode：每步只喂 1 个新 token
while not stop(next_id) and len < max_tokens:
    logits, kv_cache = model.forward([next_id], past_kv=kv_cache)
    next_id = sample(logits[-1])
```

关键设计点：

1. **因果掩码**：Decode 步仅关注历史，不窥视未来 token（与 [5.2.1 KV Cache](../02-kv-cache-attention-optimization/01-kv-cache) 配合）。
2. **停止条件**：EOS token、`max_tokens`、自定义 stop 序列（见 [5.1.3 重复与长度控制](./03-repetition-length-control)）。
3. **批维度**：同一 batch 内各请求长度不同，服务端需连续批处理（见 [5.6.2](./../06-inference-serving/02-continuous-batching)）。

## 工程实践

- **框架**：Hugging Face `generate()`、vLLM、SGLang 均封装上述两阶段；调参时区分 `prefill` 与 `decode`  profiling。
- **指标**：首 token 延迟 TTFT 主要由 Prefill 决定；后续吞吐看 TPOT（见 [5.1.4 延迟指标](./04-latency-metrics)）。
- **与训练差异**：推理禁用 dropout、通常 `eval()`；温度与采样仅影响 decode 步的 `sample()`。

## 代表工作

- Radford et al., *Language Models are Unsupervised Multitask Learners*（GPT-2 自回归范式）
- 工业实践：OpenAI API、vLLM 文档中的 prefill/decode 分离调度

## 与训练前向的差异

| 维度 | 训练（Teacher Forcing） | 推理 Decode |
| --- | --- | --- |
| 输入长度 | 整段序列 | 每步 1 token + KV |
| 并行度 | 高（批×序） | 低（自回归） |
| 损失 | 全位置 CE | 仅采样路径 |
| 显存 | 激活检查点 | KV 主导 |

批量推理服务将 thousands of 请求 multiplex 到连续批（[5.6.2](../06-inference-serving/02-continuous-batching)），单请求仍逻辑自回归。

## 局限与注意点

- 串行 decode **无法**像训练那样并行整条输出，长生成必然拉高延迟。
- 贪心解码易重复；需配合采样或惩罚（[5.1.2](./02-sampling-strategies)、[5.1.3](./03-repetition-length-control)）。
- 多轮对话需正确拼接 token 与角色模板，否则破坏条件分布。

## 相关章节

- 上一节逻辑起点：[第五部分总览](../../00-intro) / 预训练因果 LM：[3.3.1 因果语言模型](../../03-pre-training/03-pretraining-objectives/01-causal-lm)
- 同章：[5.1.2 采样策略](./02-sampling-strategies) · [5.1.4 延迟指标](./04-latency-metrics)
- 下游：[5.2.1 KV Cache](../02-kv-cache-attention-optimization/01-kv-cache) · [5.5.1 推测解码](../05-accelerated-decoding/01-speculative-decoding)
