---
sidebar_position: 1
slug: glm-4-family
title: "GLM-4 / ChatGLM 家族技术报告"
---

# GLM-4 家族：ChatGLM 技术报告

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | 智谱 AI / 清华 KEG 等 |
| 发布 | 2024 年（ChatGLM 家族技术报告） |
| 代表产品 | GLM-4 API、GLM-4-9B 开源系列（128K / 1M） |
| 官方报告 | [arXiv:2406.12793](https://arxiv.org/abs/2406.12793) |
| 权重 | [Hugging Face THUDM](https://huggingface.co/THUDM)、[zai-org](https://huggingface.co/zai-org) |

## 定位与问题

在 ChatGLM-6B/2/3 积累的中文对话生态上，GLM-4 面向 **通用对话、工具调用、长上下文** 升级，并通过 **9B 开源** 降低部署门槛，与 Llama 3、Qwen2 等同期开源模型竞争。

## 架构要点

- **GLM 架构**：自回归空白填充（AutoRegressive Blank Infilling）传统，在 4 代继续优化中英双语与对话模板。
- **长上下文**：API 版 128K；开源 9B 提供 128K 与 **1M** 上下文变体（工程优化为主）。
- **GLM-4 All Tools**：智能体版本，集成浏览器、代码解释器等工具编排。

## 训练与数据

- 预训练与对齐细节在报告中分阶段描述，强调 **中文、工具、多轮对话** 数据。
- 9B 系列将旗舰能力 **蒸馏/压缩** 到小模型，便于端侧与二次开发。

## 后训练与推理

- SFT + 人类偏好对齐；All Tools 强化 **Agent 工作流**。
- 工具调用与 Function Call 场景是产品差异化之一。

## 关键结论

- 报告系统总结 ChatGLM 1–4 演进与评测，9B 开源在中文、代码等场景具备竞争力。
- 为后续 **GLM-4.5 MoE（ARC）** 奠定品牌与工具生态。

## 个人理解

读 GLM-4 家族宜与 **Qwen2.5、DeepSeek-V2** 同期对照：三家都在 2024 下半年把「长上下文 + 工具」做成标配；4.5 才是 MoE 与 ARC 的主战场。

## 总结

GLM-4 家族报告 = 智谱 **对话栈总览** + 9B 开源抓手；Agent 能力在 All Tools，规模能力在 4.5 续作。

## 参考链接

- 技术报告：[https://arxiv.org/abs/2406.12793](https://arxiv.org/abs/2406.12793)
- 后续：[GLM-4.5](./glm-4-5)
- 概览对比：[开源 LLM 技术报告索引](../)
