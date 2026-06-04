# 4.2.1 FLAN、T0、Self-Instruct

## 要解决的问题

预训练模型不会自动把「翻译」「摘要」「问答」统一成 **自然语言指令** 接口。早期工作证明：将大量 NLP 任务改写成 `(instruction, input, output)` 并混合微调，可显著提升 **零样本指令遵循**。本节梳理三条奠基路线：**FLAN / Flan-PaLM**（任务格式化）、**T0**（多任务 prompt 排序）、**Self-Instruct**（模型自举扩数据）。

## 核心概念

| 工作 | 核心思想 | 数据规模级 |
| --- | --- | --- |
| **FLAN** | 将 60+ 数据集转为指令模板，多任务 SFT | 数百任务、百万级样本 |
| **T0** | 用 prompt 多样性训练，强调 **同一任务多表述** | 多数据集组合 |
| **Self-Instruct** | 175 种子 → 模型生成指令与实例 → 过滤 | ~52k 英文指令 |

Self-Instruct 流水线：

```mermaid
flowchart LR
  seed[人工种子任务] --> gen[LLM 生成新指令]
  gen --> inst[生成 input/output]
  inst --> filt[规则+ROUGE 过滤]
  filt --> sft[SFT 小模型]
```

## 方法 / 技术要点

### FLAN

- **Prompt 模板库**：同一任务多种自然语言问法（「translate to French」/「把下面句子译成法语」）。
- **选项式与生成式** 任务统一为文本生成。
- **Flan-PaLM** 将配方放大到 PaLM 规模，展示 **指令微调 + 规模** 的协同。

### T0

- 基于 T5 encoder-decoder，强调 **ranked classification** 式多任务训练。
- 对 **prompt 来源**（人工 / 聚类 / 随机）做系统比较，结论支持 **高质量多样化 prompt**。

### Self-Instruct

1. 生成 **任务指令**（分类：是否需 input）。
2. 生成 **实例**（input/output）。
3. 过滤：过短、重复、ROUGE-L 与已有样本过近。
4. 用 **GPT-3 类教师** 标注，学生为小模型（个人理解：教师-学生鸿沟仍存在）。

本仓库领读：[Self-Instruct](/paper-reading/agentic/self-instruct)。

## 工程实践

- 复现 Self-Instruct 时优先控制 **种子多样性**（学科、语言、难度），否则扩写出同质 FAQ。
- FLAN 式 **模板数** 与训练算力线性相关；可先做 **任务子集 ablation**。
- 与纯 [SFT](../01-sft/01-sft-overview) 关系：指令微调是 SFT 的 **数据组织范式**，非新损失函数。

## 代表工作

- Chung et al., 2022 — **Scaling Instruction-Finetuned Language Models (FLAN)**.
- Sanh et al., 2022 — **Multitask Prompted Training (T0)**.
- Wang et al., 2022 — **Self-Instruct**（[领读](/paper-reading/agentic/self-instruct)）.

## 局限与注意点

- Self-Instruct 数据 **英语中心**，直接用于中文需重种子或翻译+校对。
- 多任务混合比例极大影响结果；无公开最优配比时勿声称复现 SOTA。
- 仅指令微调 **不解决** 有害输出与人类偏好排序（需 [RLHF](../03-rlhf/01-rlhf-pipeline) / [DPO](../04-preference-optimization/01-dpo)）。

## FLAN 模板设计要点

- **零样本 vs 少样本**：模板中是否插入 exemplar 影响评测口径，训练与推理要一致。
- **任务指令动词**：统一用「请…」「给定…」等，减少模型对隐式格式的依赖。
- **负例模板**：部分任务加入「无法回答」示范，可降低幻觉式强行作答（个人理解：收益因任务而异）。

## Self-Instruct 复现检查清单

- [ ] 种子任务 ≥ 175 且覆盖多领域
- [ ] ROUGE 去重阈值与论文一致
- [ ] 生成模型版本记录（教师升级会导致不可复现）
- [ ] 过滤后统计 **任务类型分布** 直方图，避免 80% 都是「写邮件」

## 相关章节

- [4.2.2 Alpaca、Vicuna、WizardLM](./02-alpaca-vicuna-wizardlm)
- [4.2.3 高质量指令数据](./03-high-quality-instruction-data)
- [4.1.2 SFT 数据构造](../01-sft/02-data-construction)
