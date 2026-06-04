---
sidebar_position: 1
title: 1.2.1 学习范式
---

# 学习范式

本文从经典机器学习三分法出发，说明其与 **LLM 工业训练流程**（预训练 → 中期训练 → 后训练）的对应关系，并重点展开 **Mid-Training（中期训练）** 这一近年被单独划出的阶段。该阶段与本文后半「终生学习 / 持续学习」备忘中的**前向迁移、灾难性遗忘**等问题直接相关。阶段评估指标见 [1.2.4 评估指标与交叉验证](./04-metrics-cross-validation.md)。

---

## 一、监督学习、无监督学习、自监督学习

| 范式 | 标签来源 | 典型目标 | LLM 中的对应 |
| ---- | -------- | -------- | ------------ |
| **监督学习** | 人工标注 $(x, y)$ | 最小化 $\mathcal{L}(f(x), y)$ | SFT、奖励建模、部分偏好对齐数据 |
| **无监督学习** | 无显式标签，从数据结构发现模式 | 聚类、降维、密度估计 | 早期「无标签语料」说法；严格意义上 LLM 预训练多用**自监督** |
| **自监督学习** | 从原始数据**构造**伪标签 | 下一 token 预测（交叉熵） | **预训练 / Mid-Training** 的主体：用文本自身作为监督信号 |

在 LLM 语境下，「无监督预训练」常指**自监督**的下一 token 预测；后训练（SFT、RLHF、DPO 等）则更接近**监督**或**强化学习**范式。

---

## 二、LLM 训练流水线：Pre → Mid → Post

当代基座模型开发已从「单次海量预训练 + 微调」演进为**多阶段**流程：

```text
Pre-Training          Mid-Training              Post-Training
(通用预训练)    →     (中期训练 / 桥接)    →     (SFT / RLHF / DPO / RLVR …)
海量、嘈杂语料         精选混合、退火、长上下文        高质量指令与偏好
下一 token 预测        下一 token 预测（为主）        指令 loss / 奖励优化
```

| 阶段 | 数据特点 | 算力规模（典型量级关系） | 核心问题 |
| ---- | -------- | ------------------------ | -------- |
| **Pre-Training** | 全网爬取、规模大、噪声高 | 最大（可达数十 T tokens） | 世界知识、通用语言能力 |
| **Mid-Training** | 高质量 + 领域（数学、代码、STEM）+ 常保留部分通用语料 | 介于 Pre 与 SFT 之间 | **分布桥接**、定向能力、为后训 warm-up |
| **Post-Training** | 指令对、偏好对、可验证奖励任务 | 相对 Pre 很小 | 对齐、指令跟随、推理与 Agent 行为 |

---

## 三、Mid-Training（中期训练）

### 3.1 定义与定位

**Mid-Training（中期训练）** 指介于**通用预训练**与**后训练（SFT / RL 等）**之间的、有意识的开发阶段：仍以**下一 token 预测**为主（与 SFT「只对回答算 loss」、RL「优化奖励」不同），但数据更精选、配比更讲究，学习率常进入**退火（annealing）**或**稳定—衰减（WSD）**的末段，用于：

1. **前向**：在数学、代码、推理、长上下文、多语言等方向**放大**专用能力；
2. **后向**：通过保留一定比例通用预训练语料，**抑制**领域化带来的灾难性遗忘；
3. **桥接**：缩小预训练语料与后训数据（指令格式、代码语法、解题步骤等）之间的**分布差距**，使后续 SFT/RL 更省数据、更少遗忘。

概念在 2024 年前后由工业界逐步命名：早期实践包括预训练末期的 **cool-down**、**数据退火（data annealing）**、**长上下文扩展**；部分团队曾把高质量领域数据放在后训，现多收敛为独立的 Mid 阶段（参见 [IBM — Mid-training for reasoning](https://research.ibm.com/blog/mid-training-for-better-ai-reasoning)）。

:::tip 综述论文
- [A Survey on LLM Mid-Training](https://arxiv.org/abs/2510.23081)（美团 / 北大，2025）
- [Mid-Training of Large Language Models: A Survey](https://arxiv.org/abs/2510.06826)（2025）
- [Midtraining Bridges Pretraining and Posttraining Distributions](https://arxiv.org/abs/2510.14865)（系统实验，2025）
:::

### 3.2 与继续预训练（Continued Pre-training）的区别

二者都可能在基座上做额外 token 训练，但**设计意图**不同（见 [A Survey on LLM Mid-Training](https://arxiv.org/abs/2510.23081) §2）：

| | **Mid-Training** | **Continued Pre-training** |
| --- | --- | --- |
| **意图** | 在「预训练分布 ↔ 后训分布」之间**过渡** | 在已有模型上**追加**领域或语言数据 |
| **数据** | 通用高质量语料 + 数学 / 代码 / STEM / 指令形态等**混合**；常配合退火 | 往往以目标领域语料为主 |
| **优化** | 继承预训练 LR 动态，多子阶段、课程式混合 | 不一定保留原配比或 optimizer 状态 |
| **风险** | 配比不当仍可能伤通用能力，但常**刻意保留通用数据比例** | 领域占比过高时更易**灾难性遗忘** |

受控实验表明：在数学、代码等与网页预训练分布差异大的领域，**Mid-Training** 在领域内验证 loss 与 SFT 后通用语料（如 C4）保持上，往往优于**仅用领域数据做继续预训练**；收益来自**渐进的 token 级分布迁移**，而非 abrupt 换数据（[Midtraining Bridges…](https://arxiv.org/abs/2510.14865)）。

### 3.3 常见技术要素

**（1）学习率调度**

- 预训练后期降低 LR，缓解梯度噪声、稳定收敛（与 **gradient noise scale**、信息瓶颈、课程学习等解释相容，见 [Mid-Training Survey](https://arxiv.org/abs/2510.06826)）。
- 常见策略：**余弦衰减**末段切为**线性衰减至 0**（OLMo 2）、**WSD**（Warmup–Stable–Decay）中的 fast decay 段混入高质量数据（Llama 3、Qwen 2.5 等路线）、多阶段 scheduler（Hu et al., 2024）。
- **时机与配比强相关**：专用数据**越早**引入、混合权重可越高；训练后期突然提高领域占比（如 80% code）可能反而损害表现（[Midtraining Bridges…](https://arxiv.org/abs/2510.14865) Figure 4）。

**（2）数据退火（Annealing）与精选混合**

- 在 LR 下降阶段提高**高质量、高难度** token 占比（数学、代码、合成推理、Rephrase 后的网页等）。
- **Phi**、**OLMo 2**（Dolmino Mix 1124）、**Llama 3** 等均在预训练末或独立第二阶段做类似操作；OLMo 2 对 Mid 阶段多次随机顺序训练并**平均 checkpoint**（model soup）以榨取高质量数据收益。

**（3）长上下文扩展**

- 提高长序列样本比例，并配合 RoPE 外推、位置编码或架构调整（YaRN 等）；常与 Mid 阶段绑定，而非仅在 Pre 最前期完成（[技术栈概览](../01-introduction/03-tech-stack-overview.md) 中的「长文预训练」「多阶段预训练」）。

**（4）数据合成与形态**

- 蒸馏、Rephrase、从语料抽取 QA、数学/代码演化合成（MathGenie、MegaMath 等）；将答案改写为问题，让模型学习「会问」而不仅是「会答」（产业界常称 Mid 是**规模化制造判别力**的阶段，介于 Pre 的粗放与 Post 的手工策展之间）。

**（5）去污染与配比**

- 对基准做 n-gram / 语义去污染，避免 Mid 阶段泄漏评测；领域与通用数据的**混合权重**需与**开始 Mid 的 checkpoint 时机**联合调优。

### 3.4 能力域与典型数据

综述将 Mid 锚定的能力大致分为三类（[A Survey on LLM Mid-Training](https://arxiv.org/abs/2510.23081)）：

| 能力域 | 示例 | 常见数据来源 |
| ------ | ---- | ------------ |
| **核心认知** | 数学 / STEM、复杂推理 | MegaMath、WebInstruct、合成推理链 |
| **任务执行** | 代码、指令跟随、Agent 轨迹 | Stack、合成 code instruction、工具调用日志 |
| **可扩展性** | 长上下文、多语言 | 长文档采样、低资源语言上采样（Phi-3.5、Yi-Lightning 等） |

**IBM** 在约 **27B tokens** 规模上对比 Mid 配方：仅数学+代码 vs 数学+代码+科学推理，前者在综合推理基准上平均低 **3–6** 分；同类调整放在 **RL 阶段**收益很小，说明 Mid 是注入领域知识的**高效窗口**（[IBM Research Blog](https://research.ibm.com/blog/mid-training-for-better-ai-reasoning)）。实验还指出：在**已完成长上下文扩展**的基座上做 Mid，通常优于在预训练早期就做同类注入。

### 3.5 与终生学习、迁移的关系

结合下文「LLM 终生学习」备忘：

- **前向迁移**：Mid 通过课程式领域暴露，为后续 zero-shot / few-shot 与 RL **预热**参数空间；实证上 Mid 相对 Pre 的**边际增益**常更陡，且单位算力效率更高（Wang et al., 2025; Gui et al., 2025，见 Mid-Training 综述）。
- **后向迁移 / 遗忘**：Mid 若保留通用数据比例，可在 SFT 后更好保留通用语言建模（C4 等）；纯领域继续预训练则更易在 Post 之后遗忘（[Midtraining Bridges…](https://arxiv.org/abs/2510.14865) Table 3）。
- **与微调的关系**：Mid **不是**替代 SFT/RL，而是降低后训的分布冲击；Pre–Mid–RL 的交互见 [On the Interplay of Pre-Training, Mid-Training, and RL](https://arxiv.org/abs/2512.07783)。

评估上除 PPL 外，应跟踪 GSM8K、HumanEval、MMLU 子集等探针，并记录 **Mid → SFT → RL** 链路上的相对提升（详见 [1.2.4](./04-metrics-cross-validation.md#mid-training-是什么)）。

### 3.6 实践要点小结

1. **先明确阶段目标**：桥接分布、补数学/代码短板、扩上下文或多语言，再定数据与 LR，避免与「继续预训练」混为一谈。
2. **时机 > 单次配比**：专用数据引入**越早**往往越有利，但需与总 token 预算和 LR 阶段匹配。
3. **保留通用锚点**：混合中维持一定通用高质量语料，减轻 Post 阶段遗忘。
4. **长上下文后再 Mid**：若基座尚未稳定支持长序列，领域 Mid 收益可能打折扣。
5. **用链式指标验收**：单看 Mid 结束时的 Acc 易低估其价值，应对比「无 Mid」基线在相同 SFT/RL 下的表现。

### 3.7 代表模型与实践（节选）

| 模型 / 系列 | Mid 相关做法（公开资料中的概括） |
| ----------- | -------------------------------- |
| **OLMo 2** | Stage 2 Mid：Dolmino Mix 1124，LR 线性降至 0；多次 anneal + 模型平均 |
| **Llama 3 / 3.1** | 预训练末期 fast LR decay + 高质量数据上采样 |
| **Phi-3 / 3.5** | 明确使用 mid-training 术语；多语言、长上下文、合成数据 |
| **Qwen 2.5 / 3** | 多阶段预训练与 Mid 子阶段、长上下文与领域数据 |
| **DeepSeek-V3** | 多阶段训练中的 annealing / 领域强化（见各技术报告） |

更完整的模型对照表见 [Mid-Training of Large Language Models: A Survey](https://arxiv.org/html/2510.06826) 中的汇总表。

---

## 四、LLM 终生学习（备忘）

以下为 LLM **终生学习 / 持续学习** 相关备忘，与 Mid-Training 中的**遗忘控制、前向/后向迁移**相呼应。

### 要求

#### 知识记忆

#### llm 通过预训练之后已经具备世界知识，通过小规模 finetune 不会灾难遗忘，可是大规模会。

#### 前向迁移

#### 基于世界知识的 zero shot 和 few shot 能力

#### 后向迁移

#### finetune 会造成知识遗忘，故很难实现完美的后向迁移

#### 解决方案：

- 类似于 lora 的知识装载

#### 在线学习

#### 离线预训练微调

#### 无人无边界

#### 无监督预训练和微调，不区分任务

#### 固定模型容量

#### llm 预训练以后大小不变

### 方法

#### rehearsal （排练）

#### regarizatuon （正则）

#### Architectures （结构改造）

---

## 五、延伸阅读

- [1.2.4 评估指标与交叉验证](./04-metrics-cross-validation.md) — Mid 阶段指标与全链路对照
- [技术栈概览 — 预训练](../01-introduction/03-tech-stack-overview.md#三预训练pre-training) — Pre 阶段技术栈
- [A Survey on LLM Mid-Training](https://arxiv.org/abs/2510.23081)
- [Mid-Training of Large Language Models: A Survey](https://arxiv.org/abs/2510.06826)
- [Midtraining Bridges Pretraining and Posttraining Distributions](https://arxiv.org/abs/2510.14865)
- [IBM — Mid-training is essential for LLM reasoning](https://research.ibm.com/blog/mid-training-for-better-ai-reasoning)
- [On the Interplay of Pre-Training, Mid-Training, and RL](https://arxiv.org/abs/2512.07783)
