# 8.6.5 Mistral / Mixtral 系列

> 官方：[Mistral AI](https://mistral.ai) | 领读：[Mistral / Mixtral](/paper-reading/tech-report/international/mistral-mixtral)

## 要解决的问题

欧洲团队需以 **高效稠密小模型（Mistral 7B）** 与 **开源 MoE（Mixtral 8x7B/8x22B）** 抢占「同等算力更强性能」心智，并延续 **Apache 2.0** 友好生态。

## 系列演进

| 代际 | 代表 | 要点 |
| --- | --- | --- |
| **Mistral 7B** | v0.1/v0.2/v0.3 | SWA 滑动窗口、GQA，小而强 |
| **Mixtral 8x7B** | MoE | 8 专家、每 token 2 专家，47B 总参 ~13B 激活 |
| **Mixtral 8x22B** | 更大 MoE | 旗舰开源 MoE 竞争者（发布期） |
| **Mistral Large / Small** | 闭源/API | 商业旗舰与边缘型号 |

## Mixtral MoE 结构

- **Router**：每 token 选 top-2 专家 FFN。
- **负载均衡**：辅助损失防专家塌陷。
- **推理**：专家并行；batch 内专家分布影响延迟。

## 工程实践

- **推理**：vLLM 对 Mixtral 支持成熟；注意 **EP（Expert Parallel）** 配置。
- **微调**：LoRA 仅适配激活专家；全参 MoE 微调成本高。
- **Agent**：Mistral 官方 **function calling** 模板；与 LangChain 等集成广。

## 与 DeepSeekMoE / Qwen3 MoE

| | Mixtral | DeepSeek-V3 | Qwen3 MoE |
| --- | --- | --- | --- |
| 专家数 | 8 | 256 | 128 |
| 激活专家 | 2 | 8+routed | 8 |
| 特色 | 早期开源 MoE 标杆 | MLA+无 aux 均衡 | 无共享专家 |

## 局限与注意点

- 7B 模型 **知识容量** 有限，复杂推理需更大或 R1 类模型。
- MoE **内存占用** 含全部专家权重，部署显存仍大。
- 2025 后 SOTA 重心转向 **万亿 MoE**（Kimi K2 等），Mixtral 更多作 **效率基线**。

:::tip 学习路径

本页为 **第八部分大纲摘要**。各型号参数、许可与历史基准见 [Mistral / Mixtral 技术报告领读](/paper-reading/tech-report/international/mistral-mixtral)。

:::

## 部署与评测检查清单

| 项 | 说明 |
| --- | --- |
| 权重版本 | 核对 Hugging Face revision 与 `config.json` |
| Chat template | 与官方 tokenizer 模板一致，避免 silently truncate |
| 思考模式 | 明确 API 字段（reasoning / think budget） |
| 成本 | 测 prefill+decode $/1M tokens @ 典型并发 |
| 合规 | 许可、地域、日志留存策略 |
| MoE 部署 | 确认 EP 与专家负载监控告警 |

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

- MoE 训练：[3.5 分布式](../../03-pre-training/05-distributed-training/)
- 张量并行：[3.5.2 张量并行](../../03-pre-training/05-distributed-training/02-tensor-parallelism)
- 技术报告索引：[paper-reading tech-report](/paper-reading/tech-report/)
