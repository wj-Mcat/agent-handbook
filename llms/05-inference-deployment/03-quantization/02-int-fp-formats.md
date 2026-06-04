# 5.3.2 INT8、INT4、FP8、FP4

## 要解决的问题

「量化到 4 bit」在不同栈里含义不同：对称/非对称、group size、是否 FP8 e4m3。部署工程师必须对齐 **存储格式、计算格式与硬件支持**，否则模型能加载但吞吐无提升甚至变慢。

## 核心概念

| 格式 | 典型用途 | 每参数量化存储 | 硬件（2024–2026） |
| --- | --- | --- | --- |
| **FP16/BF16** | 基线推理 | 16 bit | 全平台 |
| **INT8** | W8A8 或 W8A16 | 8 bit | Tensor Core INT8 |
| **INT4 (NF4/GPTQ)** | 权重主流量化 | ~4.5 bit（含 scale） | Ada/Hopper Marlin |
| **FP8 e4m3 / e5m2** | H100 训练/推理 | 8 bit | Hopper+ |
| **FP4 (NVFP4)** | 下一代极低比特 | 4 bit | Blackwell 系（逐步普及） |

**FP8 张量示例**（推理权重）：

$$
\text{FP8\_weight} \approx \text{cast\_to\_fp8}(W / s_{\text{channel}})
$$

**INT4 group-wise**（每 $g$ 个元素共享 scale $s_g$）：

$$
\hat{W}_i = s_{\lfloor i/g \rfloor} \cdot \text{dequant}(W_{q,i})
$$

与 KV Cache（[5.2.1](../02-kv-cache-attention-optimization/01-kv-cache)）：

| KV dtype | 8192 ctx 8B 模型量级 | 备注 |
| --- | --- | --- |
| FP16 | ~1 GB | 基线 |
| FP8 | ~0.5 GB | 需 kernel 支持 |
| INT8 | ~0.5 GB | 注意 dequant 开销 |

## 方法 / 格式选型表

| 目标 | 推荐格式 | 配套 |
| --- | --- | --- |
| 消费级 GPU 7B 本地 | INT4 GGUF Q4_K_M | llama.cpp [5.6.4](../06-inference-serving/04-edge-deployment) |
| 云 H100 70B | FP8 + TP | TensorRT-LLM / vLLM |
| 极限显存 | INT4 AWQ/GPTQ | [5.3.3](./03-gptq-awq-smoothquant) |
| 训练量化 | FP8 mixed | Transformer Engine |

## 工程实践

- **W4A16**：权重 4bit、激活 16bit，实现简单、生态最广。
- **W8A8**：需激活校准；SmoothQuant 迁移难度。
- **benchmark**：同模型对比 **TPS、MMLU、HumanEval**（[7.1](../../07-evaluation/01-benchmarks/01-general-benchmarks)），记录 format 字符串（如 `Q4_K_S`）。

## 代表工作

- NVIDIA FP8 Transformer Engine；OpenAI/微软 FP8 训练实践
- Dettmers et al., QLoRA NF4；GPTQ 4bit 权重

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- INT4 **不是** 正好 4× 缩小（scale、metadata 开销）。
- CPU 路径 INT4 常无向量内核，可能慢于 BF16（见 [5.6.4](../06-inference-serving/04-edge-deployment)）。
- FP4 与旧 checkpoint 不兼容，需重新 export。


## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 同章：[5.3.1 基础](./01-quantization-basics) · [5.3.3 算法](./03-gptq-awq-smoothquant) · [5.3.4 GGUF](./04-bitsandbytes-gguf-exl2)
- 技术报告：[8.1 DeepSeek-V3](../../08-technical-reports/01-deepseek/01-deepseek-v3)（FP8 训练）
