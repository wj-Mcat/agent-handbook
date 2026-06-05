# Qwen3（思考/非思考统一 + 思考预算）

> 技术报告：[arXiv:2505.09388](https://arxiv.org/abs/2505.09388) | 许可：Apache 2.0

## 要解决的问题

避免「Chat 模型」与「推理模型」**权重分裂**：用户通过 `/think`、`/no_think`（或 API 等价字段）在同一 checkpoint 上切换快慢路径，并用 **Thinking Budget** 控制推理 token 与延迟。

## 核心架构

| 项目 | 说明 |
| --- | --- |
| **系列** | 0.6B–235B，稠密 + MoE |
| **MoE 旗舰** | **235B 总参 / 22B 激活**；128 专家、每 token 8 专家，**无共享专家** |
| **注意力** | GQA，**128K** 上下文 |
| **多模态** | 部分 checkpoint 支持图文（以官方列表为准） |

## 训练亮点

- 预训练 **36T+ tokens**；语言扩展至 **119** 种。
- **强弱蒸馏**：旗舰 → 小模型，降低小尺寸训练成本。
- 后训练：SFT + RL，在 **统一框架** 内学习思考与非思考行为。

## 思考预算（Thinking Budget）

$$
\text{latency} \approx f(\text{budget}_{\text{think}},\ \text{prompt},\ \text{task difficulty})
$$

- 简单任务：`/no_think` 或低 budget → 接近普通 Chat 延迟。
- 复杂数学/代码：提高 budget → 更长 CoT，对标 R1/o 系列。
- 产品需暴露 **预算旋钮** 与计费策略（见 [6.2 测试时 compute](../../06-reasoning-test-time-compute/02-test-time-compute/)）。

## 与竞品形态对比

| 厂商 | 形态 |
| --- | --- |
| DeepSeek | **R1 独立推理权重** |
| OpenAI | o 系列 **测试时扩展**（闭源） |
| **Qwen3** | **单权重双模式** + budget |
| GLM-4.5 | ARC 统一 Agent/推理/代码 |

## 工程实践

- SDK 需实现 **模式切换** 与 `enable_thinking` 类参数。
- 评测报告应分列 **thinking / non-thinking** 分数。
- 小模型蒸馏版适合边缘；旗舰 MoE 需专家并行推理栈。

## 局限与注意点

- 高 budget 下 **成本接近** 独立推理模型。
- `/think` 协议未统一行业标准，跨框架移植需适配 template。
- 多语言 119 种 **质量不均**，低资源语言需单独评测。

:::tip 学习路径

本页为 **第八部分大纲摘要**。完整基准、MoE 均衡与领读笔记见 [Qwen3 技术报告领读](/paper-reading/tech-report/qwen/qwen3)。

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

## 相关章节

- 前代：[8.2.1 Qwen2.5](./01-qwen2-5)
- 对比 R1：[8.1.2 DeepSeek-R1](../01-deepseek/02-deepseek-r1)
- 采样与长度：[5.1.2 采样策略](../../05-inference-deployment/01-inference-basics/02-sampling-strategies)
