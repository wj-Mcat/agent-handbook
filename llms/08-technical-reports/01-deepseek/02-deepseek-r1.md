# 8.1.2 DeepSeek-R1（纯 RL 激发推理 + GRPO）

> 技术报告：[arXiv:2501.12948](https://arxiv.org/abs/2501.12948) | 基座：[8.1.1 DeepSeek-V3](./01-deepseek-v3)

## 要解决的问题

能否 **不靠人工 CoT 标注**，仅靠 **强化学习** 在强基座上激发 **长链数学/代码推理**，并开源权重与训练思路，推动 2025「推理模型」产品形态？

## 核心概念

| 概念 | 说明 |
| --- | --- |
| **R1-Zero** | 跳过 SFT，直接 RL → 可读性较差但证明 RL 可激发推理 |
| **R1** | 冷启动 SFT + 大规模 RL → 可读 CoT + 强推理 |
| **GRPO** | Group Relative Policy Optimization：组内相对奖励，**无需 critic** |
| **蒸馏** | 大模型 CoT 蒸馏到小稠密模型（Qwen/Llama 等） |

## 训练流程（简图）

```mermaid
flowchart LR
  v3[DeepSeek-V3 基座] --> cold[冷启动 SFT 少量长 CoT]
  cold --> rl[GRPO + 规则/模型奖励]
  rl --> r1[DeepSeek-R1]
  r1 --> distill[蒸馏到小模型]
```

## GRPO 要点

- 对同一 prompt 采样一组输出，用 **组内均值/排名** 作基线，降低方差。
- 奖励：**答案正确性**（数学、代码执行）、格式约束等；KL 约束贴近参考策略。
- 详见 [6.3.1 GRPO](../../06-reasoning-test-time-compute/03-rl-reasoning/01-grpo-rloo)。

## 工程与产品

- **推理**：默认生成长 **思考块**；API 需区分 `reasoning_content` 与最终答案。
- **成本**：输出 token 数倍于普通 Chat；需 **预算/早停**（对比 [8.2.2 Qwen3](../02-qwen/02-qwen3)）。
- **开源生态**：R1 权重 + 蒸馏模型催生开源推理榜竞争。

## 与 o1 / Qwen3 三角

| 路线 | 代表 | 特点 |
| --- | --- | --- |
| 独立推理模型 | **R1** | 专用权重，RL 主导 |
| 测试时扩展 | OpenAI o1/o3 | 闭源，测试时 compute |
| 统一双模式 | Qwen3 | `/think` 切换同一权重 |

## 局限与注意点

- CoT **可读性≠可解释性**；中间步骤可能幻觉。
- RL **奖励黑客**（格式刷分、短答案猜中）需持续监控。
- 蒸馏小模型可能 **丢失** 大模型边缘能力。

:::tip 学习路径

本页为 **第八部分大纲摘要**。GRPO 细节、实验曲线与领读笔记见 [DeepSeek-R1 技术报告领读](/paper-reading/tech-report/deepseek/deepseek-r1)。

:::

## 部署与评测检查清单

| 项 | 说明 |
| --- | --- |
| 权重版本 | 核对 Hugging Face revision 与 `config.json` |
| Chat template | 与官方 tokenizer 模板一致，避免 silently truncate |
| 思考模式 | 明确 API 字段（reasoning / think budget） |
| 成本 | 测 prefill+decode $/1M tokens @ 典型并发 |
| 合规 | 许可、地域、日志留存策略 |

## 与领读配合

- 本页 **不重复** paper-reading 全文；领读负责实验细节与引用索引。
- 更新模型版本时：**先改 paper-reading**，再回本页改摘要表。

## 外部参考（精选）

| 类型 | 入口 |
| --- | --- |
| 原始报告 | 见正文 arXiv / 官方博客链接 |
| 权重与配置 | Hugging Face `config.json` 与 model card |
| 深度领读 | 见上文 `:::tip` 或 [tech-report 索引](/paper-reading/tech-report/) |
| 工具链 | [附录 D　工具生态](../../10-appendix/04-d-tools-ecosystem) |
| 术语 | [附录 B　术语表](../../10-appendix/02-b-glossary) |

## 相关章节

- 基座：[8.1.1 DeepSeek-V3](./01-deepseek-v3)
- 测试时 compute：[6.2.1 o1/o3 范式](../../06-reasoning-test-time-compute/02-test-time-compute/01-o1-o3-paradigm)
- DPO/RLHF 对照：[4.3 RLHF](../../04-post-training-alignment/03-rlhf/) · [4.4 DPO](../../04-post-training-alignment/04-preference-optimization/01-dpo)
