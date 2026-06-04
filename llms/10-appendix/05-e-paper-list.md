# 附录 E　经典论文阅读清单（按主题）

每主题 3–8 篇 **奠基或高引** 工作；优先读 **原始论文 + 本仓库 paper-reading 领读**。年份供排序，非完整引用格式。

## Transformer 与架构

| 论文 | 主题 | 大纲章节 |
| --- | --- | --- |
| Attention Is All You Need (2017) | Transformer | [2.1](../02-transformer/01-transformer-principles/) |
| RoFormer (2021) | RoPE | [2.1.4](../02-transformer/01-transformer-principles/04-positional-encoding) |
| GQA (2023) | 分组查询 | [2.2](../02-transformer/02-transformer-details/) |
| Switch Transformer (2021) | MoE | [3.5](../03-pre-training/05-distributed-training/) |
| DeepSeek-V2/V3 报告 | MLA、MoE | [8.1](../08-technical-reports/01-deepseek/) |

## 预训练与 Scaling

| 论文 | 主题 | 章节 |
| --- | --- | --- |
| Scaling Laws (Kaplan 2020) | 早期 scaling | [3.4.1](../03-pre-training/04-scaling-laws/01-kaplan-scaling-laws) |
| Chinchilla (2022) | 最优 token | [3.4.2](../03-pre-training/04-scaling-laws/02-chinchilla-scaling-laws) |
| LLaMA (2023) | 数据质量 | [8.3](../08-technical-reports/03-llama/) |
| Dolma / OLMo 2 | 开放数据 | [8.6.4](../08-technical-reports/06-others/04-olmo-2) |

## 对齐

| 论文 | 主题 | 章节 |
| --- | --- | --- |
| InstructGPT (2022) | SFT+RLHF | [4.3](../04-post-training-alignment/03-rlhf/) |
| Constitutional AI (2022) | 原则对齐 | [4.5.1](../04-post-training-alignment/05-constitutional-ai-rlaif/01-constitutional-ai) |
| DPO (2023) | 直接偏好 | [4.4.1](../04-post-training-alignment/04-preference-optimization/01-dpo) |
| LoRA (2021) | PEFT | [4.6.3](../04-post-training-alignment/06-peft/03-lora-qlora) |

## 推理与系统

| 论文 | 主题 | 章节 |
| --- | --- | --- |
| FlashAttention (2022–23) | IO-aware attention | [5.2.3](../05-inference-deployment/02-kv-cache-attention-optimization/03-flash-attention) |
| PagedAttention (2023) | vLLM | [5.2.2](../05-inference-deployment/02-kv-cache-attention-optimization/02-paged-attention) |
| Speculative Decoding (2023) | 投机解码 | [5.5.1](../05-inference-deployment/05-accelerated-decoding/01-speculative-decoding) |
| GPTQ / AWQ | 量化 | [5.3](../05-inference-deployment/03-quantization/) |

## 推理能力与测试时 compute

| 论文 | 主题 | 章节 |
| --- | --- | --- |
| Chain-of-Thought (2022) | CoT | `docs` 提示词工程 |
| DeepSeek-R1 (2025) | GRPO 推理 | [8.1.2](../08-technical-reports/01-deepseek/02-deepseek-r1) |
| Let's Verify Step by Step (2023) | PRM | [6.2.3](../06-reasoning-test-time-compute/02-test-time-compute/03-prm-vs-orm) |
| AlphaGo / MCTS 经典 | 搜索 | [6.2.4](../06-reasoning-test-time-compute/02-test-time-compute/04-mcts) |

## 长上下文与新架构

| 论文 | 主题 | 章节 |
| --- | --- | --- |
| YaRN (2023) | 位置外推 | [9.1.2](../09-frontier-future/01-long-context/02-context-extension) |
| Mamba (2023) | SSM | [9.3.1](../09-frontier-future/03-new-architectures/01-mamba-ssm) |
| RWKV (2023) | 线性 RNN | [9.3.2](../09-frontier-future/03-new-architectures/02-rwkv-retnet) |
| Jamba (2024) | 混合架构 | [9.3.3](../09-frontier-future/03-new-architectures/03-hybrid-architectures) |

## 评估

| 论文 | 主题 | 章节 |
| --- | --- | --- |
| MMLU (2020) | 综合基准 | [7.1.1](../07-evaluation/01-benchmarks/01-general-benchmarks) |
| HumanEval (2021) | 代码 | [7.1.1](../07-evaluation/01-benchmarks/01-general-benchmarks) |
| Judging LLM-as-a-Judge (2023) | 自动评测 | [7.2.2](../07-evaluation/02-evaluation-methods/02-llm-as-judge) |

## 本仓库深度领读

| 路径 | 内容 |
| --- | --- |
| [tech-report 索引](/paper-reading/tech-report/) | 开源模型技术报告 |
| [paper-reading 根](/paper-reading/) | 论文笔记 |
| [weekly-paper](/weekly-paper/) | 周刊 |

## 阅读顺序建议

1. Transformer → GPT-3/LLaMA → InstructGPT → DPO  
2. FlashAttention → vLLM 博客 → 量化 GPTQ  
3. CoT → R1 报告 → 自选 Agent 论文  

## 相关章节

- [附录 F 学习资源](./06-f-resources-community)
- [9.5.3 开放问题](../09-frontier-future/05-conclusion/03-open-questions)
