# 8.1.1 DeepSeek-V3（MLA + DeepSeekMoE + MTP + FP8）

> 技术报告：[arXiv:2412.19437](https://arxiv.org/abs/2412.19437) | 权重：[Hugging Face DeepSeek-V3](https://huggingface.co/deepseek-ai/DeepSeek-V3)

## 要解决的问题

在 **671B MoE** 规模下，如何以 **可复现的开源权重** 达到当时闭源旗舰的综合能力，同时把 **训练 $/token** 压到行业可讨论的新低？V3 在 V2 的 MLA + MoE 路线上做 **规模化兑现**。

## 核心架构

| 组件 | 作用 |
| --- | --- |
| **MLA** | 低秩联合压缩 Q/K/V，显著降低长上下文 **KV 显存** |
| **DeepSeekMoE** | 256 routed + 共享专家；细粒度专家、**无 aux-loss 负载均衡**（动态 bias） |
| **MTP** | Multi-Token Prediction，训练时预测多个后续 token，利于吞吐与投机解码 |
| **FP8 训练** | 14.8T token 级预训练下的混合精度与 scaling 配方 |

激活约 **37B / token**（总参 671B），上下文 **128K**。

## 训练与数据

- 预训练 **~14.8T tokens**，多语言、数学、代码、推理配比优化。
- FP8 + 精细梯度 scaling，报告 **无灾难性 loss spike**。
- 后训练：SFT + RLHF 类对齐 → Instruct。

## 与 V2 / 后续版本

| 版本 | 关键增量 |
| --- | --- |
| V2 | MLA + MoE 奠基 |
| **V3** | 更大 MoE、MTP、FP8 规模化 |
| V3.2 | DSA 稀疏注意力（见 [8.1.3](./03-deepseek-v3-2)） |
| R1 | 在 V3 基座上 **纯 RL 推理**（见 [8.1.2](./02-deepseek-r1)） |

## 工程实践

- **推理**：vLLM / SGLang / Transformers；关注 MLA kernel 与 MTP 投机解码支持版本。
- **微调**：开源权重 + LoRA/全参；注意 MoE 专家并行与负载监控。
- **评测**：MATH、Codeforces、MMLU 等需固定 **thinking / 非 thinking** 协议（见第七部分）。

## 代表基准（发布时点量级）

社区与报告常引：数学、代码、多语言接近 **GPT-4o / Claude 3.5** 梯队；具体分数以官方表格为准。

## 局限与注意点

- MoE **专家负载不均** 仍影响吞吐；部署需 routed 专家并行。
- 基准 **污染** 与提示词过拟合风险（见 [7.2.4 可靠性](../../07-evaluation/02-evaluation-methods/04-reliability-contamination)）。
- Recipe（数据、FP8、均衡）不可原样照搬中小团队算力。

:::tip 学习路径

本页为 **第八部分大纲摘要**。架构拆解、训练成本讨论与链接索引见 [DeepSeek-V3 技术报告领读](/paper-reading/tech-report/deepseek/deepseek-v3)。

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

- 同系列：[8.1.2 DeepSeek-R1](./02-deepseek-r1) · [8.1.3 V3.2 DSA](./03-deepseek-v3-2)
- MLA 原理：[2.3.6 稀疏与线性注意力](../../02-transformer/03-transformer-improvements/06-sparse-attention/)
- MoE 预训练：[3.5 分布式训练](../../03-pre-training/05-distributed-training/)
