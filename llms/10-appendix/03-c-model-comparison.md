# 附录 C　主流模型参数与基准成绩对照

> **说明**：参数量、上下文、分数随版本快速变化；下表为 **2025 中旬量级摘要**，用于选型直觉。精确数字以官方技术报告为准。分数多为 **非 extended thinking** 或官方默认设置，**不可横比** 不同评测协议。

## 开源旗舰 MoE（示意）

| 模型 | 总参 / 激活 | 上下文 | 架构亮点 | 许可 | 领读 |
| --- | --- | --- | --- | --- | --- |
| DeepSeek-V3 | 671B / ~37B | 128K | MLA+MoE+MTP+FP8 | 开源 | [V3 领读](/paper-reading/tech-report/deepseek/deepseek-v3) |
| DeepSeek-R1 | 同 V3 基座 | 128K | GRPO 长 CoT | 开源 | [R1](/paper-reading/tech-report/deepseek/deepseek-r1) |
| Qwen3-235B-A22B | 235B / 22B | 128K | /think 统一 | Apache 2.0 | [Qwen3](/paper-reading/tech-report/qwen/qwen3) |
| Kimi K2 | 1T / 32B | 128K | MuonClip MoE | 开源 | [8.4.2](../08-technical-reports/04-kimi/02-kimi-k2) |
| GLM-4.5 | 355B / ~32B | 128K | ARC Agent | 开源 | [GLM-4.5](/paper-reading/tech-report/glm/glm-4-5) |
| Mixtral 8x22B | 141B / ~39B | 64K | 早期 MoE | Apache 2.0 | [Mistral](/paper-reading/tech-report/international/mistral-mixtral) |

## 开源稠密与中尺寸

| 模型 | 规模 | 上下文 | 侧重 | 领读/章节 |
| --- | --- | --- | --- | --- |
| Qwen2.5-72B | 72B 稠密 | 128K | 通用/代码 | [Qwen2.5](/paper-reading/tech-report/qwen/qwen2-5) |
| Llama 3.1-405B | 405B 稠密 | 128K | 通用 | [Llama 3.1](/paper-reading/tech-report/international/llama-3-1) |
| Llama 4 | 多规格 | 10M 目标 | 原生 MM | [Llama 4](/paper-reading/tech-report/international/llama-4) |
| Mistral 7B v0.3 | 7B | 32K | 边缘高效 | [Mistral](/paper-reading/tech-report/international/mistral-mixtral) |
| Gemma 3-27B | 27B | 128K | 边缘+MM | [Gemma](/paper-reading/tech-report/international/gemma-2-3) |
| OLMo 2-32B | 32B | 标准 | 全开放科研 | [OLMo 2](/paper-reading/tech-report/international/olmo-2) |

## 长上下文与特殊架构

| 模型 | 上下文宣传 | 机制 | 章节 |
| --- | --- | --- | --- |
| MiniMax-01 | 1M+ | Lightning Attention | [8.6.1](../08-technical-reports/06-others/01-minimax) |
| DeepSeek-V3.2 | 128K+ | DSA 稀疏 | [8.1.3](../08-technical-reports/01-deepseek/03-deepseek-v3-2) |
| GLM-4.6 | 200K | 编程增强 | [8.5.2](../08-technical-reports/05-glm/02-glm-4-6) |

## 基准分数（**示意**，勿用于严肃排名）

| 模型 | MMLU (≈) | HumanEval (≈) | MATH (≈) | 备注 |
| --- | --- | --- | --- | --- |
| DeepSeek-V3 | 88+ | 80+ | 50+ | 发布期报告 |
| DeepSeek-R1 | — | — | 90+ | 思考模式 |
| Qwen3-235B | 87+ | 75+ | 85+ | thinking 更高 |
| Kimi K2 | 87+ | 65+ SWE | 75+ GPQA | Agent 榜强 |
| GPT-4o（闭源参照） | 88+ | 90+ | 76+ | API 对照 |

:::warning

**污染、提示词、thinking 开关** 均可改变分数 ±10%。生产选型请跑 **自有验证集**。见 [7.2.4](../07-evaluation/02-evaluation-methods/04-reliability-contamination)。

:::

## 选型速查

| 需求 | 优先考虑 |
| --- | --- |
| 开源可商用 | Qwen2.5/3、Llama、Mistral（查许可） |
| 极致推理 | R1、Qwen3 think、o 系列 API |
| 长文档 | MiniMax、YaRN 微调模型、RAG  hybrid |
| Agent+代码 | Kimi K2、GLM-4.5、Claude/GPT API |
| 可复现科研 | OLMo 2 + Dolma |
| 边缘部署 | Gemma 1B/4B、Llama 3.2 1B、量化 GGUF |

## 检查清单（自学 / 落地）

| 步骤 | 动作 |
| --- | --- |
| 1 | 阅读官方 primary source（报告、博客、模型卡） |
| 2 | 固定 prompt 与解码参数，在自有验证集上建基线 |
| 3 | 记录延迟、成本、上下文长度与是否启用思考模式 |
| 4 | 与相邻章节对照，画出与上下游模块的数据流 |
| 5 | 在 [paper-reading](/paper-reading/) 或本大纲相关节做深度笔记 |

## 常见误区

| 误区 | 澄清 |
| --- | --- |
| 公开基准 = 产品表现 | 必须用业务端到端任务回归 |
| 长窗口 = 长理解 | 需 Needle + 真实文档任务验证 |
| 单次实验可定论 | 固定随机种子、数据版本与评测脚本 |

## 延伸练习

- 复现表中 **一行关键结论**（ablation 或小型对照实验）。
- 用 [附录 D 工具](./04-d-tools-ecosystem) 或 [lm-eval](https://github.com/EleutherAI/lm-evaluation-harness) 跑通评测脚本。
- 将未知参数整理进 [9.5.3 开放问题](../09-frontier-future/05-conclusion/03-open-questions) 个人笔记。

## 相关章节

- 技术报告：[第八部分](../08-technical-reports/)
- 评估方法：[第七部分](../07-evaluation/)
- 量化部署：[5.3](../05-inference-deployment/03-quantization/)
