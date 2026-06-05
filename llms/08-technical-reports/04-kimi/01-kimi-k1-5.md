# Kimi K1.5（RL Scaling）

> 论文：[Kimi k1.5: Scaling Reinforcement Learning](https://arxiv.org/abs/2501.12599) | 后续：[8.4.2 Kimi K2](./02-kimi-k2)

## 要解决的问题

在 **长上下文（128K+）** 与 **多模态** 设定下，如何通过 **大规模 RL**（而非仅 SFT）持续提升数学、代码与通用推理，并为 K2 万亿 MoE Agent 模型铺路？

## 核心概念

| 概念 | 说明 |
| --- | --- |
| **RL Scaling** | 扩大 RL 步数、环境多样性与奖励信号，观察能力 **随 compute 增长** |
| **Long-CoT RL** | 在长链推理空间优化策略，配合长窗口训练数据 |
| **多模态 RL** | 图文输入下的推理与工具使用（以官方论文为准） |
| **与 R1 对照** | 同属 2025 初「RL 激发推理」浪潮，细节配方不同 |

## 方法要点

1. **强基座预训练**：长文本、代码、数学混合。
2. **SFT 冷启动**：高质量长推理样本（含合成）。
3. **RL 主阶段**：可验证奖励（代码执行、数学判定）+ 模型奖励；扩展 **采样与 rollout 规模**。
4. **推理时**：支持长 CoT；产品侧强调 **Kimi 搜索/工具** 整合。

## 与 K2 的分工

| | K1.5 | K2 |
| --- | --- | --- |
| 规模 | 未强调万亿 MoE | **1T MoE，32B 激活** |
| 优化器 | RL scaling 叙事 | **MuonClip** |
| 定位 | 推理能力验证 | **开源 Agentic 旗舰** |

## 工程观察

- **API 长上下文**：需监控 KV 与计费；128K 全满罕见，但 Agent 日志易膨胀。
- **RL 训练**：环境沙箱（代码执行）成本高于纯文本 DPO。
- 开源权重程度 **低于** K2/V3；以官方发布为准。

## 代表方向（论文摘要量级）

- 数学、代码、多步推理相对前代 **显著提升**。
- 强调 **RL compute** 与最终能力近线性/亚线性关系（待独立复现）。

## 局限与注意点

- 闭源/部分开放程度随时间变化，工程复现以 **K2 权重** 为主。
- 长 CoT **延迟与成本** 显著；需缓存与摘要策略。
- 基准对比需对齐 **是否启用思考模式**。

:::tip 学习路径

本页为 **第八部分大纲摘要**。K1.5 尚无独立 tech-report 页时，可结合 [Kimi K2 领读索引](/paper-reading/tech-report/) 与 [8.4.2 K2](./02-kimi-k2) 对照阅读；Moonshot 官方博客与 arXiv:2501.12599 为准。

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

- 续作：[8.4.2 Kimi K2](./02-kimi-k2)
- RL 推理：[6.3 GRPO / RLVR](../../06-reasoning-test-time-compute/03-rl-reasoning/)
- Agent 基准：[7.1.5 Agent 基准](../../07-evaluation/01-benchmarks/05-agent-benchmarks)
