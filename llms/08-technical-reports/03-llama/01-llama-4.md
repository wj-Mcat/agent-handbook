# 8.3.1 Llama 4（原生多模态 + iRoPE + 超长上下文）

> Meta 技术材料与社区报告 | 领读：[Llama 4 paper-reading](/paper-reading/tech-report/international/llama-4)

## 要解决的问题

Meta 需在 **开源权重** 路线中同时推进：**原生多模态**（非事后拼接）、**超长上下文**（10M 级宣传窗口）与 **MoE 效率**，并与 Llama 3.x 生态平滑迁移。

## 核心概念

| 术语 | 含义 |
| --- | --- |
| **iRoPE** | 改进 RoPE 外推，支持更长有效上下文 |
| **原生多模态** | 视觉-语言联合预训练，而非仅 LLM + 冻结 ViT 拼接 |
| **MoE 变体** | Scout / Maverick 等不同专家规模面向边缘与云端 |
| **10M context** | 产品级窗口目标；实际任务仍受 **Needle、衰减** 限制 |

## 架构要点（公开信息汇总）

- **Transformer + MoE** 混合系列；部分型号强调 **轻量激活** 适合设备端。
- **多模态塔**：图像 patch 编码与文本 token 统一序列建模。
- **上下文**：官方材料强调 **超长**；工程上需分层缓存与稀疏/压缩（社区实现进展不一）。

## 与 Llama 3.1 对比

| | Llama 3.1 | Llama 4 |
| --- | --- | --- |
| 多模态 |  Mostly 文本 | **原生 MM** |
| 上下文 | 128K 级 | **10M 目标** |
| 许可 | Llama 社区许可 | 延续社区许可框架 |
| 生态 | 极成熟 | 迁移中 |

## 工程实践

- **推理**：llama.cpp、vLLM、Transformers；多模态需 **图像预处理** 管线对齐。
- **微调**：Llama-Factory 等；注意 **许可** 对商用与蒸馏的限制。
- **评测**：除文本榜外，加 **MMMU、DocVQA** 等多模态基准。

## 局限与注意点

- **10M token** 多为理论窗口；全量 attention 成本极高，生产常用 **RAG + 截断**。
- 超长外推 **位置编码** 与训练长度不一致时，尾部质量下降（见 [9.1.2 扩展方法](../../09-frontier-future/01-long-context/02-context-extension)）。
- 与闭源 Gemini/GPT-4o 对比时注明 **是否含图像输入**。

:::tip 学习路径

本页为 **第八部分大纲摘要**。型号表、许可与基准领读见 [Llama 4 技术报告领读](/paper-reading/tech-report/international/llama-4)。

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

- 位置编码：[2.1.4 位置编码](../../02-transformer/01-transformer-principles/04-positional-encoding)
- 多模态评估：[7.1.4 多模态基准](../../07-evaluation/01-benchmarks/04-multimodal-benchmarks)
- 前作索引：[Llama 3.1 领读](/paper-reading/tech-report/international/llama-3-1)
