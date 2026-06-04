# 6.3.3 长 CoT 的训练范式

## 要解决的问题

推理模型在回答前生成 **数千至上万 token** 的内部思考（长 Chain-of-Thought）。如何 SFT 冷启动、RL 拉长、抑制无效复读，并兼容上下文窗口与推理成本，是 R1/o1 路线的训练核心，而非单纯提示词 ``。

## 核心概念

| 阶段 | 目标 | 数据/信号 |
| --- | --- | --- |
| **冷启动 SFT** | 可读、分步、模板稳定 | 长 CoT 标注或强模型蒸馏 |
| **RL 扩展** | 自我验证、回溯、反思 | RLVR + GRPO（[6.3.1](./01-grpo-rloo)） |
| **后处理 SFT** | 语言一致、拒答合规 | 人类或规则过滤 |
| **蒸馏** | 小模型继承 | 长链 → 短学生（可选） |

**长度与性能**（经验，待验证）：

$$
\text{Acc} \uparrow \text{ with } L_{\text{CoT}} \text{ until } L_{\text{crit}},\quad L > L_{\text{crit}} \Rightarrow \text{noise, cost}
$$

R1 论文报告 **「aha moment」**：RL 中出现自发重新检验步骤。

```mermaid
flowchart LR
  short[短 CoT SFT 基线] --> rl[RLVR 拉长]
  rl --> long[长 CoT 策略]
  long --> fix[语言/安全 SFT]
  fix --> deploy[vLLM 长上下文]
```

## 方法 / 数据构造

1. **标注**：人工写步骤；或 o1/R1 生成后人工筛。
2. **模板**：``、`` 等分隔思考与答案，便于解析与 [5.1.3 停止](../../05-inference-deployment/01-inference-basics/03-repetition-length-control)。
3. **RL 正则**：长度惩罚 $-\lambda |y|$ 防无限啰嗦；与正确性 reward 平衡。
4. **上下文**：32k–128k 训练与 [5.2 KV](../../05-inference-deployment/02-kv-cache-attention-optimization/01-kv-cache) 部署对齐。

## 工程实践

- **推理**：解析器只把 `` 后内容给用户；thinking 可计费。
- **监控**：平均 CoT 长度、反思关键词频率、无效循环检测。
- **评测**：[AIME](../../07-evaluation/01-benchmarks/02-reasoning-benchmarks) 固定 max_tokens 足够大。

## 代表工作

- DeepSeek-R1（[paper-reading](/paper-reading/tech-report/deepseek/deepseek-r1)）
- QwQ-32B-Preview；OpenAI o1 博客
- 技术报告 [8.1.2 R1](../../08-technical-reports/01-deepseek/02-deepseek-r1)

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- 长 CoT **不保证** 正确；[6.1.4 多步瓶颈](../01-complex-reasoning/04-multi-step-bottleneck) 仍在。
- 多语言混杂需专门 SFT 修复（R1 披露）。
- 蒸馏到短模型可能丢失深度思考，需单独评测。



## 术语速记

正文英文术语与开源实现（GitHub、Hugging Face）命名一致，便于检索源码与 Issue。

## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 同章：[6.3.1 GRPO](./01-grpo-rloo) · [6.3.2 RLVR](./02-rlvr) · [6.3.4 自博弈](./04-self-play)
- 测试时：[6.2.1 o1](../02-test-time-compute/01-o1-o3-paradigm) · [6.2.5 Scaling](../02-test-time-compute/05-inference-scaling-laws)
- 提示词：`docs/02-prompt-engineering/` CoT 章节
