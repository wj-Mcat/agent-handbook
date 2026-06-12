#!/usr/bin/env python3
"""根据《大语言模型（LLM）知识体系》大纲初始化 llms 目录结构。

层级与编号规则（序号由层级自动计算，避免手工错号）：
- 一级：部分 -> 顶层目录 + _category_.yml，标签保留「第 X 部分　…」
- 二级：章 -> 子目录 + _category_.yml，标签为「部.章」点分编号，如 5.1
- 三级及以上：小节 / 嵌套分类 -> 纯标题，不写点分序号（侧边栏更简洁）
- 附录 -> 单独目录，每个附录为一个 Markdown 文件（不参与点分编号）

目录/文件名使用数字前缀控制排序（章前缀为部内局部序号），
Docusaurus 会自动剥离前缀生成干净的 slug。
"""
from __future__ import annotations

import os

LLMS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "llms")

# 结构：parts = [(part_dirname, part_label, chapters)]
# chapter = (chapter_dirname, chapter_title, sections)
# section = (section_slug, section_title)
# 章号、节号由所在位置自动推导，标题文本不再内嵌序号。
PARTS = [
    ("foundations", "第一部分　基础知识", [
        ("introduction", "引言", [
            ("what-is-llm", "什么是大语言模型"),
            ("llm-history", "LLM 发展简史（从图灵到 GPT-4 / Claude / Gemini）"),
            ("tech-stack-overview", "LLM 的技术栈全景"),
            ("reading-guide", "本书的阅读路径与读者对象"),
        ]),
        ("machine-learning", "机器学习基础", [
            ("learning-paradigms", "监督学习、无监督学习、自监督学习"),
            ("loss-regularization", "损失函数与正则化"),
            ("bias-variance", "偏差–方差权衡"),
            ("metrics-cross-validation", "评估指标与交叉验证"),
        ]),
        ("deep-learning", "深度学习基础", [
            ("neural-networks-forward", "神经网络与前向传播"),
            ("backpropagation", "反向传播与计算图"),
            ("activation-functions", "激活函数（ReLU、GELU、Swish、SiLU）"),
            ("optimizers", "优化器（SGD、Adam、AdamW、Lion、Sophia）"),
            ("regularization", "正则化技术（Dropout、LayerNorm、RMSNorm、权重衰减）"),
            ("lr-scheduling", "学习率调度（Warmup、Cosine、WSD）"),
        ]),
        ("nlp-foundations", "自然语言处理基础", [
            ("linguistics-text-representation", "语言学基础与文本表示"),
            ("classic-nlp-tasks", "经典 NLP 任务（分类、序列标注、机器翻译、QA）"),
            ("text-preprocessing", "文本预处理与数据清洗"),
            ("nlp-metrics", "评估指标（BLEU、ROUGE、METEOR、BERTScore）"),
        ]),
    ]),
    ("transformer", "第二部分　Transformer 架构", [
        ("transformer-principles", "Transformer 原理（\"Attention Is All You Need\"）", [
            ("architecture-overview", "整体架构概览"),
            ("scaled-dot-product-attention", "缩放点积注意力（Scaled Dot-Product Attention）"),
            ("multi-head-attention", "多头注意力（Multi-Head Attention）"),
            ("positional-encoding", "位置编码（正弦位置编码、可学习位置编码）"),
            ("feed-forward-network", "前馈网络（FFN）"),
            ("residual-normalization", "残差连接与归一化"),
        ]),
        ("transformer-details", "Transformer 架构详解", [
            ("encoder", "编码器结构"),
            ("decoder-causal-mask", "解码器结构与因果掩码"),
            ("architecture-paradigms", "Encoder-only / Decoder-only / Encoder-Decoder 三大范式"),
            ("pre-ln-post-ln", "Pre-LN vs Post-LN"),
        ]),
        ("transformer-improvements", "Transformer 的关键改进", [
            ("positional-encoding-improvements", "位置编码改进：RoPE、ALiBi、NoPE"),
            ("normalization-improvements", "归一化改进：RMSNorm、DeepNorm"),
            ("activation-improvements", "激活函数改进：SwiGLU、GeGLU"),
            ("attention-variants", "注意力变体：MQA、GQA、MLA"),
            ("flash-attention", "Flash Attention 与 IO 优化"),
            ("sparse-attention", "稀疏注意力", [
                ("overview", "稀疏注意力总览"),
                ("ring-attention", "Ring Attention 与序列并行"),
                ("native-sparse-attention", "Native Sparse Attention（NSA）"),
                ("deepseek-sparse-route", "DeepSeek 稀疏路线（MLA / DSA / CSA+HCA）"),
                ("linear-attention", "线性注意力"),
                ("sliding-window-attention", "滑动窗口注意力（SWA）"),
                ("local-global-sparse", "局部-全局稀疏注意力（Longformer / BigBird）"),
                ("kv-compression-boundary", "KV 压缩与稀疏边界（MQA / GQA / MLA）"),
            ]),
            ("mamba-ssm", "Mamba 与状态空间模型（SSM）作为替代方案"),
        ]),
    ]),
    ("pre-training", "第三部分　预训练", [
        ("pretraining-data", "预训练数据", [
            ("data-sources", "数据来源（Common Crawl、C4、The Pile、Dolma、FineWeb）"),
            ("cleaning-deduplication", "数据清洗与去重"),
            ("quality-filtering", "数据质量过滤"),
            ("data-mixture", "数据混合与配比"),
            ("data-licensing", "数据版权与合规"),
        ]),
        ("tokenization", "分词技术（Tokenization）", [
            ("tokenization-levels", "字符级、词级、子词级分词"),
            ("bpe", "BPE（Byte Pair Encoding）"),
            ("wordpiece", "WordPiece"),
            ("sentencepiece-unigram", "SentencePiece、Unigram"),
            ("byte-level-bpe-tiktoken", "Byte-level BPE 与 Tiktoken"),
            ("multilingual-tokenization", "多语言分词与中文处理"),
        ]),
        ("pretraining-objectives", "预训练目标与策略", [
            ("causal-lm", "因果语言建模（CLM）"),
            ("masked-lm", "掩码语言建模（MLM）"),
            ("prefix-lm-span-corruption", "前缀语言建模、Span Corruption"),
            ("fim", "FIM（Fill-in-the-Middle）"),
            ("multitask-pretraining", "多任务预训练"),
        ]),
        ("scaling-laws", "Scaling Laws（缩放定律）", [
            ("kaplan-scaling-laws", "Kaplan Scaling Laws"),
            ("chinchilla-scaling-laws", "Chinchilla Scaling Laws"),
            ("compute-vs-inference-optimal", "计算最优 vs 推理最优"),
            ("data-parameter-tradeoff", "数据量与参数量的权衡"),
            ("emergent-abilities", "涌现能力（Emergent Abilities）的争议"),
        ]),
        ("distributed-training", "分布式训练", [
            ("data-parallelism", "数据并行（DP、DDP）"),
            ("tensor-parallelism", "张量并行（Tensor Parallelism）"),
            ("pipeline-parallelism", "流水线并行（Pipeline Parallelism）"),
            ("zero-deepspeed", "ZeRO 优化（DeepSpeed）"),
            ("three-d-sequence-parallelism", "3D 并行与序列并行"),
            ("fsdp", "FSDP（Fully Sharded Data Parallel）"),
            ("communication-optimization", "通信优化与拓扑"),
        ]),
        ("training-stability", "训练优化与稳定性", [
            ("mixed-precision", "混合精度训练（FP16、BF16、FP8）"),
            ("gradient-accumulation-clipping", "梯度累积与梯度裁剪"),
            ("checkpointing-recomputation", "检查点（Checkpointing）与激活重计算"),
            ("divergence-diagnosis", "训练发散问题的诊断与处理"),
            ("loss-spike", "Loss Spike 与稳定性技巧"),
        ]),
    ]),
    ("post-training-alignment", "第四部分　后训练与对齐", [
        ("sft", "监督微调（SFT）", [
            ("sft-overview", "SFT 的目的与流程"),
            ("data-construction", "数据构造（指令、对话、思维链）"),
            ("quality-quantity-tradeoff", "数据质量与数量的权衡"),
            ("catastrophic-forgetting", "灾难性遗忘问题"),
        ]),
        ("instruction-tuning", "指令微调", [
            ("flan-t0-self-instruct", "FLAN、T0、Self-Instruct"),
            ("alpaca-vicuna-wizardlm", "Alpaca、Vicuna、WizardLM 数据范式"),
            ("high-quality-instruction-data", "高质量指令数据构造方法"),
        ]),
        ("rlhf", "基于人类反馈的强化学习（RLHF）", [
            ("rlhf-pipeline", "RLHF 完整流程"),
            ("reward-model", "奖励模型（Reward Model）训练"),
            ("ppo", "PPO 算法在 LLM 中的应用"),
            ("kl-penalty-stability", "KL 惩罚与策略稳定性"),
            ("rlhf-challenges", "RLHF 的挑战（reward hacking、模式坍塌）"),
        ]),
        ("preference-optimization", "偏好优化新方法", [
            ("dpo", "DPO（Direct Preference Optimization）"),
            ("ipo-kto-orpo-simpo", "IPO、KTO、ORPO、SimPO"),
            ("offline-vs-online", "离线 vs 在线偏好学习"),
            ("on-policy-vs-off-policy", "On-Policy vs Off-Policy"),
            ("methods-comparison", "方法对比与适用场景"),
        ]),
        ("constitutional-ai-rlaif", "Constitutional AI 与 RLAIF", [
            ("constitutional-ai", "Constitutional AI 原理（Anthropic）"),
            ("rlaif", "RLAIF：用 AI 反馈替代人类反馈"),
            ("self-improvement-critique", "自我改进与自我批评"),
        ]),
        ("peft", "高效微调（PEFT）", [
            ("adapter", "Adapter"),
            ("prefix-prompt-p-tuning", "Prefix Tuning、Prompt Tuning、P-Tuning"),
            ("lora-qlora", "LoRA 与 QLoRA"),
            ("dora-lora-plus", "DoRA、LoRA+ 等改进"),
            ("peft-selection-guide", "PEFT 方法的选择指南"),
        ]),
    ]),
    ("inference-deployment", "第五部分　推理与部署", [
        ("inference-basics", "推理基础", [
            ("autoregressive-decoding", "自回归解码流程"),
            ("sampling-strategies", "采样策略（Greedy、Beam Search、Top-K、Top-P、Temperature）"),
            ("repetition-length-control", "重复惩罚与长度控制"),
            ("latency-metrics", "推理延迟的关键指标（TTFT、TPS、TPOT）"),
        ]),
        ("kv-cache-attention-optimization", "KV Cache 与注意力优化", [
            ("kv-cache", "KV Cache 原理"),
            ("paged-attention", "PagedAttention（vLLM）"),
            ("flash-attention", "FlashAttention 1/2/3"),
            ("prefix-prompt-caching", "Prefix Caching、Prompt Caching"),
        ]),
        ("quantization", "量化技术", [
            ("quantization-basics", "量化基础（PTQ vs QAT）"),
            ("int-fp-formats", "INT8、INT4、FP8、FP4"),
            ("gptq-awq-smoothquant", "GPTQ、AWQ、SmoothQuant"),
            ("bitsandbytes-gguf-exl2", "BitsAndBytes、GGUF、EXL2"),
            ("extreme-low-bit", "极低比特量化（1.58-bit、BitNet）"),
        ]),
        ("model-compression", "模型压缩", [
            ("pruning", "剪枝（结构化与非结构化）"),
            ("knowledge-distillation", "知识蒸馏（Hinton 蒸馏、序列级蒸馏）"),
            ("small-model-design", "小模型设计（Phi、Gemma Nano、MobileLLM）"),
        ]),
        ("accelerated-decoding", "加速解码", [
            ("speculative-decoding", "推测解码（Speculative Decoding）"),
            ("medusa-eagle-lookahead", "Medusa、EAGLE、Lookahead Decoding"),
            ("parallel-decoding-skip", "并行解码与跳层"),
        ]),
        ("inference-serving", "推理服务化", [
            ("inference-frameworks", "推理框架对比（vLLM、TGI、TensorRT-LLM、SGLang、LMDeploy）"),
            ("continuous-batching", "连续批处理（Continuous Batching）"),
            ("scheduling-load-balancing", "调度与负载均衡"),
            ("edge-deployment", "边缘部署（llama.cpp、MLX、ONNX）"),
        ]),
    ]),
    ("reasoning-test-time-compute", "第六部分　推理能力与测试时计算", [
        ("complex-reasoning", "复杂推理", [
            ("mathematical-reasoning", "数学推理（GSM8K、MATH、AIME）"),
            ("code-reasoning", "代码推理与执行"),
            ("logical-symbolic-reasoning", "逻辑与符号推理"),
            ("multi-step-bottleneck", "多步推理的瓶颈"),
        ]),
        ("test-time-compute", "测试时计算（Test-Time Compute）", [
            ("o1-o3-paradigm", "OpenAI o1 / o3 范式"),
            ("deepseek-r1", "DeepSeek-R1 与开源推理模型"),
            ("prm-vs-orm", "过程奖励模型（PRM）vs 结果奖励模型（ORM）"),
            ("mcts", "蒙特卡洛树搜索（MCTS）在 LLM 中的应用"),
            ("inference-scaling-laws", "推理时 Scaling Laws"),
        ]),
        ("rl-reasoning", "强化学习驱动的推理", [
            ("grpo-rloo", "GRPO、RLOO 等算法"),
            ("rlvr", "可验证奖励（RLVR）"),
            ("long-cot-training", "长 CoT 的训练范式"),
            ("self-play", "自我博弈与自我改进"),
        ]),
    ]),
    ("evaluation", "第七部分　评估", [
        ("benchmarks", "评估基准", [
            ("general-benchmarks", "综合基准（MMLU、MMLU-Pro、BIG-Bench、HELM）"),
            ("reasoning-benchmarks", "推理基准（GPQA、ARC-AGI、HumanEval、SWE-bench）"),
            ("multilingual-chinese-benchmarks", "多语言与中文基准（C-Eval、CMMLU、SuperCLUE）"),
            ("multimodal-benchmarks", "多模态基准（MMMU、MathVista）"),
            ("agent-benchmarks", "Agent 基准（WebArena、OSWorld）"),
        ]),
        ("evaluation-methods", "评估方法", [
            ("reference-based", "基于参考答案的自动评估"),
            ("llm-as-judge", "LLM-as-a-Judge"),
            ("human-evaluation", "人类评估（Chatbot Arena / LMSYS）"),
            ("reliability-contamination", "评估的可靠性、污染与作弊问题"),
        ]),
    ]),
    ("technical-reports", "第八部分　开源模型技术报告", [
        ("deepseek", "DeepSeek 系列", [
            ("deepseek-v3", "DeepSeek-V3（MLA + DeepSeekMoE + MTP + FP8）"),
            ("deepseek-r1", "DeepSeek-R1（纯 RL 激发推理 + GRPO）"),
            ("deepseek-v3-2", "DeepSeek-V3.1 / V3.2（DSA 稀疏注意力）"),
        ]),
        ("qwen", "Qwen 系列", [
            ("qwen2-5", "Qwen2.5"),
            ("qwen3", "Qwen3（思考/非思考统一 + 思考预算）"),
        ]),
        ("llama", "Llama 系列", [
            ("llama-4", "Llama 4（原生多模态 + iRoPE + 超长上下文）"),
        ]),
        ("kimi", "Kimi 系列", [
            ("kimi-k1-5", "Kimi K1.5（RL Scaling）"),
            ("kimi-k2", "Kimi K2（MuonClip + 超稀疏 MoE + Agent）"),
        ]),
        ("glm", "GLM 系列", [
            ("glm-4-5", "GLM-4.5（ARC：Agentic / Reasoning / Coding）"),
            ("glm-4-6", "GLM-4.6（200K 上下文 + 编程增强）"),
        ]),
        ("others", "其他开源模型", [
            ("minimax", "MiniMax-01 / MiniMax-M1（闪电注意力 + 超长上下文）"),
            ("gpt-oss", "gpt-oss（OpenAI 开源权重模型）"),
            ("gemma-3", "Gemma 3（Google 开源模型）"),
            ("olmo-2", "OLMo 2（AI2 全开放模型）"),
            ("mistral", "Mistral / Mixtral 系列"),
        ]),
    ]),
    ("frontier-future", "第九部分　前沿与未来", [
        ("long-context", "长上下文", [
            ("long-context-challenges", "长上下文的挑战"),
            ("context-extension", "上下文扩展方法（位置插值、YaRN、LongRoPE）"),
            ("needle-in-haystack", "大海捞针（Needle in a Haystack）评估"),
            ("million-token-context", "百万乃至千万 token 上下文"),
        ]),
        ("memory-continual-learning", "记忆与持续学习", [
            ("long-term-memory", "LLM 的长期记忆机制"),
            ("model-editing", "模型编辑（ROME、MEMIT）"),
            ("continual-learning", "持续学习与知识更新"),
            ("lifelong-learning", "终身学习的挑战"),
        ]),
        ("new-architectures", "新架构探索", [
            ("mamba-ssm", "Mamba 与状态空间模型"),
            ("rwkv-retnet", "RWKV、RetNet"),
            ("hybrid-architectures", "混合架构（Jamba、Zamba）"),
            ("neuro-symbolic", "神经符号融合"),
        ]),
        ("toward-agi", "通往 AGI 之路", [
            ("capability-boundaries", "LLM 能力边界与局限"),
            ("world-model-embodied", "世界模型与具身智能"),
            ("recursive-self-improvement", "自我改进与递归自举"),
            ("agi-timeline", "AGI 时间线与争论"),
        ]),
        ("model-interpretability", "模型可解释性", [
            ("claude-interpretability-in-2026", "Claude 可解释性前沿：Natural Language Autoencoders（2026）"),
        ]),
        ("conclusion", "结语", [
            ("panorama-review", "LLM 技术的全景回顾"),
            ("advice-practitioners", "给从业者的建议"),
            ("open-questions", "开放问题与研究方向"),
        ]),
    ]),
]

# 附录：每个附录是一个独立文件（无子章节），排在所有部分之后，不参与点分编号
APPENDIX = ("appendix", "附录", [
    ("a-math-notation", "附录 A　数学符号与公式速查"),
    ("b-glossary", "附录 B　常用术语中英对照表"),
    ("c-model-comparison", "附录 C　主流模型参数与基准成绩对照"),
    ("d-tools-ecosystem", "附录 D　开源工具与框架生态地图"),
    ("e-paper-list", "附录 E　经典论文阅读清单（按主题）"),
    ("f-resources-community", "附录 F　学习资源与社区"),
    ("g-interview-questions", "附录 G　常见面试题与思考题"),
])


def write_category(dir_path: str, label: str) -> None:
    os.makedirs(dir_path, exist_ok=True)
    # 在双引号 YAML 字符串中转义内部双引号，避免解析错误
    safe_label = label.replace('"', '\\"')
    with open(os.path.join(dir_path, "_category_.yml"), "w", encoding="utf-8") as f:
        f.write(f'label: "{safe_label}"\n')


def write_doc(file_path: str, title: str) -> None:
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(f"# {title}\n")


def main() -> None:
    created_dirs = 0
    created_files = 0
    for part_idx, (part_dir, part_label, chapters) in enumerate(PARTS, 1):
        part_path = os.path.join(LLMS_DIR, f"{part_idx:02d}-{part_dir}")
        write_category(part_path, part_label)
        created_dirs += 1
        for ch_idx, (ch_dir, ch_title, sections) in enumerate(chapters, 1):
            ch_path = os.path.join(part_path, f"{ch_idx:02d}-{ch_dir}")
            # 二级标题：部.章
            write_category(ch_path, f"{part_idx}.{ch_idx} {ch_title}")
            created_dirs += 1
            for sec_idx, section in enumerate(sections, 1):
                if len(section) == 3:
                    sec_slug, sec_title, subsections = section
                    sub_path = os.path.join(ch_path, f"{sec_idx:02d}-{sec_slug}")
                    write_category(sub_path, sec_title)
                    created_dirs += 1
                    for sub_idx, (sub_slug, sub_title) in enumerate(subsections, 1):
                        file_path = os.path.join(sub_path, f"{sub_idx:02d}-{sub_slug}.md")
                        write_doc(file_path, sub_title)
                        created_files += 1
                else:
                    sec_slug, sec_title = section
                    file_path = os.path.join(ch_path, f"{sec_idx:02d}-{sec_slug}.md")
                    write_doc(file_path, sec_title)
                    created_files += 1

    # 附录：排在所有部分之后
    ap_dir, ap_label, ap_items = APPENDIX
    ap_path = os.path.join(LLMS_DIR, f"{len(PARTS) + 1:02d}-{ap_dir}")
    write_category(ap_path, ap_label)
    created_dirs += 1
    for idx, (slug, title) in enumerate(ap_items, 1):
        write_doc(os.path.join(ap_path, f"{idx:02d}-{slug}.md"), title)
        created_files += 1

    print(f"创建目录: {created_dirs}, 创建文件: {created_files}")


if __name__ == "__main__":
    main()
