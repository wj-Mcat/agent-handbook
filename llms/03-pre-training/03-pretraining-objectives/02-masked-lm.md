# 掩码语言建模（MLM）

## 要解决的问题

纯左到右 CLM 在单遍编码时无法利用**右侧上下文**，对分类、匹配、抽取类表征不利。掩码语言建模（Masked LM）随机遮盖部分 token 并预测原值，训练**双向**表征，奠定 BERT 及大量 Encoder 预训练基础。

## 核心概念

随机选取约 15% 位置做 mask，BERT 策略：

- 80% 替换为 `[MASK]`
- 10% 随机 token
- 10% 保持不变

损失仅在被 mask 位置计算：

$$
\mathcal{L}_{\text{MLM}} = -\sum_{t \in \mathcal{M}} \log p_\theta(x_t \mid x_{\setminus \mathcal{M}})
$$

其中 $x_{\setminus \mathcal{M}}$ 为带 mask 的完整输入，模型双向可见（非因果掩码）。

| 变体 | 说明 |
| --- | --- |
| **Whole Word Masking** | 掩掉整词（WordPiece 对齐） |
| **SpanBERT** | 掩连续 span |
| **ELECTRA** | 替换 token 判别（非 MLM 但相关） |

## 方法/算法

训练流程：

1. 输入序列 → 随机选 mask 集合 $\mathcal{M}$；
2. Encoder 输出每个位置 hidden $h_t$；
3. 仅在 $t \in \mathcal{M}$ 接 MLM head（共享 embedding 权重常见）；
4. softmax  over 词表预测原 token。

**NSP（下一句预测）** 曾随 BERT 使用，后续 RoBERTa 等证明可去掉。Decoder-only 时代 MLM 多用于 **嵌入模型**（BGE、E5）而非主生成 LLM。

## 工程实践

- **推理**：MLM 本身不直接生成；生成需额外头或改用 Encoder-Decoder。
- **动态 mask**：每 epoch 不同 mask 提升数据效率。
- **与 CLM 对比**：同样 1B 参数，MLM 在 MNLI 等可能更强，CLM 在开放生成更强（规模定律下差距缩小，待验证）。
- **工具**：`transformers` `BertForMaskedLM`。

## 代表工作

- Devlin et al. BERT：https://arxiv.org/abs/1810.04805
- Liu et al. RoBERTa：https://arxiv.org/abs/1907.11692
- Clark et al. ELECTRA：https://arxiv.org/abs/2003.10555

## 局限与注意点

- **[MASK] 预训练-微调不一致**：微调无 MASK token，依赖自适应能力。
- **生成需解码器**：纯 Encoder MLM 不适合长文本自回归生成。
- **长序列成本**：双向注意力 $O(T^2)$，与 [FlashAttention](../../05-inference-deployment/02-kv-cache-attention-optimization/03-flash-attention.md) 仍贵于推理侧 KV 复用场景。
- **主 LLM 范式**：工业界万亿模型以 CLM 为主，MLM 见 [3.3.5 多任务](./05-multitask-pretraining.md) 混合。


## 延伸说明
15% 为 BERT 默认；提高 mask 比例会增难度但可能损生成迁移（待验证）。
## 实践检查清单
- [ ] WWWM
- [ ] ELECTRA
- [ ] 双向

## 小结

本节核心：WWWM 与全链路 ELECTRA 协同；上线前用检查清单做回归。


## MLM 与 CLM 能力迁移（个人理解，待验证）

| 能力 | MLM 预训练 | CLM 预训练 |
| --- | --- | --- |
| 抽取式 QA | 常更强 | 需规模弥补 |
| 长文生成 | 弱 | 强 |
| 嵌入检索 | 强 | 需专门 contrastive |

工业界生成 LLM 以 CLM 为主；MLM 仍广泛用于 embedding 与双塔检索。

## 相关章节

- 上一节：[3.3.1 CLM](./01-causal-lm.md)
- 下一节：[3.3.3 Prefix / Span](./03-prefix-lm-span-corruption.md)
- WordPiece：[3.2.3](../02-tokenization/03-wordpiece.md)
- 架构：[2.2 范式](../../02-transformer/02-transformer-details/03-architecture-paradigms.md)
