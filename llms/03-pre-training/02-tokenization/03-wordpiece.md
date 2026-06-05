# WordPiece

## 要解决的问题

BERT 时代需要在固定词表内最大化语料似然，同时保持子词可组合性。WordPiece 与 BPE 类似但**合并准则基于似然**而非单纯频率，成为 Encoder 模型（BERT、RoBERTa 中文）的经典选择。

## 核心概念

设当前词表 $\mathcal{V}$，合并候选 $(x, y)$ 的收益常表述为训练语料似然增量 $\Delta L(x,y)$。WordPiece 选择使

$$
\Delta L(x,y) = \log \frac{P(xy)}{P(x)\,P(y)}
$$

最大的对进行合并（实现上可用互信息或频率近似）。子词前缀常用 `##` 表示非词首片段（BERT 约定），如 `playing` → `play` + `##ing`。

| 特性 | WordPiece | BPE |
| --- | --- | --- |
| 合并规则 | 似然 / 互信息 | 频率 |
| 典型前缀 | `##` | 无统一前缀 |
| 架构 | Encoder MLM | Decoder CLM |

## 方法/算法

训练流程概要：

1. 初始化单字符（或基础单元）词表；
2. 重复：评估所有相邻对 $(a,b)$ 的得分，合并最高分且仍满足词表预算的对；
3. 导出 vocab 与合并表；
4. 编码：最长匹配或贪心应用 WordPiece 规则。

与 [MLM 目标](../03-pretraining-objectives/02-masked-lm.md) 配合时，mask 在 **WordPiece token** 边界进行；整词 mask（whole word masking）需额外映射表。

## 工程实践

- **TensorFlow Text / Hugging Face**：`BertTokenizer` 加载 `vocab.txt`。
- **中文 BERT**：按字初始化再 WordPiece 合并较少见，更多直接用 **字符 + 词片段** 混合词表（Whole Word Masking 在字级上扩展）。
- **迁移**：WordPiece 词表与 GPT BPE **不兼容**，换 tokenizer 需从头预训练或做 embedding 映射实验（效果通常有限）。

## 代表工作

- Schuster & Nakajima（2012）日语/英语语音：https://research.google/pubs/archive/37842.pdf
- Devlin et al. BERT：https://arxiv.org/abs/1810.04805
- Wu et al. 多语言 BERT：https://arxiv.org/abs/1810.04805

## 局限与注意点

- **Decoder-only 少用**：自回归模型生态以 BPE/SPM 为主，WordPiece 主要服务 Encoder 与 Encoder-Decoder。
- **`##` 语义**：仅训练便利，模型需自行学习子词组合。
- **词表扩展**：新增 token 需重训或至少长程微调 embedding 行。


## 与 BPE 合并准则对比（公式）

WordPiece 选对的分数与互信息相关：$\log P(ab)/(P(a)P(b))$；BPE 仅看 count。

## 实践检查清单
- [ ] 对齐 BERT 词表与 Whole Word Mask 映射
- [ ] 微调阶段不使用 `[MASK]` token
- [ ] 导出 vocab 与 merges 版本号

## 小结

WordPiece 适合 Encoder/MLM；生成式 LLM 主流已转向 BPE/SPM。


## 编码示例（概念）

`unbelievable` → `un`、`##believ`、`##able`（示意）。模型需学习 `##` 片段与词首片段组合语义。

## 与下游任务

| 任务 | 建议 |
| --- | --- |
| 分类/匹配 | WordPiece + MLM 仍强 |
| 开放生成 | 优先 BPE/SPM + CLM |
| 嵌入模型 | 可继续 WordPiece 词表 |

## 相关章节

- 上一节：[3.2.2 BPE](./02-bpe.md)
- 下一节：[3.2.4 SentencePiece](./04-sentencepiece-unigram.md)
- MLM：[3.3.2](../03-pretraining-objectives/02-masked-lm.md)
- 层级：[3.2.1](./01-tokenization-levels.md)
