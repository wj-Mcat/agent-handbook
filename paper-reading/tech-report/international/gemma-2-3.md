---
sidebar_position: 4
slug: gemma-2-3
title: "Gemma 2 / Gemma 3"
---

# Gemma 2 / Gemma 3：Google 开源多模态

## 报告信息

| 项目 | 内容 |
| --- | --- |
| 机构 | Google DeepMind |
| 发布 | Gemma 2（2024）、**Gemma 3**（2025） |
| 规格 | 1B–27B+；Gemma 3 强调多模态与设备端 |
| 官方资料 | [Gemma 官网](https://ai.google.dev/gemma)、[Hugging Face google/gemma](https://huggingface.co/google) |
| 许可 | Gemma 使用条款 |

## 定位与问题

在 Gemini 闭源产品之外，Google 通过 Gemma 提供 **可微调、可端侧部署** 的开源权重；Gemma 3 进一步统一 **文本+图像+多分辨率**，对标开源多模态与「思考」模型趋势。

## 架构要点

### Gemma 2

- 稠密架构，知识蒸馏自更大 Gemini 系教师。
- 2B/9B/27B 等尺寸，强调安全与效率。

### Gemma 3

- **多模态输入**（图像+文本），改进长上下文与多语言。
- 提供 **思考（Thinking）** 变体，对齐推理模型潮流。
- 设备端与边缘场景优化。

## 训练与数据

- 蒸馏与高质量过滤数据；Gemma 3 图文对预训练。
- 安全对齐与 Responsible AI 文档配套。

## 后训练与推理

- SFT + RL 类对齐（因版本而异）。
- 适合 Keras、Hugging Face、移动端推理框架。

## 关键结论

- Gemma 3 将 Google 开源线推进到 **多模态 + 推理** 同代竞争。
- 许可非 Apache，商用需读 Gemma Terms。

## 个人理解

Gemma 与 Llama 4、Qwen3 多模态形成 **「开源多模态第二梯队」**；若做端侧，优先看小参数 Gemma 3 变体。

## 总结

Gemma 2 = 蒸馏型稠密开源；**Gemma 3 = 多模态 + 思考 + 端侧** 一体化升级。

## 参考链接

- 官网：[https://ai.google.dev/gemma](https://ai.google.dev/gemma)
- 概览对比：[开源 LLM 技术报告索引](../)
