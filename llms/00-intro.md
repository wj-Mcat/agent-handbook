---
sidebar_position: 1
slug: intro
---

# LLMs 发展历程

大语言模型（Large Language Models, LLMs）的发展历程是人工智能领域的一个重要里程碑，其演进标志着从传统的统计语言模型到基于深度学习的模型的转变，并最终发展为今天我们所见的高效、多功能的AI系统。

## 发展时间线

### 2017年：Transformer 架构诞生

**Attention Is All You Need**

Google 发布论文《Attention Is All You Need》，提出了 **Transformer** 架构，引入了自注意力机制（Self-Attention）。这一架构彻底改变了自然语言处理（NLP）领域，成为现代几乎所有大型语言模型（如 GPT、BERT 等）的基石。

### 2018年：预训练语言模型时代开启

**BERT 与 GPT-1**

- **BERT**（Bidirectional Encoder Representations from Transformers）：Google 发布，采用双向编码器架构，在多项 NLP 任务上取得突破性进展
- **GPT-1**（Generative Pre-trained Transformer）：OpenAI 发布首个 GPT 模型，拥有 **1.17亿参数**，通过无监督学习在大量文本数据上进行预训练，标志着预训练语言模型时代的开始

### 2019年：模型规模扩大

**GPT-2**

OpenAI 发布 GPT-2，参数量达到 **15亿**。GPT-2 在多项自然语言处理任务上取得显著进步，包括阅读理解、文本生成和翻译等。其生成文本质量之高，以至于初期 OpenAI 出于对潜在滥用的担忧，决定暂时不完全开放模型。

### 2020年：大模型革命

**GPT-3**

GPT-3 的问世彻底改变了游戏规则：
- 参数量达到 **1750亿**
- 展现了"少量学习"（Few-shot Learning）的能力，即在仅给定少量示例的情况下就能完成特定任务
- 极大地扩展了 AI 在写作、编程、艺术创作等领域的应用范围

### 2022年：ChatGPT 引爆全球

**ChatGPT 发布**

- 基于 GPT-3.5 架构，经过人类反馈强化学习（RLHF）的微调
- 能够生成流畅、连贯、有逻辑的对话
- 在两个月内用户数突破 1 亿，成为历史上增长最快的消费级应用

### 2023年：多模态与推理能力突破

**GPT-4**

- OpenAI 发布 GPT-4，支持多模态输入（文本+图像）
- 在理解复杂文本、逻辑推理和跨领域知识整合等方面取得重大突破
- 进一步提高了文本生成的质量和准确性

**开源模型崛起**

- **LLaMA**（Meta）：开源大语言模型，推动开源社区发展
- **ChatGLM**（智谱AI）：中文大语言模型
- **文心一言**（百度）、**通义千问**（阿里）等国产大模型相继发布

### 2024年：推理能力与效率提升

- **GPT-4o**：OpenAI 发布，优化了多模态能力和响应速度
- **o1 / o3 系列**：引入"长思维链"推理能力，在数学、编程等复杂任务上表现突出
- **Claude 3.5 Sonnet**：Anthropic 发布，在代码生成和推理方面表现优异
- **DeepSeek V2 / V3**：国产开源模型在性能和成本效率上取得突破。其中 DeepSeek-V3（2024 年 12 月）采用 671B 参数的 MoE 架构（每 token 仅激活约 37B），引入 **MLA（多头潜在注意力）** 与 **DeepSeekMoE**，并首创"无辅助损失负载均衡"和 **MTP（多 token 预测）**，以极低成本逼近闭源旗舰模型

### 2025年：开源推理模型与智能体范式革新

- **DeepSeek-R1**（2025 年 1 月）：通过纯强化学习（GRPO）激发推理能力，首次以开源形式逼近 OpenAI o1，引爆"DeepSeek 时刻"
- **RLVR**（Reinforcement Learning with Verifiable Rewards）：基于可验证奖励的强化学习成为推理模型训练的主流范式
- **Llama 4 / Qwen3 / Kimi K2 / GLM-4.5~4.6**：开源阵营全面转向 MoE 架构，并在长上下文、原生多模态、Agent 能力上密集突破
- **Claude Code**：重新定义 AI 与代码库的交互范式
- **氛围编程**（Vibe Coding）：AI 辅助编程彻底改变软件开发逻辑

### 2026年：前沿持续向开源收敛

- 开源旗舰持续逼近闭源前沿：DeepSeek、Qwen、GLM 等系列在推理、编程、长上下文（百万级 token）与推理成本上不断刷新记录
- 稀疏注意力（如 DeepSeek Sparse Attention）、超稀疏 MoE、混合注意力等架构创新成为降低长上下文推理成本的关键方向

## 开源模型技术发展详解

近两年开源大模型的进步速度尤为惊人，逐渐从"追赶闭源"走向"局部领先"。下面按代表性模型梳理其关键技术创新与对应论文。

### DeepSeek 系列：极致的成本效率

DeepSeek 系列以"强性能 + 低成本"著称，其架构创新对整个开源社区影响深远。

**DeepSeek-V3（2024.12，[arXiv:2412.19437](https://arxiv.org/abs/2412.19437)）**

- **MoE 架构**：总参数 671B，每个 token 仅激活约 37B，兼顾容量与推理成本
- **MLA（Multi-head Latent Attention，多头潜在注意力）**：将 Key/Value 联合压缩到低维潜在向量后再缓存，大幅压缩 KV Cache（可达 5~10 倍），并使用解耦的 RoPE 保留位置信息
- **DeepSeekMoE**：采用细粒度专家切分 + 共享专家，缓解传统 MoE 的"知识混杂"与"知识冗余"问题
- **无辅助损失负载均衡**（Auxiliary-Loss-Free Load Balancing）：通过动态偏置调节路由，避免传统辅助损失对模型性能的损害
- **MTP（Multi-Token Prediction，多 token 预测）**：训练时一次预测多个后续 token，提升训练信号密度，并可用于推理加速
- **FP8 混合精度训练**：在万亿级 token 规模上以极低算力成本完成训练

**DeepSeek-R1（2025.01，[arXiv:2501.12948](https://arxiv.org/abs/2501.12948)，后发表于 Nature）**

- **DeepSeek-R1-Zero**：以 DeepSeek-V3-Base 为基座，**完全跳过 SFT**，仅用强化学习（**GRPO**）就让模型涌现出自我验证、反思、长思维链等推理行为
- **GRPO（Group Relative Policy Optimization，群组相对策略优化）**：去掉了 PPO 中的 Critic（价值网络），改用一组采样输出的奖励均值/标准差来估计基线，显著降低训练显存与算力开销
- **冷启动 + 多阶段训练**：为解决 R1-Zero 可读性差、语言混杂的问题，R1 先用少量冷启动数据 SFT，再交替进行 RL 与拒绝采样 SFT，最终达到与 OpenAI o1 相当的水平
- **蒸馏**：将 R1 的推理能力蒸馏到更小的稠密模型上，使小模型也具备强推理能力

> 后续的 **DeepSeek-V3.2** 进一步引入 **DSA（DeepSeek Sparse Attention，稀疏注意力）**，专门优化长上下文场景下的推理成本。

### Qwen3：统一"思考/非思考"双模

**Qwen3（2025.05，[arXiv:2505.09388](https://arxiv.org/abs/2505.09388)，Apache 2.0）**

- **稠密 + MoE 全系列**：参数规模从 0.6B 覆盖到 235B，旗舰 Qwen3-235B-A22B 激活约 22B 参数
- **思考/非思考统一框架**：同一个模型即可在"长思维链推理"与"快速直答"间切换，通过 `/think`、`/no_think` 标签控制，无需在 Chat 模型与推理模型间来回切换
- **思考预算（Thinking Budget）**：可按任务复杂度动态分配推理 token 数量，在延迟与效果间灵活权衡
- **MoE 设计差异**：采用 128 个专家、激活 8 个的细粒度切分，并**取消共享专家**，使用全局批次负载均衡损失鼓励专家专精
- **强弱蒸馏**：用旗舰模型的知识（含 off-policy 与 on-policy 蒸馏）大幅降低小模型的训练成本
- **多语言扩展**：从 Qwen2.5 的 29 种语言扩展到 119 种语言和方言

### Llama 4：原生多模态 + 超长上下文

**Llama 4（2025.04，Llama 4 Community License）**

- **首次采用 MoE**：Meta 首个 MoE 架构的 Llama 系列
  - **Scout**：17B 激活 / 109B 总参数，16 个专家，宣称支持 **10M token** 超长上下文，可在单张 H100 上部署
  - **Maverick**：17B 激活 / 400B 总参数，128 个路由专家 + 1 个共享专家，稠密层与 MoE 层交替
  - **Behemoth**：约 2T 参数的"教师模型"，用于蒸馏，未开源
- **原生多模态（Early Fusion）**：文本与图像在早期融合进同一骨干，而非外接视觉模块
- **iRoPE 架构**：交替使用带 RoPE 的局部注意力层与 **NoPE（无位置编码）** 层（约每 4 层一个 NoPE 层），NoPE 层使用全因果掩码以捕捉全局长程依赖；并在推理时对注意力做温度缩放（temperature tuning），增强长度泛化，目标是支持"近乎无限"的上下文

### Kimi K2：万亿参数的开源 Agent 模型

**Kimi K2（2025.07，Moonshot AI，[arXiv:2507.20534](https://arxiv.org/abs/2507.20534)）**

- **超稀疏 MoE**：1.04T 总参数，每 token 仅激活 32B；专家数从 DeepSeek-V3 的 256 增至 **384**，注意力头数减至 64 以降低长上下文推理开销
- **沿用 MLA**：与 DeepSeek-V3 类似的架构设计
- **MuonClip 优化器**：在 Muon 基础上引入 **QK-Clip** 技术抑制训练不稳定，在 15.5T token 的预训练中实现"零 loss 尖峰"
- **面向 Agent 的后训练**：包含大规模 agentic 数据合成流水线，以及在真实/合成环境中交互的联合强化学习阶段，主打工具调用与软件工程能力

### GLM-4.5 / 4.6：聚焦 Agent、推理与编程（ARC）

**GLM-4.5 / GLM-4.6（2025.07 / 2025.09，智谱 AI，[arXiv:2508.06471](https://arxiv.org/abs/2508.06471)）**

- **355B-A32B MoE**：355B 总参数，激活约 32B，定位 **ARC（Agentic、Reasoning、Coding）** 基础模型
- **混合推理（Hybrid Reasoning）**：支持"思考模式"开关，兼顾深度推理与快速响应
- **长上下文**：GLM-4.6 将上下文窗口从 128K 扩展到 200K
- **强编程与 Agent 能力**：在 Claude Code、Cline、Roo Code 等真实编程/Agent 框架中表现优异，原生支持工具调用（代码解释器、网页搜索等），在多项公开基准上对标 DeepSeek-V3.1 与 Claude Sonnet 4

### 开源模型架构速览

| 模型 | 发布时间 | 总参数 / 激活参数 | 关键架构特性 |
|------|----------|------------------|--------------|
| DeepSeek-V3 | 2024.12 | 671B / 37B | MLA + DeepSeekMoE + MTP + 无辅助损失负载均衡 |
| DeepSeek-R1 | 2025.01 | 671B / 37B | 纯 RL（GRPO）+ 冷启动多阶段训练 |
| Llama 4 Scout | 2025.04 | 109B / 17B | MoE（16 专家）+ iRoPE + 原生多模态，10M 上下文 |
| Llama 4 Maverick | 2025.04 | 400B / 17B | MoE（128 专家 + 共享专家）+ 原生多模态 |
| Qwen3-235B-A22B | 2025.05 | 235B / 22B | 思考/非思考统一 + 思考预算，128 专家无共享专家 |
| Kimi K2 | 2025.07 | 1.04T / 32B | MLA + 超稀疏 MoE（384 专家）+ MuonClip 优化器 |
| GLM-4.6 | 2025.09 | 355B / 32B | 混合推理 + 强 Agent/编程能力，200K 上下文 |

## 技术演进趋势

### 1. 参数规模增长

| 模型 | 发布时间 | 参数量 |
|------|----------|--------|
| GPT-1 | 2018年 | 1.17亿 |
| GPT-2 | 2019年 | 15亿 |
| GPT-3 | 2020年 | 1750亿 |
| GPT-4 | 2023年 | 据传超过1万亿 |
| DeepSeek-V3 | 2024年 | 671B（MoE，激活 37B） |
| Kimi K2 | 2025年 | 1.04T（MoE，激活 32B） |

可以看到，主流开源模型已普遍从"稠密大模型"转向 **MoE（混合专家）稀疏架构**：总参数可以做到万亿级，但每个 token 只激活其中一小部分，从而在"高容量"与"低推理成本"之间取得平衡。

### 2. 核心能力演进

- **从模仿到理解**：从"鹦鹉学舌"（只会模仿）到涌现能力（Emergent Abilities）
- **从单模态到多模态**：支持文本、图像、音频等多种输入形式
- **从生成到推理**：不仅能生成内容，还能进行复杂逻辑推理
- **从工具到助手**：从单一任务工具发展为通用 AI 助手

### 3. 训练范式转变

1. **预训练 + 微调**（Pre-training + Fine-tuning）
2. **提示工程**（Prompt Engineering）
3. **人类反馈强化学习**（RLHF）
4. **基于可验证奖励的强化学习**（RLVR）：以答案正确性等可验证信号作为奖励，驱动推理能力提升
5. **群组相对策略优化**（GRPO）：去除 Critic 网络的高效 RL 算法，是 DeepSeek-R1 推理能力的关键
6. **纯 RL 自进化 + 蒸馏**：先用大规模 RL 让大模型涌现推理能力，再蒸馏到小模型

### 4. 架构与推理优化

- **MoE 稀疏化**：用更少的激活参数撬动更大的总容量（DeepSeek、Qwen3、Kimi K2、GLM、Llama 4）
- **注意力优化**：MLA 压缩 KV Cache、稀疏注意力（DSA）、iRoPE 长上下文方案，共同降低长序列推理成本
- **多 token 预测（MTP）**：提升训练信号密度并加速推理
- **新型优化器**：如 Kimi K2 的 MuonClip，提升训练稳定性与 token 效率

## 未来展望

大语言模型仍在快速发展中，未来可能的方向包括：

- **更高的推理能力**：解决更复杂的数学、科学问题
- **更低的计算成本**：让大模型更普及、更环保
- **更强的安全性**：减少幻觉、偏见和有害输出
- **更广泛的应用**：深入医疗、教育、科研等专业领域

## 参考论文与资料

- **Attention Is All You Need**（Transformer，2017）：[arXiv:1706.03762](https://arxiv.org/abs/1706.03762)
- **DeepSeekMoE**（细粒度专家 + 共享专家，2024）：[arXiv:2401.06066](https://arxiv.org/abs/2401.06066)
- **DeepSeek-V2**（MLA 提出，2024）：[arXiv:2405.04434](https://arxiv.org/abs/2405.04434)
- **DeepSeek-V3 Technical Report**（2024）：[arXiv:2412.19437](https://arxiv.org/abs/2412.19437)
- **DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL**（2025）：[arXiv:2501.12948](https://arxiv.org/abs/2501.12948)
- **Qwen3 Technical Report**（2025）：[arXiv:2505.09388](https://arxiv.org/abs/2505.09388)
- **Kimi K2: Open Agentic Intelligence**（2025）：[arXiv:2507.20534](https://arxiv.org/abs/2507.20534)
- **GLM-4.5 Technical Report**（2025）：[arXiv:2508.06471](https://arxiv.org/abs/2508.06471)
- **Llama 4 官方介绍**（2025）：[ai.meta.com/blog/llama-4-multimodal-intelligence](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)

---

> **持续更新中** — 大语言模型领域发展迅速，本文档将持续更新以反映最新的技术进展。
