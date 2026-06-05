# 极低比特量化（1.58-bit、BitNet）

## 要解决的问题

INT4 已难将 70B 塞进手机，研究界探索 **1–2 bit 权重甚至二值化**，从算术上逼近信息论极限，并配合专用 kernel 降低能耗。BitNet b1.58、1-bit LLM 等代表「训练即量化」范式，与 GPTQ 等 PTQ 路线不同。

## 核心概念

**BitNet b1.58**：权重约束在 $\{-1, 0, +1\}$（三元），前向用整数加法累积：

$$
Y \approx \sum_j W_j X_j, \quad W_j \in \{-1,0,+1\}
$$

**二值 / 1-bit**：$W_j \in \{-1,+1\}$，需 scale $\alpha$：

$$
\hat{W} = \alpha \cdot \text{sign}(W)
$$

| 方案 | 权重比特 | 激活 | 训练 | 推理生态 |
| --- | --- | --- | --- | --- |
| BitNet b1.58 | ~1.58 | 通常 8bit 或 FP16 | 从头量化训练 | 研究/预览 kernel |
| 1-bit LLM (2024+) | 1–2 | 混合 | QAT + STE | 待验证 |
| GPTQ INT3 | 3 | FP16 | PTQ | 部分框架 |

与标准 [5.3.1 PTQ](./01-quantization-basics) 对比：极低比特更依赖 **重新训练**，而非仅校准。

```mermaid
flowchart LR
  fp[FP 预训练可选] --> qtrain[量化友好训练 STE]
  qtrain --> kernel[专用 1.58bit kernel]
  kernel --> edge[边缘低功耗]
```

## 方法 / 研究与落地差距

1. **架构**：Linear 替换为 BitLinear；LayerNorm/残差仍 FP。
2. **蒸馏**：用小 FP 教师指导 1.58 学生（链 [5.4.2](../04-model-compression/02-knowledge-distillation)）。
3. **评测**：在 [MMLU](../../07-evaluation/01-benchmarks/01-general-benchmarks) 与同等尺寸 FP 小模型对比，而非仅看体积。

## 工程实践

- **个人理解（待验证）**：2026 年前生产主路径仍为 INT4/FP8；极低比特适合研究与小端试点。
- 关注 Microsoft BitNet、Meta 1B 1-bit 等官方 repo 的 kernel 发布节奏。
- 能耗指标：tokens/J 在边缘比 TPS 更有说服力（[5.6.4](../06-inference-serving/04-edge-deployment)）。

## 代表工作

- Wang et al., *BitNet: Scaling 1-bit Transformers for Large Language Models*
- Ma et al., *The Era of 1-bit LLMs*（Microsoft 技术报告）
- 相关：RPTQ、QuIP# 等极低比特 PTQ（与 b1.58 并行存在）

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- 三元/二值训练不稳定，需专门 lr、warmup。
- 与 Hugging Face 标准 `Linear` 不兼容，转换工具链不成熟。
- **不可** 直接对 Llama FP16 权重做 1-bit 舍入期望可用。


## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 同章：[5.3.1](./01-quantization-basics) · [5.3.2 格式](./02-int-fp-formats)
- 小模型：[5.4.3 小模型设计](../04-model-compression/03-small-model-design)
- 剪枝：[5.4.1](./../04-model-compression/01-pruning)
