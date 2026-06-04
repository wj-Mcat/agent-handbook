# 1.4.3 文本预处理与数据清洗

## 要解决的问题

原始网页、书籍、代码仓含 **噪声、重复、有害与低质** 内容；不清洗会浪费算力并污染模型行为。预处理是 **预训练数据流水线** 的第一步（见 [3.1 预训练数据](../../03-pre-training/01-pretraining-data/)）。

## 典型流水线

```mermaid
flowchart LR
  raw[原始语料] --> extract[抽取纯文本]
  extract --> norm[规范化]
  norm --> filt[质量过滤]
  filt --> dedup[去重]
  dedup --> tok[分词入口]
```

## 规范化（Normalization）

- Unicode 统一（NFKC）、繁简转换策略
- 空白、换行、HTML 实体清理
- 敏感信息脱敏（邮箱、身份证等，合规要求）

## 质量过滤

| 手段 | 说明 |
| --- | --- |
| 启发式 | 长度、符号比例、乱码检测 |
| 分类器 | FastText、小型 LM 打质量分 |
| 语言 ID | 保留目标语言比例 |
| 有害过滤 | 色情、暴力、PII 策略 |

代表数据集 **FineWeb、Dolma** 均公开过滤思路，见 [3.1.1 数据来源](../../03-pre-training/01-pretraining-data/01-data-sources)。

## 去重

- **精确去重**：SHA 行级/文档级
- **模糊去重**：MinHash、SimHash、嵌入近邻（防泄漏与记忆）

见 [3.1.2 数据清洗与去重](../../03-pre-training/01-pretraining-data/02-cleaning-deduplication)。

## 与 LLM 训练的衔接

清洗后文本进入 **BPE 训练与 tokenization**；配比进入 [3.1.4 数据混合](../../03-pre-training/01-pretraining-data/04-data-mixture)。版权与合规见 [3.1.5](../../03-pre-training/01-pretraining-data/05-data-licensing)。

## 参考链接

- [3.1.2 清洗与去重](../../03-pre-training/01-pretraining-data/02-cleaning-deduplication)
- [3.1.3 质量过滤](../../03-pre-training/01-pretraining-data/03-quality-filtering)
