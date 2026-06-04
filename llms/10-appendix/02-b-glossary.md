# 附录 B　常用术语中英对照表

按主题分组；英文缩写首次给出全称。细节见正文对应章节。

## 模型与架构

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| LLM | 大语言模型 | [1.1.1](../01-foundations/01-introduction/01-what-is-llm) |
| Foundation Model | 基础模型 | 预训练基座 |
| Transformer | Transformer | 主流骨干 |
| MoE | 混合专家 | Mixture-of-Experts |
| MLA | 多头潜在注意力 | DeepSeek 系 KV 压缩 |
| GQA | 分组查询注意力 | Grouped-Query Attention |
| MHA | 多头注意力 | Multi-Head Attention |
| FFN / MLP | 前馈网络 | 常 SwiGLU |
| RoPE | 旋转位置编码 | Rotary Position Embedding |
| SSM | 状态空间模型 | Mamba 等 |
| VLA | 视觉-语言-动作 | 具身模型 |

## 预训练与数据

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| Pre-training | 预训练 | 自监督 |
| Causal LM | 因果语言建模 | GPT 类 |
| MLM | 掩码语言建模 | BERT 类 |
| BPE | 字节对编码 | 分词 |
| Tokenizer | 分词器 | |
| Corpus | 语料库 | |
| Dedup | 去重 | |
| Data mixture | 数据混合 | 配方 |
| Chinchilla | Chinchilla 法则 | 算力最优分配 |
| Scaling law | 缩放定律 | |
| Emergent ability | 涌现能力 | 有争议 |

## 后训练与对齐

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| SFT | 监督微调 | Supervised Fine-Tuning |
| RLHF | 人类反馈强化学习 | |
| RM | 奖励模型 | Reward Model |
| PPO | 近端策略优化 | |
| DPO | 直接偏好优化 | |
| IPO / KTO / ORPO | 偏好优化变体 | 见 4.4 |
| Constitutional AI | 宪法 AI | |
| RLAIF | AI 反馈强化学习 | |
| LoRA | 低秩适配 | |
| QLoRA | 量化 LoRA | |
| PEFT | 参数高效微调 | |
| Catastrophic forgetting | 灾难性遗忘 | |

## 推理与部署

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| KV cache | KV 缓存 | |
| TTFT | 首 token 时间 | Time To First Token |
| Throughput | 吞吐 | tokens/s |
| Quantization | 量化 | INT8/FP8/4bit |
| Speculative decoding | 投机解码 | |
| Continuous batching | 连续批处理 | |
| PagedAttention | 分页注意力 | vLLM |
| FlashAttention | FlashAttention | IO 友好 attention |

## 推理与 Agent

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| CoT | 思维链 | Chain-of-Thought |
| Test-time compute | 测试时算力 | |
| PRM | 过程奖励模型 | Process RM |
| ORM | 结果奖励模型 | Outcome RM |
| GRPO | 组相对策略优化 | DeepSeek-R1 |
| RLVR | 可验证奖励 RL | |
| MCTS | 蒙特卡洛树搜索 | |
| Agent | 智能体 | 工具+规划 |
| RAG | 检索增强生成 | |
| Function Call | 函数调用 | |
| Tool use | 工具使用 | |

## 评估

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| Benchmark | 基准 | |
| MMLU | 大规模多任务语言理解 | |
| HumanEval | 代码生成评测 | |
| LLM-as-judge | 模型作裁判 | |
| Contamination | 基准污染 | |
| Needle in haystack | 大海捞针 | 长上下文 |

## 系统与分布式

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| Data parallel | 数据并行 | |
| Tensor parallel | 张量并行 | |
| Pipeline parallel | 流水线并行 | |
| ZeRO | ZeRO 优化器分片 | DeepSpeed |
| FSDP | 全分片数据并行 | PyTorch |
| EP | 专家并行 | MoE |
| MFU | 模型 FLOPs 利用率 | |

## 安全与前沿

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| Alignment | 对齐 | |
| Jailbreak | 越狱 | |
| Prompt injection | 提示注入 | |
| Hallucination | 幻觉 | |
| World model | 世界模型 | |
| AGI | 通用人工智能 | 定义不一 |
| RSI | 递归自举改进 | Recursive SI |

## 相关章节

- 数学符号：[附录 A](./01-a-math-notation)
- 模型对照：[附录 C](./03-c-model-comparison)
- 工具生态：[附录 D](./04-d-tools-ecosystem)
