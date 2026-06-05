# 边缘部署（llama.cpp、MLX、ONNX）

## 要解决的问题

云端 API 无法满足隐私、离线、超低延迟交互；需在 **笔记本、手机、Apple Silicon、嵌入式** 上运行量化 LLM。边缘栈强调 CPU/GPU/NPU 异构、小显存与 [5.3.4 GGUF](../03-quantization/04-bitsandbytes-gguf-exl2) 格式，而非 [5.6.1](./01-inference-frameworks) 数据中心 vLLM。

## 核心概念

| 栈 | 平台 | 格式 | 特点 |
| --- | --- | --- | --- |
| **llama.cpp** | Win/Mac/Linux/移动 | GGUF | 社区最大、CPU+GPU 层 offload |
| **MLX** | Apple Silicon | safetensors/MLX | 统一内存、苹果优化 |
| **ONNX Runtime** | 跨平台 | ONNX | 企业集成、DirectML/CoreML |
| **Ollama** | 桌面 | 封装 llama.cpp | 一键拉模型 |

**显存规划**（7B Q4_K_M 示意）：

$$
\text{Weight} \approx 4\text{–}5\,\text{GB},\quad \text{KV} \approx 2 L T H_{\text{kv}} d_h \cdot 2\text{B}
$$

$ctx=4096$ 时 KV 常数百 MB；总需求 < 8GB 可笔记本运行。

```mermaid
flowchart LR
  hub[HF / GGUF Hub] --> convert[convert 或下载 Q4]
  convert --> runtime[llama.cpp / MLX]
  runtime --> app[本地 App / 助手]
```

## 方法 / 部署步骤

1. 选量化档（[5.3.2 Q4_K_M](../03-quantization/02-int-fp-formats)）平衡质量。
2. `llama-cli` / `llama-server`：设 `-ngl` GPU 层数、`-c` 上下文。
3. Apple：MLX 加载 Qwen/Llama 官方 MLX 权重，利用 `mx.metal`。
4. 安卓/iOS：JNI/NCNN 或厂商 NPU SDK（生态碎片化）。

## 工程实践

- **评测**：边缘用 [MMLU](../../07-evaluation/01-benchmarks/01-general-benchmarks) 子集 + 人工体验；TPS 低于云但可接受。
- **更新**：模型版本与 App 绑定，防供应链篡改。
- **与云混合**：本地小模型 + 云端大模型 fallback（路由见 [5.6.3](./03-scheduling-load-balancing)）。
- **能耗**：电池场景限制生成长度（[5.1.3](../01-inference-basics/03-repetition-length-control)）。

## 代表工作

- Gerganov, llama.cpp / ggml
- Apple MLX 示例与 Hugging Face `mlx-community`
- Microsoft ONNX Runtime GenAI

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- INT4 CPU 路径可能 **慢于** 小 GPU BF16；需 profile。
- 长上下文 KV 仍是瓶颈（[5.2.1](../02-kv-cache-attention-optimization/01-kv-cache)），手机宜 2k–4k。
- 工具调用/Agent 需额外编排，非纯推理栈能解决。



## 术语对照（中英）

本节英文关键词：**llama.cpp、MLX、ONNX**（与社区论文、API 文档检索一致）。

## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 量化：[5.3.4 GGUF](../03-quantization/04-bitsandbytes-gguf-exl2) · [5.4.3 小模型](../04-model-compression/03-small-model-design)
- 云对比：[5.6.1 框架](./01-inference-frameworks)
- 极低比特：[5.3.5](../03-quantization/05-extreme-low-bit)
