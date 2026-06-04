---
sidebar_position: 3
title: 1.1.3 技术全景
---

# LLM 技术栈全景

本文将系统梳理大型语言模型（LLM）从原始数据采集、模型架构设计、预训练、对齐调优、推理部署到实际应用和安全评估的全流程技术栈。我们将按照数据、架构、训练方法、对齐机制、推理优化、实际落地应用以及安全与评估等核心环节逐步展开，并对每个环节中最具代表性的技术要点和典型做法做简要介绍，帮助读者对 LLM 领域的完整技术链路有一个全面、结构化的宏观认知，也方便后续深入查阅各技术细节。适合用于 LLM 开发、学习和参考使用。

---

## 一、数据工程(Data)

- **数据采集**:从 Common Crawl、网页、书籍、代码、论文等多源抓取原始语料。
- **数据清洗**:去除乱码、模板、广告、低质内容,语言识别与质量打分。
- **数据去重**:文档级 / 句子级去重,常用 MinHash、SimHash、精确子串去重,缓解记忆与污染。
- **数据配比(Data Mixture)**:控制各领域(代码/数学/中英文等)比例,直接影响模型能力分布。
- **数据合成(Synthetic Data)**:用强模型生成指令、推理链、代码等数据,弥补真实数据稀缺。
- **分词(Tokenization)**:BPE / Byte-level BPE / SentencePiece / Unigram,词表设计影响压缩率与多语言表现。
- **课程学习(Curriculum)**:按难度或质量分阶段喂数据,后期常提高高质量数据占比。

---

## 二、模型架构(Architecture)

- **Transformer**:自注意力 + 前馈网络,LLM 的基础骨架。
- **Decoder-only / Encoder-Decoder**:主流生成模型多为 Decoder-only(GPT 系),翻译/理解任务用 Encoder-Decoder。
- **位置编码**:绝对位置编码、RoPE(旋转位置编码)、ALiBi、NoPE,决定外推与长文能力。
- **注意力变体**:MHA → MQA → GQA → MLA,逐步压缩 KV Cache 以提升推理效率。
- **注意力优化**:FlashAttention(IO 感知)、滑动窗口注意力、稀疏 / 线性注意力。
- **归一化**:LayerNorm、RMSNorm,Pre-Norm 提升训练稳定性。
- **激活函数**:GeLU、SwiGLU、GeGLU,门控类激活已成主流。
- **MoE(混合专家)**:稀疏激活,用更大参数量换取近似稠密的推理成本(路由、负载均衡是关键)。
- **状态空间模型 / 混合架构**:Mamba(SSM)、线性注意力与 Transformer 混合,降低长序列复杂度。

---

## 三、预训练(Pre-training)

- **自回归语言建模**:Next-Token Prediction,LLM 最核心的预训练目标。
- **长文预训练(Long-context)**:在长序列上继续训练以扩展上下文窗口。
- **继续预训练(Continual Pretraining)**:在通用模型上注入领域 / 语言知识。
- **多阶段预训练**:不同阶段切换数据配比与序列长度(如最后退火 annealing 阶段)。
- **学习率调度**:Warmup + Cosine / WSD(Warmup-Stable-Decay)等。
- **优化器**:Adam / AdamW,以及 Lion、Muon 等新型优化器。
- **Scaling Laws**:参数量、数据量、算力的幂律关系(Chinchilla 最优配比)。
- **训练稳定性**:Loss Spike 处理、梯度裁剪、初始化、数值稳定。

---

## 四、后训练与对齐(Post-training / Alignment)

- **SFT(监督微调)**:用高质量指令-回答对让模型学会遵循指令。
- **指令微调(Instruction Tuning)**:多任务指令数据提升泛化与可用性。
- **奖励建模(Reward Model)**:训练打分模型刻画人类偏好。
- **RLHF**:基于人类反馈的强化学习,经典用 PPO。
- **DPO 及变体**:DPO / IPO / KTO / ORPO / SimPO,免奖励模型的直接偏好优化。
- **RLAIF / Constitutional AI**:用 AI 反馈替代人工标注做对齐。
- **拒绝采样(Rejection Sampling)**:采样多个回答择优用于再训练。
- **RLVR(可验证奖励的 RL)**:在数学 / 代码等有标准答案的任务上做强化。
- **推理训练(Reasoning / Long-CoT)**:训练模型生成长思维链,做测试时扩展(o1 类范式)。

---

## 五、高效微调(PEFT)

- **LoRA**:低秩矩阵适配,只训练少量参数。
- **QLoRA**:在量化模型上做 LoRA,显著降低显存。
- **DoRA**:权重分解方向 + 幅度的改进版 LoRA。
- **Adapter**:插入小型适配层。
- **Prefix / Prompt / P-Tuning**:训练软提示向量而非模型权重。

---

## 六、训练系统与效率(Training Systems)

- **混合精度训练**:FP16 / BF16 / FP8,在精度与速度间权衡。
- **量化训练(QAT)**:训练时模拟量化,降低低比特推理的精度损失。
- **数据并行(DP)**:复制模型、切分数据。
- **张量并行(TP)**:切分单层矩阵运算到多卡。
- **流水线并行(PP)**:按层切分到不同设备。
- **序列 / 专家并行(SP / EP)**:切分序列维或 MoE 专家。
- **ZeRO / FSDP**:切分优化器状态、梯度、参数以省显存。
- **梯度检查点 / 重计算**:用算力换显存。
- **3D 并行 + 通信重叠**:大规模训练的组合策略。

---

## 七、推理与部署(Inference / Serving)

- **KV Cache**:缓存历史 Key/Value 避免重复计算。
- **Speculative Decoding(推测解码)**:用小模型草稿、大模型验证,加速生成(变体:Medusa、EAGLE、Lookahead)。
- **量化(PTQ)**:GPTQ / AWQ / INT8 / INT4 / FP8,降低显存与延迟。
- **剪枝(Pruning)**:去除冗余权重 / 结构。
- **知识蒸馏(Distillation)**:大模型教小模型,压缩能力。
- **连续批处理(Continuous Batching)**:动态拼批提升吞吐。
- **PagedAttention**:分页管理 KV Cache(vLLM 核心)。
- **Prefill / Decode 分离**:预填充与解码阶段分别调度优化。
- **Prefix Caching**:复用公共前缀的 KV。
- **解码策略**:Greedy / Beam / Top-k / Top-p / Temperature。
- **结构化输出**:约束解码,保证 JSON / 语法合法。
- **服务框架**:vLLM、SGLang、TGI、TensorRT-LLM。

---

## 八、长上下文(Long Context)

- **位置插值**:Position Interpolation、NTK-aware、YaRN,扩展窗口而少训练。
- **长文预训练 / 微调**:在长序列数据上继续训练。
- **KV Cache 压缩 / 驱逐**:丢弃或压缩不重要的历史。
- **稀疏 / 线性注意力**:降低长序列的计算复杂度。

---

## 九、检索增强(RAG)

- **RAG**:检索外部知识拼入上下文,缓解知识陈旧与幻觉。
- **Embedding 模型**:文本向量化,支撑语义检索。
- **向量数据库**:存储与近似最近邻检索(ANN)。
- **文档分块(Chunking)**:切分文档以适配检索粒度。
- **重排序(Reranking)**:对召回结果精排提升相关性。
- **GraphRAG**:结合知识图谱的结构化检索。

---

## 十、智能体与工具(Agent / Tool Use)

- **Function Calling / Tool Use**:模型调用外部 API / 工具。
- **ReAct**:推理与行动交替的范式。
- **规划(Planning)**:任务分解与多步执行。
- **记忆(Memory)**:短期 / 长期记忆管理。
- **多智能体(Multi-Agent)**:多个角色协作。
- **MCP(Model Context Protocol)**:标准化的模型-工具连接协议。
- **Computer / Browser Use**:操作图形界面、浏览器完成任务。

---

## 十一、多模态(Multimodal)

- **视觉编码器**:ViT / CLIP 提取图像特征。
- **模态对齐**:Projector / Cross-Attention 将视觉特征接入语言模型。
- **多模态理解**:图像、视频、音频的理解与问答。
- **多模态生成**:文生图 / 文生视频 / 语音合成。
- **统一多模态**:单模型统一理解与生成。

---

## 十二、提示工程(Prompt Engineering)

- **In-Context Learning**:Zero-shot / Few-shot,靠上下文示例学习。
- **Chain-of-Thought(CoT)**:引导逐步推理。
- **Self-Consistency**:多次采样投票取最一致答案。
- **Tree of Thoughts(ToT)**:树状探索多条推理路径。
- **System Prompt / 模板**:角色设定与输出规范。

---

## 十三、评估(Evaluation)

- **基准测试**:MMLU、GSM8K、HumanEval、MATH 等。
- **LLM-as-a-Judge**:用强模型自动评分。
- **竞技场 / Elo**:人类对比投票排名(如 LMArena)。
- **红队测试(Red Teaming)**:主动找漏洞与有害输出。
- **数据污染检测**:防止测试集泄漏进训练数据。

---

## 十四、安全与可信(Safety & Trust)

- **有害内容过滤 / Guardrails**:输入输出审查。
- **越狱防御(Jailbreak Defense)**:抵御提示注入与绕过。
- **价值对齐**:让模型行为符合人类价值与规范。
- **幻觉缓解(Hallucination)**:事实性增强与不确定性表达。
- **可解释性(Interpretability)**:机制可解释、特征 / 电路分析。
- **水印(Watermarking)**:标记 AI 生成内容。

---

## 十五、基础设施(Infrastructure)

- **加速硬件**:GPU / TPU / 专用 NPU。
- **训练框架**:Megatron-LM、DeepSpeed、PyTorch FSDP。
- **分布式存储与 Checkpoint**:大模型权重的保存与恢复。
- **实验追踪与可观测性**:训练监控、日志、指标。
- **模型路由 / 级联(Routing / Cascade)**:按难度分发到不同规模模型,平衡成本与效果。
- **模型合并(Model Merging)**:权重融合多个模型能力。

---

> 以上所有内容我会利用业余时间来搜索，如有遗漏的地方，也欢迎各位在评论区给出相关指导意见。
