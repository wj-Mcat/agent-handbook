---
sidebar_position: 2
slug: glm-4-5
title: "GLM-4.5 Technical Report"
---

# GLM-4.5：ARC 与混合推理

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | 智谱 AI |
| 发布 | 2025 年 7 月（GLM-4.6 于 2025.09 迭代） |
| 旗舰规格 | **355B** 总参数，激活约 **32B**（MoE） |
| 官方报告 | [arXiv:2508.06471](https://arxiv.org/abs/2508.06471) |
| 权重 | [GitHub zai-org/GLM-4.5](https://github.com/zai-org/GLM-4.5)、[Hugging Face](https://huggingface.co/zai-org) |

## 定位与问题

面向 **Agentic、Reasoning、Coding（ARC）** 统一基座：在开源权重上与 DeepSeek-V3.1、Claude Sonnet 4 等对标，强调 **真实编程/Agent 框架** 中的表现而非单一榜单。

## 架构要点

- **MoE**：355B-A32B，兼顾容量与推理成本。
- **混合推理（Hybrid Reasoning）**：可开关「思考模式」，在深度推理与低延迟回复间切换。
- **上下文**：GLM-4.5 为 128K；**GLM-4.6** 扩展至 **200K**（报告/博客续作）。
- **工具**：原生支持代码解释器、搜索等，对接 Claude Code、Cline、Roo Code 等。

## 训练与数据

- 大规模 **Agentic 与代码** 数据合成与真实环境反馈。
- 对齐阶段强化工具调用轨迹与多步任务成功率。

## 后训练与推理

- SFT + 偏好优化 + 推理模式专用数据。
- **MIT 许可** 开放权重，利于商业二次开发。

## 关键结论

- 在 SWE-bench、工具调用、多轮 Agent 等场景报告竞争力。
- GLM-4.6 在编程与 200K 上下文上进一步迭代（架构参考同报告系列）。

## 个人理解

GLM-4.5 与 Qwen3「/think 统一」、DeepSeek-R1「纯 RL 推理」代表三种 **推理产品化** 路径；若做 Agent 应用，建议优先实测工具链兼容性。

## 总结

GLM-4.5 = 智谱 **ARC 旗舰**：MoE 规模 + 混合推理 + Agent/代码优先，4.6 加长上下文与编程增强。

## 参考链接

- 技术报告：[https://arxiv.org/abs/2508.06471](https://arxiv.org/abs/2508.06471)
- 前作：[GLM-4 家族](./glm-4-family)
- 概览对比：[开源 LLM 技术报告索引](../)
