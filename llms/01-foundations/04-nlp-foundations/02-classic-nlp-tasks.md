# 1.4.2 经典 NLP 任务（分类、序列标注、机器翻译、QA）

## 要解决的问题

在 LLM 统一范式出现之前，NLP 按 **任务类型** 拆分模型与数据集。了解经典任务有助于：设计 **评测基准**、构建 **SFT 数据**、理解 **专用模型是否仍必要**。

## 任务概览

| 任务 | 输入→输出 | 典型模型（前 LLM 时代） | LLM 时代 |
| --- | --- | --- | --- |
| **文本分类** | 文本→标签 | BERT+分类头 | Prompt + 生成标签 |
| **序列标注** | 序列→标签序列 | BiLSTM-CRF、BERT | 生成 JSON / 指针 |
| **机器翻译** | 源语言→目标语言 | Seq2Seq、Transformer | 大模型零样本/少样本翻译 |
| **抽取式 QA** | 段落+问题→片段 | BERT span | RAG + 生成答案 |
| **生成式 QA** | 上下文+问题→自由文本 | T5、BART | GPT 类直接生成 |
| **摘要** | 文档→短文 | BART、PEGASUS | 指令「请总结」 |
| **对话** | 多轮历史→回复 | 专用对话系统 | ChatGPT 类统一 |

## 评测指标

分类：Accuracy、F1；翻译/摘要：BLEU、ROUGE（见 [1.4.4 NLP 指标](./04-nlp-metrics)）。LLM 时代仍沿用部分指标，但 **开放式生成** 更依赖人工或 LLM-as-Judge（[7.2.2](../../07-evaluation/02-evaluation-methods/02-llm-as-judge)）。

## 从专用模型到统一生成

```mermaid
flowchart LR
  era1[每任务一模型]
  era2[预训练_微调]
  era3[一个LLM_提示词]
  era1 --> era2 --> era3
```

**指令微调** 将多任务统一为 `(instruction, input) → output` 格式（见 [4.2 指令微调](../../04-post-training-alignment/02-instruction-tuning/)）。

## 何时仍需要专用模型

- **极低延迟、极小体积**：端侧分类器
- **结构化约束极强**：工业 OCR 后处理
- **成本**：海量简单分类可用小模型

## 参考链接

- [1.4.4 评估指标](./04-nlp-metrics)
- [4.1 SFT 概览](../../04-post-training-alignment/01-sft/01-sft-overview)
