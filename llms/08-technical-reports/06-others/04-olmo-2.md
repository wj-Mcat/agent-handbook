# 8.6.4 OLMo 2（AI2 全开放模型）

> 项目：[Allen AI OLMo](https://allenai.org/olmo) | 领读：[OLMo 2](/paper-reading/tech-report/international/olmo-2)

## 要解决的问题

「开源」常仅开放权重；AI2 推动 **全栈开放**——数据、代码、训练日志、checkpoint 与 **可复现 recipe**，支撑学术界研究 **数据归因、遗忘、评测污染** 等。

## 核心概念

| 开放层级 | OLMo 2 提供物 |
| --- | --- |
| **权重** | 多尺寸 checkpoint |
| **数据** | Dolma 等 **可追溯** 预训练混合 |
| **代码** | 训练脚本、配置 YAML |
| **日志** | 中间 loss、scaling 实验记录 |

## 架构要点

- **稠密 Transformer**，标准 RoPE + GQA（以 2 代配置为准）。
- 规模：**7B / 13B / 32B** 等（随发布更新）。
- 强调 **训练稳定性** 与 **数据消融** 可复现，而非单一榜单 SOTA。

## 与 Llama / Qwen 定位差异

| | OLMo 2 | 商业开源旗舰 |
| --- | --- | --- |
| 目标 | **科研可复现** | 产品 SOTA |
| 数据 | 公开混合配方 | 部分保密 |
| 许可 | Apache 2.0（以版本为准） | 各异 |

## 工程实践

- **复现预训练**：需 **多机 GPU** 与 AI2 容器；适合实验室而非初创产品首版。
- **微调**：在 OLMo 上继续 SFT/DPO 研究 **数据效率**。
- **评测**：用 **OLMES** 等开放评测套件减少泄漏。

## 研究用途示例

1. **数据剔除实验**：从 Dolma 移除子集测下游影响。
2. **Scaling law** 拟合：公开 log 拟合 loss-算力曲线。
3. **对齐研究**：同一基座比较 RLHF vs DPO。

## 局限与注意点

- 同等算力下 **榜单分数** 常低于 DeepSeek/Qwen 旗舰（非首要目标）。
- 全量预训练 **成本极高**，多数团队仅用 released checkpoint 微调。
- 数据开放带来 **合规** 责任（PII、版权过滤需自行复核）。

:::tip 学习路径

本页为 **第八部分大纲摘要**。Dolma 配方、训练曲线与领读见 [OLMo 2 技术报告领读](/paper-reading/tech-report/international/olmo-2)。

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

- 数据源：[3.1.1 数据来源](../../03-pre-training/01-pretraining-data/01-data-sources)
- 评测可靠性：[7.2.4](../../07-evaluation/02-evaluation-methods/04-reliability-contamination)
- 数据许可：[3.1.5 数据许可](../../03-pre-training/01-pretraining-data/05-data-licensing)
