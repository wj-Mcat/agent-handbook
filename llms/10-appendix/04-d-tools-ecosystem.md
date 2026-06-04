# 附录 D　开源工具与框架生态地图

按 **训练 → 对齐 → 推理 → 应用 → 评测** 分层。链接以官方仓库为准（2025）；选型时看 **许可证、GPU 支持、社区活跃度**。

## 训练与分布式

| 工具 | 用途 |
| --- | --- |
| **PyTorch** | 基础框架 |
| **DeepSpeed** | ZeRO、流水线、推理 |
| **Megatron-LM** | 大规模 TP/PP |
| **FSDP** | PyTorch 原生分片 |
| **NeMo** | NVIDIA 端到端 |
| **torchtitan** | Meta 预训练参考 |
| **AI2 OLMo** | 全开放训练栈 |

## 微调与对齐

| 工具 | 用途 |
| --- | --- |
| **Hugging Face TRL** | SFT、DPO、PPO |
| **LLaMA-Factory** | 一站式微调 UI |
| **Axolotl** | YAML 驱动微调 |
| **Unsloth** | 快速 LoRA |
| **peft** | LoRA/Adapter 库 |
| **OpenRLHF** | RLHF 分布式 |
| **verl** | RL 训练（GRPO 等） |

## 推理与服务

| 工具 | 用途 |
| --- | --- |
| **vLLM** | 生产级 LLM 服务、PagedAttention |
| **SGLang** | 结构化生成、RadixAttention |
| **TensorRT-LLM** | NVIDIA 优化推理 |
| **llama.cpp** | CPU/边缘 GGUF |
| **ollama** | 本地模型管理 |
| **TGI** | HF Text Generation Inference |
| **litellm** | 多 API 统一网关 |

## 量化与压缩

| 工具 | 用途 |
| --- | --- |
| **bitsandbytes** | 8/4bit 训练推理 |
| **GPTQ / AutoGPTQ** | 权重量化 |
| **AWQ** | 激活感知量化 |
| **GGUF** | llama.cpp 格式生态 |

## 数据与分词

| 工具 | 用途 |
| --- | --- |
| **Hugging Face datasets** | 数据加载 |
| **datatrove** | 大规模清洗 |
| **sentencepiece** | 分词训练 |
| **tiktoken** | BPE（OpenAI 风格） |

## Agent 与 RAG

| 工具 | 用途 |
| --- | --- |
| **LangChain** | 链式编排 |
| **LlamaIndex** | 数据索引 RAG |
| **Haystack** | 企业 RAG |
| **LangGraph** | 有状态 Agent 图 |
| **Semantic Kernel** | 微软 Agent SDK |
| **OpenAI Agents SDK** | 官方 Agent 框架 |

## 评测与监控

| 工具 | 用途 |
| --- | --- |
| **lm-eval-harness** | 标准基准套件 |
| **OpenCompass** | 中文等多基准 |
| **EleutherAI eval harness** | 研究评测 |
| **Weights & Biases** | 实验跟踪 |
| **MLflow** | 模型注册 |
| **Langfuse / Phoenix** | LLM 可观测 |

## 约束解码与格式

| 工具 | 用途 |
| --- | --- |
| **Outlines** | 结构化生成 |
| **guidance** | 模板约束 |
| **json schema mode** | 各 API 内置 |

## 选型建议（简）

| 场景 | 推荐组合 |
| --- | --- |
| 研究微调 | HF + peft + TRL |
| 生产 API | vLLM 或 SGLang + litellm |
| 笔记本实验 | ollama + LLaMA-Factory |
| Agent MVP | LangGraph + 自有评测集 |

## 相关章节

- 分布式训练：[3.5](../03-pre-training/05-distributed-training/)
- 推理框架：[5.6.1](../05-inference-deployment/06-inference-serving/01-inference-frameworks)
- 量化：[5.3](../05-inference-deployment/03-quantization/)
- 本仓库 Agent：`docs/`
