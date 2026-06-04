# 6.1.3 逻辑与符号推理

## 要解决的问题

自然语言 CoT 对**严格逻辑**（蕴涵、量化、规划）不可靠：模型会「听起来合理」却违反规则。符号推理要求与形式系统、约束求解器或程序执行结合，基准涵盖逻辑谜题、定理证明、规划与知识图谱问答。

## 核心概念

| 类型 | 代表基准 | 特点 |
| --- | --- | --- |
| **命题/一阶逻辑** | FOLIO、LogicNLI | 需形式化步骤 |
| **规划** | Blocksworld、PlanBench | 状态转移合法 |
| **定理证明** | miniF2F、Lean 社区 | 需证明助手 |
| **知识推理** | ARC（抽象推理）、ReClor | 模式归纳 |

**符号执行混合**：

$$
\text{Answer} = \text{Exec}(\text{LLM 生成程序或 DSL})
$$

LLM 负责 **翻译** 自然语言 → 符号；求解器保证_soundness_（在规格正确前提下）。

```mermaid
flowchart LR
  nl[自然语言问题] --> formal[LLM 输出逻辑式/程序]
  formal --> solver[Z3/Prolog/Python]
  solver --> ans[确定性答案]
```

## 方法 / 技术路线

1. **Neuro-symbolic**：LLM + Z3/SMT；错误时反馈 counterexample 再生成。
2. **Toolformer 类**：训练模型调用 `python`、`wolfram`（见 `docs/` 工具使用）。
3. **纯 CoT**：在简单逻辑集上可用，复杂集掉点快（见 [6.1.4](./04-multi-step-bottleneck)）。
4. **测试时**：PRM 对每步逻辑打分（[6.2.3 PRM vs ORM](./../02-test-time-compute/03-prm-vs-orm)）。

## 工程实践

- **评测**：符号任务必须用 **精确匹配** 或 solver 验证，不能用 BLEU（[7.2.1](../../07-evaluation/02-evaluation-methods/01-reference-based)）。
- **延迟**：多次调用 solver 增加 E2E（[5.1.4](../../05-inference-deployment/01-inference-basics/04-latency-metrics)）。
- **安全**：执行生成代码需沙箱（同 [6.1.2](./02-code-reasoning)）。

## 代表工作

- Han et al., FOLIO；Clark et al., Think you have Solved Question Answering? Try ARC
- AlphaProof（DeepMind）方向：RL + Lean
- GPT-4 逻辑评测博客；开源 Logic-LM 系列

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- 形式化本身可能 **错误**；error cascade 比纯文本更难 debug。
- ARC-AGI 对纯 LLM 仍极难（[7.1.2](../../07-evaluation/01-benchmarks/02-reasoning-benchmarks)）。
- 个人理解：生产合规/规则引擎场景优先符号栈，LLM 做接口层。



## 术语速记

正文英文术语与开源实现（GitHub、Hugging Face）命名一致，便于检索源码与 Issue。

## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 同章：[6.1.1 数学](./01-mathematical-reasoning) · [6.1.2 代码](./02-code-reasoning) · [6.1.4 瓶颈](./04-multi-step-bottleneck)
- PRM：[6.2.3](./../02-test-time-compute/03-prm-vs-orm)
- 评估：[7.1.2 推理基准](../../07-evaluation/01-benchmarks/02-reasoning-benchmarks)
