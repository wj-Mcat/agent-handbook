# 前缀语言建模、Span Corruption

## 要解决的问题

纯 CLM 无法利用前缀双向上下文；纯 MLM 不适合标准自回归生成。**Prefix LM** 与 **Span Corruption**（T5 风格）在统一 Transformer 上兼顾「理解式填空」与「条件生成」，为 Encoder-Decoder 与 UL2 等多目标训练提供中间形态。

## 核心概念

**Prefix LM（非因果前缀）**

- 前缀 tokens：双向 self-attention；
- 后缀 tokens：因果 attention，且可看前缀；
- 损失常只算后缀（或含前缀部分位置）。

**Span Corruption（T5）**

- 将连续 span 替换为 sentinel `<extra_id_k>`；
- 解码器自回归生成被删 span 文本；
- 等价于多种 denoising 目标的集合。

| 模式 | 注意力模式 | 代表 |
| --- | --- | --- |
| CLM | 全因果 | GPT |
| Prefix LM | 块内双向 + 块间因果 | PaLM-2 部分、U-PaLM |
| Span Corruption | Enc-Dec 或 UL2 混合 | T5、UL2 |

UL2 用 **模式 token** 区分 Causal / Prefix / Span，实现 [3.3.5 多任务](./05-multitask-pretraining.md)。

## 方法/算法

Prefix LM 掩码矩阵示意（$P$=前缀，$S$=后缀）：

- $P$–$P$：可见
- $S$–$P$：可见
- $S$–$S$：下三角因果
- $P$–$S$：不可见

Span corruption 步骤：

1. 随机采样 span 长度分布（几何分布等）；
2. 替换输入中 span 为 sentinel；
3. 目标序列为串联的被删 span（带 sentinel 标记）；
4. Encoder 处理破坏输入，Decoder 生成目标串。

## 工程实践

- **Tokenizer**：T5 使用 SentencePiece + extra_id sentinels，见 [3.2.4](../02-tokenization/04-sentencepiece-unigram.md)。
- **实现复杂度**：高于单 CLM；需正确构造 attention mask 与 label shift。
- **现状**：开源大模型主流仍为 Decoder-only CLM；Prefix/Span 多见于 Google T5/Flan 系与部分 API 模型内部（公开细节有限）。
- **数据**：同一语料可随机切换模式，提升样本效率（UL2 论点）。

## 代表工作

- Raffel et al. T5：https://arxiv.org/abs/1910.10683
- Tay et al. UL2：https://arxiv.org/abs/2205.05131
- Chowdhery et al. PaLM：https://arxiv.org/abs/2204.02311

## 局限与注意点

- **推理对齐**：若主要服务 CLM API，训练过多 Span 模式可能需额外适配。
- **Sentinel 词表**：占用词表 ID，需与 [分词](./../02-tokenization/04-sentencepiece-unigram.md) 协同规划。
- **Encoder-Decoder 成本**：两栈参数与 cross-attn 增加训练与推理复杂度。
- **与 FIM 区别**：[3.3.4 FIM](./04-fim.md) 针对代码中间填空，常为 CLM 变体而非独立 Decoder。


## 延伸说明
UL2 在每个 batch 随机 mode token，需保证各模式采样比例与论文 recipe 接近。
## 实践检查清单
- [ ] sentinel
- [ ] Prefix
- [ ] T5

## 小结

本节核心：sentinel 与全链路 Prefix 协同；上线前用检查清单做回归。

## 相关章节

- 上一节：[3.3.2 MLM](./02-masked-lm.md)
- 下一节：[3.3.4 FIM](./04-fim.md)
- 多任务：[3.3.5](./05-multitask-pretraining.md)
- CLM：[3.3.1](./01-causal-lm.md)
