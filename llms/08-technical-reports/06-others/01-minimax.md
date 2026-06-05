# MiniMax-01 / MiniMax-M1（闪电注意力 + 超长上下文）

> 领读：[MiniMax-01](/paper-reading/tech-report/minimax/minimax-01) · [MiniMax-M1](/paper-reading/tech-report/minimax/minimax-m1)

## 要解决的问题

在 **百万 token 级上下文** 目标下，如何避免标准 attention 的 $O(L^2)$ 显存与算力爆炸？MiniMax 系列采用 **Lightning Attention（线性注意力变体）** + 混合层，兼顾长文与推理质量。

## 核心架构

| 组件 | 作用 |
| --- | --- |
| **Lightning Attention** | 核特征映射近似 softmax attention，**线性复杂度** 主导层 |
| **标准 Attention 块** | 周期性插入，恢复 **精确局部/全局** 交互 |
| **MoE（M1）** | 扩大容量同时控制激活参数量 |
| **超长窗口** | 01 强调 **1M+** 上下文能力（工程实现依赖定制 kernel） |

## MiniMax-01 vs M1

| | MiniMax-01 | MiniMax-M1 |
| --- | --- | --- |
| 侧重 | 超长上下文基座 | **推理增强** + MoE |
| 注意力 | Lightning 混合 | 延续 + RL/后训练 |
| 场景 | 全书/法律/日志 RAG | 数学、代码、Agent |

## 工程实践

- **推理**：需厂商或社区 **专用 kernel**；通用 FlashAttention 路径可能不适用全部层。
- **评测**：除 [9.1.3 Needle](../../09-frontier-future/01-long-context/03-needle-in-haystack) 外，测 **真实检索+生成** 端到端延迟。
- **RAG**：长上下文可减少分块，但 **成本仍随 L 线性/超线性** 增长。

## 与 Transformer 路线关系

- 属于 **9.3 新架构** 中「线性/稀疏 attention」产业化的案例。
- 与 [Mamba](../../09-frontier-future/03-new-architectures/01-mamba-ssm)、[NSA/DSA](../../02-transformer/03-transformer-improvements/06-sparse-attention/) 并列，**无单一赢家**。

## 局限与注意点

- 线性 attention **近似误差** 在精确拷贝任务上可能弱于全 attention。
- 1M 窗口 **很少满载**；营销窗口 ≠ 有效理解长度。
- 开源权重与推理栈 **成熟度** 低于 Llama/Qwen 生态。

:::tip 学习路径

本页为 **第八部分大纲摘要**。Lightning Attention 细节与基准见 [MiniMax-01 领读](/paper-reading/tech-report/minimax/minimax-01) 与 [MiniMax-M1 领读](/paper-reading/tech-report/minimax/minimax-m1)。

:::

## 部署与评测检查清单

| 项 | 说明 |
| --- | --- |
| 权重版本 | 核对 Hugging Face revision 与 `config.json` |
| Chat template | 与官方 tokenizer 模板一致，避免 silently truncate |
| 思考模式 | 明确 API 字段（reasoning / think budget） |
| 成本 | 测 prefill+decode $/1M tokens @ 典型并发 |
| 合规 | 许可、地域、日志留存策略 |
| 长文压测 | 记录 prefill 时间随 $L$ 变化曲线 |

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

- 线性注意力：[2.3.6.5 线性注意力](../../02-transformer/03-transformer-improvements/06-sparse-attention/05-linear-attention)
- 长上下文：[9.1 长上下文](../../09-frontier-future/01-long-context/)
- KV 优化：[5.2 KV Cache](../../05-inference-deployment/02-kv-cache-attention-optimization/)
- 全站索引：[LLMs 入口](/llms/intro)
