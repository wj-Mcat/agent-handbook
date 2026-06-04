# 7.2.1 基于参考答案的自动评估

## 要解决的问题

开放生成任务需要 **可扩展、可复现** 的打分方式。有标准答案或参考文本时，可用精确匹配、F1、BLEU、ROUGE、代码执行等 **reference-based** 指标，无需调用更强模型作 Judge，成本最低、方差最小（在 parser 正确前提下）。

## 核心概念

| 指标 | 适用 | 公式/定义 |
| --- | --- | --- |
| **Exact Match (EM)** | QA、短答案 | $\mathbb{1}[y=y^\*]$ |
| **Token F1** | 抽取式 QA | $2PR/(P+R)$ on tokens |
| **BLEU** | 翻译、摘要 | n-gram 精确率几何平均 |
| **ROUGE-L** | 摘要 | LCS F1 |
| **pass@k** | 代码 | 见 [7.1.2](../01-benchmarks/02-reasoning-benchmarks) |
| **ANLS** | DocVQA | 编辑距离阈值 |

**归一化 EM**（数学常用）：

$$
\text{EM}_{\text{norm}} = \mathbb{1}[\text{norm}(y)=\text{norm}(y^\*)]
$$

norm 含去 LaTeX、sympy 化简、浮点容差。

```mermaid
flowchart LR
  pred[模型输出] --> parse[解析/抽取]
  ref[参考答案] --> parse
  parse --> metric[EM/F1/pass@k]
```

## 方法 / 实践清单

1. **选择题**：取 `(A)` 正则；与 [7.1.1 MMLU](../01-benchmarks/01-general-benchmarks) 一致。
2. **数学**：`\\boxed{}` + sympy；失败样本人工抽检 100 条估 parser 误差。
3. **代码**：sandbox 跑官方 tests；超时记 fail。
4. **生成摘要**：BLEU/ROUGE 仅作辅助，与人类评相关性弱。

## 工程实践

- 固化 **后处理脚本** 版本于评测 repo。
- 报告 **parse failure rate**；高则说明指标低估模型。
- 与 [5.1.2 采样](../../05-inference-deployment/01-inference-basics/02-sampling-strategies) 固定 `temperature=0` 用于 MCQ。

## 代表工作

- Rajpurkar et al., SQuAD EM/F1；Papineni et al., BLEU
- Chen et al., HumanEval pass@k

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- 开放问答 **无单一参考答案** 时 EM 失效 → [7.2.2 Judge](./02-llm-as-judge)。
- 同义改写被判错（中文尤甚）；可考虑语义 EM（待验证成本）。
- RLVR 验证器即 reference-based reward（[6.3.2](../../06-reasoning-test-time-compute/03-rl-reasoning/02-rlvr)）。



## 术语速记

正文英文术语与开源实现（GitHub、Hugging Face）命名一致，便于检索源码与 Issue。

## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 同章：[7.2.2 LLM Judge](./02-llm-as-judge) · [7.2.3 人类评](./03-human-evaluation) · [7.2.4 污染](./04-reliability-contamination)
- 基准：[7.1.1](../01-benchmarks/01-general-benchmarks) · [7.1.2](../01-benchmarks/02-reasoning-benchmarks)
