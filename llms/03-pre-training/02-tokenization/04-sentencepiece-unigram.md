# 3.2.4 SentencePiece、Unigram

## 要解决的问题

传统 BPE/WordPiece 依赖**预分词**（空格、标点规则），对中文、日文、泰文等无空格语言不友好，且空格处理不一致会导致训练/推理偏差。SentencePiece 将文本视为**原始 Unicode 序列**，在同一框架下支持 Unigram 与 BPE，成为 T5、ALMA、许多多语模型的首选。

## 核心概念

**SentencePiece** 特性：

- 无 pretokenization：`_`（U+2581）表示词边界空格；
- 纯数据驱动训练；
- 同一二进制 `spm.model` 供 C++/Python 使用。

**Unigram Language Model** 分词：维护子词词表 $\mathcal{V}$，对句子 $x$ 选择切分 $\mathbf{s}$ 使

$$
P(x) \approx \prod_{t \in \mathbf{s}} p(t), \quad p(t) \text{ 由 EM 估计}
$$

训练时从大到小**剪枝**低概率子词；编码用 Viterbi 或贪心取最大概率切分。

| 算法 | SP 模式 | 代表 |
| --- | --- | --- |
| Unigram | `unigram` | T5、mT5 |
| BPE | `bpe` | 部分多语 LLM |

## 方法/算法

训练（Unigram）概要：

1. 初始化大子词候选集（字符 n-gram 或频繁子串）；
2. EM：固定切分估计 $p(t)$；固定 $p(t)$ 用 Viterbi 找最优切分；
3. 删除使似然下降最小的 token，直到 $|V|=V_{\text{target}}$；
4. 导出 `sentencepiece.model`。

编码：

```
pieces = sp.EncodeAsPieces(text)  # 或 EncodeAsIds
text' = sp.DecodePieces(pieces)
```

## 工程实践

- **命令行**：`spm_train --input=corpus.txt --model_prefix=m --vocab_size=32000 --model_type=unigram`。
- **与 T5 前缀 LM 对齐**：SP 边界与 [3.3.3 Prefix LM](../03-pretraining-objectives/03-prefix-lm-span-corruption.md) 掩码策略需一致。
- **多语**：在混合语料上训练一个 SPM，语种比例与 [数据混合](../01-pretraining-data/04-data-mixture.md) 一致。
- **LLaMA 2+**：部分模型改用 BPE 但仍可用 SP 训练 BPE 模式。

## 代表工作

- Kudo & Richardson, SentencePiece：https://arxiv.org/abs/1808.06226
- Kudo, Unigram LM：https://arxiv.org/abs/1804.10920
- Raffel et al. T5：https://arxiv.org/abs/1910.10683

## 局限与注意点

- **`_` 空格**：解码时需 `sentencepiece.Normalize` 配置一致，否则复制粘贴丢空格。
- **比 BPE 慢**：Unigram Viterbi 编码略慢于纯 BPE 贪心（通常可忽略）。
- **词表与 CLM**：与 [因果 LM](../03-pretraining-objectives/01-causal-lm.md) 结合无特殊要求，但特殊 token 需在 `spm_train` 中 `--user_defined_symbols` 注册。


## 延伸说明
解码后 `_` 还原为空格；多语训练勿混用不同 `normalization_rule_name`。
## 实践检查清单
- [ ] Viterbi
- [ ] T5
- [ ] unigram

## 小结

本节核心：Viterbi 与全链路 T5 协同；上线前用检查清单做回归。

## 相关章节

- 上一节：[3.2.3 WordPiece](./03-wordpiece.md)
- 下一节：[3.2.5 Byte-level BPE](./05-byte-level-bpe-tiktoken.md)
- 多语言：[3.2.6](./06-multilingual-tokenization.md)
- Span 破坏：[3.3.3 Prefix / Span](../03-pretraining-objectives/03-prefix-lm-span-corruption.md)
