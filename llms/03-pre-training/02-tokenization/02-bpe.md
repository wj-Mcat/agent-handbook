# BPE（Byte Pair Encoding）

## 要解决的问题

词级词表无法覆盖开放域新词；字符级序列过长。BPE 通过**迭代合并高频相邻符号对**，在固定词表大小下自动发现子词单元，成为 GPT 系、LLaMA、许多开源模型的默认分词算法。

## 核心概念

初始词表为字节或字符集合 $\mathcal{V}_0$。重复 $K$ 次：

1. 统计语料中相邻对 $(a,b)$ 频率；
2. 选最高频对合并为新符号 `ab`；
3. $\mathcal{V} \leftarrow \mathcal{V} \cup \{\text{ab}\}$，直到 $|\mathcal{V}| = V_{\text{target}}$。

编码时：对未知词从左到右**贪心应用**已学 merges（按训练时的合并优先级顺序）。

| 对比项 | BPE | WordPiece |
| --- | --- | --- |
| 合并准则 | 频率 | 似然增益 |
| 代表模型 | GPT-2/3、LLaMA | BERT |

## 方法/算法

训练伪代码逻辑：

```
corpus → 初始序列（字节或 Unicode 字符）
while vocab_size < target:
    pair = argmax count(a,b)
    merge(a,b) → new_token
    record merge rule
```

推理编码：

```
while 可继续合并:
    应用优先级最高的合法 merge
map 子词 → id
```

**Byte-level BPE**：初始符号为 256 个字节，任意 UTF-8 文本可表示，避免 UNK。详见 [3.2.5](./05-byte-level-bpe-tiktoken.md)。

## 工程实践

- **Hugging Face `tokenizers`**：BPE 训练速度快，支持 pretokenization（GPT-2 正则切分）。
- **词表 32k vs 100k**：更大词表缩短序列但增大 embedding 矩阵；与 [混合精度训练](../06-training-stability/01-mixed-precision.md) 下 softmax 成本相关。
- **保存 artifacts**：`vocab.json` + `merges.txt` 或单一 `tokenizer.model`。
- **复现**：训练语料、正则 pretokenizer、NFKC 必须固定。

## 代表工作

- Sennrich et al.（2016）：https://arxiv.org/abs/1508.07909
- GPT-2 分词说明（Radford et al.）：https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf
- tiktoken 实现（OpenAI）：https://github.com/openai/tiktoken

## 局限与注意点

- **贪心编码非全局最优**：同一词可能有多种切分，训练与推理需同一 merge 表。
- **多语言**：在英文上训练的 BPE 对中文常出现单字 token 过多，压缩率差。
- **数字与代码**：频繁合并 `0` `1` 或缩进空格，影响算术 benchmark（待验证：需任务级评测）。


## 延伸说明
推理时必须与训练完全相同的 merge 顺序；合并 `merges.txt` 勿手工编辑。
## 实践检查清单
- [ ] tiktoken
- [ ] pretokenizer
- [ ] 词表

## 小结

本节核心：tiktoken 与全链路 pretokenizer 协同；上线前用检查清单做回归。

## 相关章节

- 上一节：[3.2.1 分词层级](./01-tokenization-levels.md)
- 下一节：[3.2.3 WordPiece](./03-wordpiece.md)
- 字节 BPE：[3.2.5 Tiktoken](./05-byte-level-bpe-tiktoken.md)
- 多语言：[3.2.6](./06-multilingual-tokenization.md)
