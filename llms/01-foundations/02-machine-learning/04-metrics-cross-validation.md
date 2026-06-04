---
sidebar_position: 4
title: 1.2.4 评估指标与交叉验证
---

# 评估指标与交叉验证

**训练损失**（如交叉熵）是优化目标；**评估指标**（Metric）用于在验证集、测试集或公开基准上衡量模型能力，并指导超参选择与模型对比。二者相关但不等价：loss 持续下降时，下游 Acc、pass@k 等未必同步提升（见 [1.2.2 损失函数与正则化](./02-loss-regularization.md) 中「与评估指标脱节」的讨论）。

本文从机器学习通用指标出发，系统梳理 **LLM 全链路**（预训练 → 中期训练 → 对齐 → 推理 → Agent）常见指标，并说明在不同**学习范式**下通常关注哪些度量。生成类 NLP 指标（BLEU、ROUGE 等）的细节见 [1.4.4 评估指标](../04-nlp-foundations/04-nlp-metrics.md)；基准套件与评估方法论见第七部分 [评估](../../07-evaluation/)。

:::tip 延伸阅读
- 指标与损失综述：[Loss Functions and Metrics in Deep Learning](https://arxiv.org/pdf/2307.02694)（2023）
- Hugging Face 指标库：[evaluate/metrics](https://github.com/huggingface/evaluate/tree/main/metrics)
- 代码能力评估：[Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374)（HumanEval / pass@k）
- LLM 评估综述：[A Survey on Evaluation of Large Language Models](https://arxiv.org/abs/2307.03109)
:::

---

## 一、指标在 LLM 流程中的位置

| 阶段 | 典型任务 | 常用训练目标 | 常用**评估**指标 |
| ---- | -------- | ------------ | ---------------- |
| 预训练（Pre-training） | 下一 token 预测 | 交叉熵 / NLL | **PPL**、验证集 loss、下游 probe |
| 继续预训练 / 领域适配（Continued Pre-training） | 同左，注入领域或语言知识 | 交叉熵 | PPL + 领域基准 **Acc** |
| **中期训练（Mid-Training）** | 在通用语料与后训数据之间**桥接分布**；定向强化数学、代码、推理、长上下文等 | 多为**下一 token 预测**（与预训练同目标）；数据更精选、配比更讲究 | **PPL** + 能力探针（GSM8K、HumanEval、MMLU 子集等）；关注相对预训练的**边际增益**与对后续 SFT/RL 的**warm-up 效果** |
| SFT / 指令微调 | 监督生成 | 交叉熵（通常仅 response 段） | EM、F1、ROUGE、任务 Acc |
| 偏好对齐（RLHF / DPO） | 排序 / 策略优化 | 奖励、偏好损失 | **Win rate**、RM 分、KL、安全率 |
| 推理强化（RLVR / GRPO） | 可验证答案 | 规则奖励 | **Solve rate**、pass@k |
| 部署与产品 | 对话、工具、Agent | — | 人工评分、Arena Elo、任务成功率 |

理解「优化什么」与「汇报什么」分离，有助于读论文技术报告和复现基准结果。

### Mid-Training 是什么

**Mid-Training（中期训练）** 是近年被单独划出、介于**通用预训练**与**后训练（SFT / RL）** 之间的阶段：仍在大规模语料上采用**下一 token 预测**为主（与 SFT 的「只对回答算 loss」、RL 的奖励优化不同），但通过**更小规模、更高质量、更偏领域**的数据混合，在保持通用能力的同时，系统性拉高数学、代码、推理、指令跟随、长上下文等能力，并为后训提供更合适的初始化（见 [A Survey on LLM Mid-Training](https://arxiv.org/abs/2510.23081)、[Midtraining Bridges Pretraining and Posttraining Distributions](https://arxiv.org/abs/2510.14865)）。

与 **继续预训练（Continued Pre-training）** 的区分（综述中的常见界定）：

| | **Mid-Training** | **Continued Pre-training** |
| --- | --- | --- |
| **意图** | 有意识地在「预训练分布 ↔ 后训分布」之间**过渡** | 主要在已有模型上**追加**领域或语言数据 |
| **数据** | 通用高质量语料 + 数学 / 代码 / STEM / 指令形态数据等**混合配比**；常配合退火（annealing）、长上下文扩展 | 往往以目标领域语料为主 |
| **规模** | 通常满足 $\|D_{\text{pre}}\| > \|D_{\text{mid}}\| > \|D_{\text{SFT}}\|$，算力介于预训练与微调之间 | 可长可短，不一定强调分布桥接 |
| **风险** | 若配比不当仍可能伤通用能力，但设计上常**保留一定通用数据比例**以抑制遗忘 | 领域占比过高时更易出现灾难性遗忘 |

工业与开源实践中的 Mid-Training 常见做法包括：

- **数据退火（Annealing）**：预训练末期降低学习率，并混入高质量、高难度数据（数学、代码等），使 loss 收敛到更优局部极小（Phi、OLMo 2 等路线）。
- **长上下文扩展**：在中后期提高长序列数据占比，并配合架构 / 位置编码调整（与 [技术栈概览](../01-introduction/03-tech-stack-overview.md) 中的「多阶段预训练」「长文预训练」呼应）。
- **精选混合**：IBM 等实验表明，在**已完成长上下文扩展**的基座上做 Mid-Training 往往更划算；数学 + 代码 + 科学推理的混合配方对推理基准的提升，可明显大于仅在 RL 阶段调换同类数据（见 [IBM — Mid-training for reasoning](https://research.ibm.com/blog/mid-training-for-better-ai-reasoning)）。

**该阶段应看什么指标**：训练侧仍盯 **验证 PPL / NLL**（与预训练可比）；能力侧应同时看**领域基准**（如 GSM8K solve rate、HumanEval pass@1、MMLU STEM 子集 Acc），并最好记录 **Mid → SFT → RL** 各阶段的**相对提升**，因为 Mid-Training 的价值常体现在「后训是否更省数据、更少遗忘、RL 是否更易放大」——仅看 Mid 结束时的单点 Acc 容易低估其桥梁作用（见 [On the Interplay of Pre-Training, Mid-Training, and RL](https://arxiv.org/abs/2512.07783)）。

---

## 二、分类与检索类通用指标

将模型输出离散化为「正 / 负」或「正确 / 错误」后，可用经典混淆矩阵指标。LLM 场景中常见于：**多选题基准**（MMLU）、**拒答 / 安全分类**、**检索是否命中**、**代码单测是否通过**（二分类）。

设 TP、FP、TN、FN 为真阳、假阳、真阴、假阴：

| 指标 | 公式 | 含义 | LLM 典型用法 |
| ---- | ---- | ---- | ------------ |
| **Accuracy（Acc）** | $\dfrac{TP+TN}{TP+TN+FP+FN}$ | 全部样本中判对的比例 | MMLU 选项命中率；SWE-bench 任务级通过率 |
| **Precision** | $\dfrac{TP}{TP+FP}$ | 预测为正的样本里，真正为正的比例 | 高精确要求场景（少误报）：有害内容拦截、错误 patch 提交 |
| **Recall** | $\dfrac{TP}{TP+FN}$ | 真实为正样本中，被找出的比例 | 高召回场景：漏检代价大（如必须检出违规回复） |
| **F1** | $2 \cdot \dfrac{P \cdot R}{P + R}$ | Precision 与 Recall 的调和平均 | 抽取式 QA、NER、多标签分类；类不平衡时常用 **Macro-F1** |
| **ROC-AUC** | 曲线面积 | 排序能力（阈值无关） | 奖励模型、检索 reranker 质量 |

**Macro / Micro**：多类别时，Micro 按样本聚合 TP/FP/FN；Macro 先算各类 F1 再平均，对**长尾类**更敏感。

:::note 与 loss 的关系
分类训练常优化交叉熵，但业务更关心 F1 或 Acc。类别极不平衡时，应同时看 Precision–Recall 曲线，而非只看 Acc。
:::

---

## 三、语言建模与预训练指标

自监督预训练（见 [1.2.1 学习范式](./01-learning-paradigms.md) 中「无监督预训练」）直接优化 token 级交叉熵，评估时常报告：

### 3.1 交叉熵与负对数似然（NLL）

对序列 $x_{1:T}$，平均 token 负对数似然：

$$
\text{NLL} = -\frac{1}{T}\sum_{t=1}^{T} \log p_\theta(x_t \mid x_{<t})
$$

与训练 loss 一致，便于监控过拟合与数据混合效果。

### 3.2 困惑度（Perplexity, PPL）

$$
\text{PPL} = \exp(\text{NLL})
$$

可直观理解为「模型平均在多少个等概率候选 token 间犹豫」。**PPL 越低越好**。不同分词器、词表大小之间 **不宜直接横比**；同一设定下可用于比较 checkpoint 与数据配比。

### 3.3 其他

- **BPC**（bits per character）：字符级语言模型常用。
- **Token Accuracy**：下一 token 预测正确的比例；比 PPL 粗糙，但有时更直观。
- **下游探针（Probe）**：冻结表示、训练小分类器，间接衡量表示质量（非端到端生成能力）。

---

## 四、生成与开放域问答指标

当参考答案为**文本**而非单一选项时，常用重叠度、匹配度或语义相似度指标（详见 [1.4.4](../04-nlp-foundations/04-nlp-metrics.md)）：

| 指标 | 要点 | 常见场景 |
| ---- | ---- | -------- |
| **BLEU** | n-gram 精确率 + 简短惩罚 | 机器翻译 |
| **ROUGE-N / ROUGE-L** | 召回导向 n-gram / 最长公共子序列 | 摘要 |
| **METEOR** | 同义词、词干 | 翻译、摘要 |
| **chrF / chrF++** | 字符级 F-score | 形态丰富语言 |
| **BERTScore** | 上下文嵌入相似度 | 开放生成、释义 |
| **Exact Match (EM)** | 规范化后字符串完全一致 | SQuAD 类 QA、短答案 |
| **Token F1** | 预测与参考答案 token 集合 F1 | 抽取式 QA |

**局限**：n-gram 类指标与「语义正确但表述不同」不对齐；长文本生成更依赖 **LLM-as-a-Judge** 或人工评估（见 [7.2](../../07-evaluation/02-evaluation-methods/)）。

---

## 五、推理、数学与代码能力指标

### 5.1 解题率（Solve Rate / Pass Rate）

对 GSM8K、MATH、GPQA 等题，从模型输出中**解析最终答案**（如 `\boxed{}` 或最后一行数字），与标准答案比对。报告 **pass@1**（单次采样）或 **maj@k**（k 次采样多数投票）。

### 5.2 pass@k 与 pass^k

来自 [HumanEval](https://arxiv.org/abs/2107.03374) 等代码基准：

- **pass@k**：对每道题生成 $n \ge k$ 个样本，若**至少一个**通过单测，则该题计为通过；再在题目上取平均。衡量「给 k 次机会能解出来吗」。
- **pass^k**：k 次独立采样**全部**通过的概率（更严格）。

实现上常对无放回采样做无偏估计（原论文附录）。**HumanEval**、**MBPP**、**LiveCodeBench** 等均采用此类指标。

### 5.3 软件工程基准

- **SWE-bench**：对真实 GitHub Issue 生成 patch，在容器内跑项目单测；任务级 Acc = 单测全部通过的比例。
- **CodeBLEU**：在 BLEU 基础上加入 AST、数据流匹配，用于代码生成质量。

---

## 六、综合知识与能力基准（Benchmark Acc）

业界常将多任务套件上的 **Accuracy 或得分** 作为「通用能力」名片，需注意任务形式与污染问题（见 [7.2.4 可靠性](../../07-evaluation/02-evaluation-methods/04-reliability-contamination.md)）：

| 类别 | 代表基准 | 主要指标 |
| ---- | -------- | -------- |
| 综合知识 | MMLU、MMLU-Pro、BIG-Bench、HELM | 多选题 **Acc**、归一化得分 |
| 推理 | ARC、HellaSwag、WinoGrande | Acc |
| 数学 | GSM8K、MATH、AIME 子集 | Solve rate / Acc |
| 代码 | HumanEval、MBPP、SWE-bench | pass@k、Acc |
| 中文 | C-Eval、CMMLU、SuperCLUE | Acc、综合榜 |
| 多模态 | MMMU、MathVista | Acc |
| Agent | WebArena、OSWorld | **任务成功率**、步骤数 |

同一论文可能同时报 **5-shot / 0-shot**、**CoT** 与否，对比模型时须对齐设置。

---

## 七、对齐、偏好与人类反馈指标

后训练阶段（RLHF、DPO、RLAIF 等）优化的是**人类偏好**或**可验证奖励**，评估指标与预训练显著不同：

| 指标 | 含义 |
| ---- | ---- |
| **Win Rate / Preference Rate** | 在成对比较中，模型 A 被选为优于 B 的比例 |
| **Reward Model Score** | 学习器对人类排序拟合的标量分 |
| **KL(π\_θ ‖ π\_ref)** | 当前策略相对参考模型的偏移；过大可能「模式坍塌」或胡言 |
| **长度 / 重复惩罚** | 辅助监控 reward hacking |
| **MT-Bench / AlpacaEval** | 多轮对话质量，常配合 GPT-4 打分 |
| **Arena Elo** | 众包对战排序的 Elo 分（如 Chatbot Arena） |
| **安全性** | 拒答率、有害率、越狱成功率 |
| **Helpfulness / Truthfulness** | 对齐维度（见 [1.4.4](../04-nlp-foundations/04-nlp-metrics.md)） |

**RLVR**（可验证奖励强化学习，如 DeepSeek-R1 路线）更依赖 **规则判题**：数学答案对错、代码单测、单元测试，指标回归 **pass@k / solve rate**，而非人类打分。

---

## 八、Agent 与工具使用指标

| 指标 | 说明 |
| ---- | ---- |
| **Task Success Rate** | 多步任务是否达到目标状态（如订票成功、Issue 关闭） |
| **Step Efficiency** | 达成目标所需步数或 token |
| **Tool Call Accuracy** | 工具名、参数 JSON 是否正确 |
| **Recovery Rate** | 错误工具调用后能否自我纠正 |

与静态 QA 不同，Agent 评估强依赖**环境交互**与**可复现沙箱**，方差通常更大。

---

## 九、交叉验证与 LLM 上的验证策略

### 9.1 经典 k 折交叉验证（k-Fold CV）

将训练集划分为 $k$ 份，轮流以 1 份作验证、$k-1$ 份作训练，共训练 $k$ 个模型，指标取平均（及标准差）。用于：

- 小样本表格学习、传统 NLP 分类；
- 超参搜索（学习率、weight decay）时**稳定估计泛化误差**（与 [1.2.3 偏差–方差](./03-bias-variance.md) 中高方差时需多次划分呼应）。

### 9.2 LLM 实践中的常见替代

全量预训练成本极高，通常**不做** k-fold，而采用：

| 策略 | 做法 |
| ---- | ---- |
| **Hold-out 验证集** | 从预训练语料中留出固定验证集，监控 PPL / loss |
| **固定公开测试集** | MMLU、HumanEval 等；报告 0-shot / few-shot 协议 |
| **早停（Early Stopping）** | 验证 loss 或下游 proxy 不再提升则停训 |
| **Bootstrap / 多次采样** | 对生成任务用 pass@k、置信区间 |
| **时间切分** | 用「未来数据」测泄漏与持续学习（见下节） |

### 9.3 数据污染与评估有效性

基准题目若出现在预训练语料中，Acc 会**虚高**。缓解方式包括：n-gram 重叠检测、held-out 基准、动态新题（LiveBench 等）。评估论文结论时，应同时看**训练数据截止时间与测试集发布时间**。

---

## 十、不同学习范式下常用指标对照

[1.2.1 学习范式](./01-learning-paradigms.md) 从「终生学习 / 持续学习」角度讨论了知识记忆、前向迁移与灾难性遗忘。结合经典三分法与 LLM 工业流程，各范式下**优先关注的指标**可归纳如下：

| 学习范式 | 数据与标签 | 训练目标（典型） | **主要评估指标** | 备注 |
| -------- | ---------- | ---------------- | ---------------- | ---- |
| **监督学习** | 输入–输出对（标注答案、标签） | 交叉熵、MSE | **Acc / F1 / EM**；任务专用（ROUGE、pass@k） | SFT、分类头微调、判别式 RM |
| **无监督学习** | 无标签；聚类、密度估计 | 重构误差、聚类目标 | 轮廓系数、NMI；LLM 中较少单独报 | 纯聚类在 LLM 主流程中不常见 |
| **自监督学习** | 从原始文本构造监督信号（如下一 token） | 交叉熵 | **PPL / NLL**；+ 下游基准 Acc | **预训练**主体；「无监督预训练」常指此 |
| **半监督 / 弱监督** | 少量标注 + 大量无标 | 一致性正则、伪标签 | 有标子集 Acc + 全集 proxy | 数据标注成本敏感时 |
| **强化学习 / 偏好学习** | 奖励、排序、规则判题 | PPO、GRPO、DPO 等 | **Win rate、RM 分、KL**；RLVR 用 **solve rate / pass@k** | RLHF、RLAIF、DeepSeek-R1 类 |
| **持续 / 终生学习** | 序列任务流 | 正则、Rehearsal、LoRA 挂载 | **前向迁移**（新任务 zero/few-shot）、**后向迁移**（旧任务遗忘率）、旧基准 **Acc 保持** | 与 [1.2.1](./01-learning-paradigms.md) 中「灾难性遗忘」直接相关 |

### 10.1 监督学习（含 SFT）

- **优化**：response 段 token 交叉熵（见 [1.2.2](./02-loss-regularization.md)）。
- **评估**：验证集 **loss / PPL** + 指令任务 **EM、ROUGE、Win rate**；分类子任务用 **Acc / F1**。
- **交叉验证**：数据量中等时可用 k-fold 选 epoch、学习率；大规模 SFT 更常用固定 dev set。

### 10.2 自监督 / 「无监督」预训练

- **优化**：全序列下一 token 预测。
- **评估**：held-out **PPL**；能力以外部基准 **Acc / pass@k** 为主（不直接优化这些指标）。
- **交叉验证**：多用**单一验证集 + 早停**，而非 k-fold 重训全集。

### 10.3 强化学习与人类对齐

- **优化**：期望奖励或偏好对数似然（DPO 等）。
- **评估**：**成对胜率**、GPT-4 / 强模型 **Judge 分**、**KL 约束**是否满足；安全与有用性维度分开报。
- **注意**：奖励分高不等于人类满意，需与 Arena、人工并列看。

### 10.4 持续学习与知识迁移

结合 [1.2.1](./01-learning-paradigms.md) 中的要求：

| 目标 | 可操作建议指标 |
| ---- | -------------- |
| **知识记忆** | 微调后在**原领域基准**上的 Acc 保持率 |
| **前向迁移** | 新任务 **zero-shot / few-shot** Acc 相对随机初始化提升 |
| **后向迁移** | 微调新任务后，旧任务 Acc **下降幅度**（遗忘率） |
| **在线学习** | 按时间窗口划分的 dev PPL 与任务成功率曲线 |

小规模 LoRA 微调若旧基准几乎不掉点，可视为较好的后向迁移；大规模全参微调则需 **Rehearsal** 或正则，并用上表系统追踪。

---

## 十一、快速查阅：指标 → 场景

```text
预训练     → PPL, NLL, val loss
Mid-Training → PPL + GSM8K/HumanEval/MMLU 探针；对比 SFT/RL 前后增益
SFT        → CE loss + EM/F1/ROUGE + 任务 Acc
分类/安全  → Acc, Precision, Recall, F1, AUC
代码       → pass@k, CodeBLEU, SWE-bench Acc
数学推理   → solve rate, pass@k, maj@k
开放对话   → Win rate, Elo, MT-Bench, 人工 Likert
对齐训练   → RM score, KL, 安全拒答率
Agent      → task success, tool accuracy, steps
持续学习   → 旧任务 Acc 保持 + 新任务迁移
```

---

## 十二、与本章其他小节的关系

- **损失函数**：训练最小化 CE、DPO loss 等；指标用于验证是否「真的变好」（[1.2.2](./02-loss-regularization.md)）。
- **偏差–方差**：指标波动大时，需多次划分或多种子评估（[1.2.3](./03-bias-variance.md)）。
- **NLP 生成指标细节**：[1.4.4](../04-nlp-foundations/04-nlp-metrics.md)。
- **基准与 Judge 方法论**：[第七部分 评估](../../07-evaluation/)。

---

## 参考资料

- [A Survey on LLM Mid-Training](https://arxiv.org/abs/2510.23081) — 中期训练定义、数据与评估框架
- [Midtraining Bridges Pretraining and Posttraining Distributions](https://arxiv.org/abs/2510.14865) — 分布桥接与后训初始化
- [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374) — pass@k 定义与 HumanEval
- [A Survey on Evaluation of Large Language Models](https://arxiv.org/abs/2307.03109)
- [Holistic Evaluation of Language Models (HELM)](https://crfm.stanford.edu/helm/latest/)
- [Hugging Face — evaluate metrics](https://github.com/huggingface/evaluate/tree/main/metrics)
- [aimultiple — LLM evaluation](https://research.aimultiple.com/large-language-model-evaluation/)
