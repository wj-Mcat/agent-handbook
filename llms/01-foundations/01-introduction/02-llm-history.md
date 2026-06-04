# 1.1.2 LLM 发展简史（从图灵到 GPT-4 / Claude / Gemini）

> 更完整时间线见 [LLMs 发展历程](../../00-intro)。

## 要解决的问题

理解 LLM 从何而来，有助于判断 **哪些思想是长期主线**（缩放、Transformer、自监督），哪些是 **工程阶段性方案**（特定对齐算法、推理加速）。

## 阶段划分

| 时期 | 里程碑 | 要点 |
| --- | --- | --- |
| 1950s–2010s | 图灵测试、统计 LM、神经网络复兴 | N-gram → Word2Vec → LSTM/Seq2Seq |
| 2017 | **Transformer** | 自注意力取代 RNN 主干 |
| 2018–2019 | BERT、GPT-2 | 双向编码 vs 自回归生成 |
| 2020 | GPT-3 | 少样本提示、规模效应进入公众视野 |
| 2022 | ChatGPT、开源 Llama | RLHF 产品化、开源生态爆发 |
| 2023–2024 | GPT-4、Claude 3、Gemini、开源 MoE | 多模态、长上下文、Agent |
| 2024–2026 | o1/R1、DeepSeek-V3/V4、Qwen3 | **推理时计算**、稀疏注意力、百万上下文、超稀疏 MoE |

## 三条技术主线

1. **架构**：RNN → Transformer → MoE / 稀疏注意力 / SSM 探索
2. **训练**：预训练规模 ↑ → 指令微调 → 偏好优化 / 纯 RL 推理（R1）
3. **系统**：单卡 → 3D 并行 → FlashAttention / FP8 / 推测解码 / SGLang

## 开源 vs 闭源

2023 年后 **Llama、Qwen、DeepSeek** 等缩小与闭源旗舰的能力差距；技术报告领读见 [第八部分](../../08-technical-reports/) 与 [paper-reading/tech-report](/paper-reading/tech-report/)。

## 与本大纲的对应

| 时代关键词 | 本仓库章节 |
| --- | --- |
| Transformer | [第二部分](../../02-transformer/) |
| 预训练 / Scaling | [第三部分](../../03-pre-training/) |
| 对齐 / DPO / RLHF | [第四部分](../../04-post-training-alignment/) |
| 推理 / 量化 | [第五部分](../../05-inference-deployment/) |
| 推理模型 o1/R1 | [第六部分](../../06-reasoning-test-time-compute/) |

## 参考链接

- [00-intro 时间线](../../00-intro)
- [1.1.1 什么是大语言模型](./01-what-is-llm)
