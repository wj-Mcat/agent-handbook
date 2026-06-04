---
sidebar_position: 1
slug: /
title: 开源 LLM 技术报告
---

# 开源 LLM 技术报告

本栏目整理 **2024–2026 年主流开源大模型技术报告** 的结构化领读，并提供**横向对比索引**，便于从架构、训练、对齐、开源等维度快速对照不同路线。

## 栏目定位

| 栏目 | 定位 |
| --- | --- |
| **本栏目（Tech Report）** | 官方技术报告 / 模型卡的领读摘要 + 多模型横向对比 |
| **Paper Reading · Agentic / RL** | 学术方法与算法论文深度领读 |
| **Weekly Paper** | 每周论文速览 |
| **[LLMs 第八部分](/llms/08-technical-reports/)** | 按系列组织的系统学习大纲（占位章节，可与本栏交叉阅读） |

## 领读笔记目录

### DeepSeek

| 笔记 | 主题 |
| --- | --- |
| [DeepSeek-V2](./deepseek/deepseek-v2) | MLA + DeepSeekMoE，成本效率基座 |
| [DeepSeek-V3](./deepseek/deepseek-v3) | 671B MoE、MTP、FP8 预训练 |
| [DeepSeek-R1](./deepseek/deepseek-r1) | GRPO 纯 RL 激发推理 |
| [DeepSeek-V4](./deepseek/deepseek-v4) | 1M 上下文、CSA+HCA、mHC |

### 智谱 GLM

| 笔记 | 主题 |
| --- | --- |
| [GLM-4 家族](./glm/glm-4-family) | ChatGLM / GLM-4 技术报告 |
| [GLM-4.5](./glm/glm-4-5) | ARC：Agent / Reasoning / Coding |

### MiniMax

| 笔记 | 主题 |
| --- | --- |
| [MiniMax-01](./minimax/minimax-01) | 闪电注意力 + 超长上下文 |
| [MiniMax-M1](./minimax/minimax-m1) | 开源 MoE + RL 扩展 |

### 通义 Qwen

| 笔记 | 主题 |
| --- | --- |
| [Qwen2.5](./qwen/qwen2-5) | 全尺寸稠密 / MoE 与多语言 |
| [Qwen3](./qwen/qwen3) | 思考 / 非思考统一 + 思考预算 |

### 国外开源

| 笔记 | 主题 |
| --- | --- |
| [Llama 3.1](./international/llama-3-1) | Meta 405B 开源旗舰 |
| [Llama 4](./international/llama-4) | MoE + iRoPE + 原生多模态 |
| [Mistral / Mixtral](./international/mistral-mixtral) | 7B 稠密与 MoE 路线 |
| [Gemma 2 / 3](./international/gemma-2-3) | Google 开源多模态 |
| [OLMo 2](./international/olmo-2) | AI2 全链路开放 |

:::note 待补笔记

DeepSeek-V3.2、GLM-4.7/5、MiniMax-M2、Kimi K2、GPT-OSS 等可在对比表中查看官方链接占位，后续单篇领读再补（V4 已收录）。

:::

## 横向对比索引

以下表格以**模型为列、维度为行**；表头链到本站领读。宽表可横向滚动。

### 架构对比

<div class="tech-report-table-wrapper">

| 维度 | [V2](./deepseek/deepseek-v2) | [V3](./deepseek/deepseek-v3) | [R1](./deepseek/deepseek-r1) | [V4](./deepseek/deepseek-v4) | [GLM-4](./glm/glm-4-family) | [GLM-4.5](./glm/glm-4-5) | [MiniMax-01](./minimax/minimax-01) | [MiniMax-M1](./minimax/minimax-m1) | [Qwen2.5](./qwen/qwen2-5) | [Qwen3](./qwen/qwen3) | [Llama3.1](./international/llama-3-1) | [Llama4](./international/llama-4) | [Mixtral](./international/mistral-mixtral) | [Gemma3](./international/gemma-2-3) | [OLMo2](./international/olmo-2) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 发布 | 2024.05 | 2024.12 | 2025.01 | 2026.04 | 2024.06 | 2025.07 | 2025.01 | 2025.06 | 2024.09 | 2025.05 | 2024.07 | 2025.04 | 2023.12 | 2025.03 | 2024.11 |
| 总参 / 激活 | 236B / 21B | 671B / 37B | 671B / 37B | **1.6T/49B**；**284B/13B** | 闭源+9B 开源 | 355B / 32B | ~456B 级 | MoE 开源 | 0.5B–72B+MoE | 0.6B–235B / 22B | 8B–405B 稠密 | Scout 109B/17B；Mav 400B/17B | 8×7B / 8×22B | 1B–27B+多模态 | 7B–32B 稠密 |
| 架构 | MoE | MoE | MoE（同 V3） | MoE 双档 | 稠密为主 | MoE | 线性注意力+稠密 | MoE | 稠密+MoE | 稠密+MoE | 稠密 | MoE | MoE | 稠密 | 稠密 |
| 注意力 | **MLA** | MLA | MLA | **CSA+HCA** | GQA | GQA+混合推理 | Lightning Attn | 标准+长文 | GQA | GQA | GQA | **iRoPE**（局部+NoPE） | GQA | 标准 | 全注意力 |
| 专家 | 160 routed + 共享 | 256 + 共享 | 同 V3 | MoE+**Hash-MoE** 引导 | — | MoE | — | MoE | MoE 可选 | 128，无共享 | — | 16 / 128+共享 | 8 专家 | — | — |
| 上下文 | 128K | 128K | 128K | **1M** | 128K–1M（9B） | 128K→200K | 4M 级宣称 | 1M | 128K+ | 128K+ | 128K | **10M**（Scout） | 32K–128K | 128K+ | 4K–32K |
| 多模态 | 否 | 否 | 否 | 否 | 部分版本 | 否 | VL-01 另系 | 否 | 部分 | 是 | 否 | **原生 Early Fusion** | 否 | **是** | 否 |

</div>

### 训练对比

<div class="tech-report-table-wrapper">

| 维度 | V2 | V3 | R1 | V4 | GLM-4 | GLM-4.5 | MiniMax-01 | MiniMax-M1 | Qwen2.5 | Qwen3 | Llama3.1 | Llama4 | Mixtral | Gemma3 | OLMo2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 预训练规模 | 8.1T tokens | **14.8T** | 基于 V3 base | **32–33T** | 未全公开 | 未全公开 | 未全公开 | 未全公开 | 18T+ 级 | 36T+ 级 | 15T+ 级 | 未全公开 | 未全公开 | 未全公开 | 5T+ 级 |
| 训练精度 | BF16 等 | **FP8** 混合 | 同 V3 | **FP4+FP8**（Instruct） | — | — | — | — | BF16/FP8 | BF16/FP8 | BF16 | — | — | — | BF16 |
| 架构训练技巧 | MLA+MoE 路由 | **MTP**、无辅助损失均衡 | — | **mHC**、**Muon**、FP4-QAT | — | ARC 数据合成 | 线性注意力降 KV | RL 扩展 | 多阶段课程 | 强弱蒸馏 | 高质量末期 | MoE 蒸馏 | 稀疏 MoE | 知识蒸馏 | **Model Soup** |
| 数据亮点 | 中英文+代码 | 多语言+数学代码 | — | Agent/长程 | 中英工具数据 | Agent/代码增强 | 长文数据 | Agentic 数据 | 29 语言 | **119** 语言 | 多语言 | 多模态对 | 多语言 | 多模态 | Dolma 等开放 |

</div>

### 对齐与推理对比

<div class="tech-report-table-wrapper">

| 维度 | V2 | V3 | R1 | V4 | GLM-4 | GLM-4.5 | MiniMax-01 | MiniMax-M1 | Qwen2.5 | Qwen3 | Llama3.1 | Llama4 | Mixtral | Gemma3 | OLMo2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 后训练 | SFT+RLHF 类 | SFT+对齐 | **GRPO 纯 RL**（R1-Zero） | SFT+**on-policy 蒸馏** | SFT+工具 | SFT+**混合推理** | SFT | SFT+RL | SFT+DPO 等 | SFT+RL | SFT+RLHF | SFT | SFT | SFT+RL | 对齐开源 |
| 推理模式 | 标准 | 标准 | **长 CoT**、自验证 | **Non-think / Think High / Think Max** | 工具调用 | 思考开关 | 标准 | RL 推理扩展 | 标准 | **/think** 统一 | 标准 | 标准 | 标准 | 思考模型 | 标准 |
| Agent / 工具 | 一般 | 增强 | 强推理 | **1M Agent 长程** | **All Tools** | **ARC 重点** | 一般 | Agentic | 工具调用 | Agent+工具 | 工具生态 | 多模态 Agent | 一般 | 设备端 | 研究向 |
| 蒸馏 | — | — | **→ 小稠密模型** | on-policy | — | — | — | — | 旗舰→小模型 | 强弱蒸馏 | — | Behemoth 教师 | — | Gemma 小模型 | — |

</div>

### 开源与资源对比

<div class="tech-report-table-wrapper">

| 维度 | V2 | V3 | R1 | V4 | GLM-4 | GLM-4.5 | MiniMax-01 | MiniMax-M1 | Qwen2.5 | Qwen3 | Llama3.1 | Llama4 | Mixtral | Gemma3 | OLMo2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 许可 | 开源可商用 | 开源 | MIT | 开源预览 | 模型许可 | **MIT** | 开源 | 开源 | Apache 2.0 | Apache 2.0 | Llama 社区 | Llama 4 社区 | Apache 2.0 | Gemma 条款 | Apache 2.0 |
| 权重 | HF 开放 | HF 开放 | HF 开放 | HF 开放 | 9B 等开放 | HF 开放 | HF 开放 | HF 开放 | HF 开放 | HF 开放 | HF 开放 | 部分开放 | HF 开放 | HF 开放 | **全链路** |
| 官方报告 | [arXiv:2405.04434](https://arxiv.org/abs/2405.04434) | [arXiv:2412.19437](https://arxiv.org/abs/2412.19437) | [arXiv:2501.12948](https://arxiv.org/abs/2501.12948) | [V4 PDF](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf) | [arXiv:2406.12793](https://arxiv.org/abs/2406.12793) | [arXiv:2508.06471](https://arxiv.org/abs/2508.06471) | GitHub README | GitHub README | [Qwen2.5 博客](https://qwenlm.github.io/blog/qwen2.5/) | [arXiv:2505.09388](https://arxiv.org/abs/2505.09388) | [Meta 博客](https://ai.meta.com/blog/meta-llama-3-1/) | [Meta 博客](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) | Mistral 文档 | Google 技术报告 | [OLMo 2](https://allenai.org/olmo) |
| 待补 | [V3.2 说明](https://api-docs.deepseek.com/) | — | — | — | GLM-4.7/5 | MiniMax-M2 | Kimi K2 | GPT-OSS | — | — | — | — | — | — | — |

</div>

## 阅读建议

1. 先扫本页对比表，锁定关心的维度（如 MLA vs GQA、思考模式、MoE 专家设计）。
2. 点进对应厂商单篇，按「架构 → 训练 → 后训练」顺序细读。
3. 需要体系化课程时，配合 [LLMs 第八部分](/llms/08-technical-reports/) 大纲延展。
