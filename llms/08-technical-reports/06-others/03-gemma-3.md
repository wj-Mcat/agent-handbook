# 8.6.3 Gemma 3（Google 开源模型）

> 官方：[Gemma 文档](https://ai.google.dev/gemma) | 领读：[Gemma 2/3](/paper-reading/tech-report/international/gemma-2-3)

## 要解决的问题

Google 需在 **开放权重** 策略下提供 **设备友好** 且 **多模态** 的 Gemma 线，服务 Android/Chrome 边缘场景与研究机构基线，并与 Gemini 闭源旗舰差异化。

## 核心规格（Gemma 3 家族）

| 维度 | 要点 |
| --- | --- |
| **规模** | 1B–27B 等多档（以发布列表为准） |
| **多模态** | 图像+文本输入，统一 tokenizer 管线 |
| **上下文** | 较 Gemma 2 **显著加长**（128K 级宣传） |
| **许可** | Gemma 社区许可（商用需注意条款） |

## 架构与训练

- **Decoder-only Transformer**，GQA，SwiGLU FFN。
- 预训练：高质量网页、代码、多语言；**知识蒸馏** 自更大 Gemini 族（官方表述）。
- 后训练：**SFT + RLHF**；强调安全与对话有用性。

## 与 Gemma 2 / Llama 对比

| | Gemma 2 | Gemma 3 | Llama 3.2 |
| --- | --- | --- | --- |
| 多模态 | 弱/无 | **原生 MM** | 部分 MM |
| 边缘 | 2B 受欢迎 | **1B 优化** | 1B/3B |
| 生态 | HF 友好 | 延续 | 最大社区 |

## 工程实践

- **推理**：Google AI Edge、MediaPipe、Transformers、llama.cpp。
- **微调**：LoRA on Colab；注意 **许可** 对医疗/关键基础设施限制。
- **量化**：int4 用于手机；评测 **MMMU** 等多模态榜。

## 局限与注意点

- 社区许可 **非 Apache**；商用需法务审阅。
- 多模态 **幻觉**（图表误读）需人工审核流程。
- 旗舰能力仍 **低于** 同期 Qwen/DeepSeek 开源 MoE（任务相关）。

:::tip 学习路径

本页为 **第八部分大纲摘要**。版本差异、许可与基准领读见 [Gemma 2/3 技术报告领读](/paper-reading/tech-report/international/gemma-2-3)。

:::

## 部署与评测检查清单

| 项 | 说明 |
| --- | --- |
| 权重版本 | 核对 Hugging Face revision 与 `config.json` |
| Chat template | 与官方 tokenizer 模板一致，避免 silently truncate |
| 思考模式 | 明确 API 字段（reasoning / think budget） |
| 成本 | 测 prefill+decode $/1M tokens @ 典型并发 |
| 合规 | 许可、地域、日志留存策略 |
| 边缘指标 | 测 int4 延迟与 MM 基准子集 |

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

- 量化部署：[5.3 量化](../../05-inference-deployment/03-quantization/)
- 边缘推理：[5.6.4 边缘部署](../../05-inference-deployment/06-inference-serving/04-edge-deployment)
- 多模态评估：[7.1.4](../../07-evaluation/01-benchmarks/04-multimodal-benchmarks)
