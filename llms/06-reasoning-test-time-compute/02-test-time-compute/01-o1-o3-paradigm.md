# 6.2.1 OpenAI o1 / o3 范式

## 要解决的问题

标准「一次 forward + 短 CoT」在竞赛数学、科学推理上触顶。OpenAI **o1 / o3** 系列将算力从 **训练** 转向 **推理时**：模型在回答前产生长内部推理链（hidden reasoning / thinking tokens），用更多测试时 compute 换准确率，开启「推理模型」产品品类。

## 核心概念

| 维度 | GPT-4o 类 | o1 / o3 类 |
| --- | --- | --- |
| 推理长度 | 短 CoT（可见） | 长 thinking（部分不可见） |
| 训练 | 常规 SFT+RLHF | 强化学习 + 推理数据（未全公开） |
| 推理成本 | 低 token | 高 token、高 $/题 |
| 基准 | MMLU 等 | AIME、GPQA、Codeforces 等 |

**测试时 compute**（概念）：

$$
\text{Performance} \uparrow \quad \text{as} \quad N_{\text{thinking tokens}},\; N_{\text{samples}},\; \text{search width}
$$

与 [6.2.5 Scaling Laws](./05-inference-scaling-laws) 呼应：推理预算成为新轴。

```mermaid
flowchart LR
  user[用户问题] --> think[内部长推理]
  think --> refine[自我修正/分支]
  refine --> out[最终答案]
```

## 方法 / 公开信息与推测

**已公开/产品层**：

- API 暴露 `reasoning_effort`（low/medium/high）控制 thinking 深度。
- 系统卡强调安全与拒答；**不公开**完整训练 recipe。

**社区推测（标注：待验证）**：

- 大规模 RL + 可验证任务（数学、代码）。
- PRM 或隐式价值模型引导长链（见 [6.2.3](./03-prm-vs-orm)）。
- 与 [4.3 PPO](../../04-post-training-alignment/03-rlhf/03-ppo) 同类但奖励更稀疏、链更长。

## 工程实践

- **集成**：OpenAI Responses API；客户端需处理更长 TTFT（[5.1.4](../../05-inference-deployment/01-inference-basics/04-latency-metrics)）。
- **路由**：简单题走 4o，难题走 o1，控制成本（[5.6.3](../../05-inference-deployment/06-inference-serving/03-scheduling-load-balancing)）。
- **评测**：[AIME/GPQA](../../07-evaluation/01-benchmarks/02-reasoning-benchmarks)；勿用短 CoT 提示评测 o1。

## 代表工作

- OpenAI: *Learning to Reason with LLMs*（o1 预览博客）
- o3 发布材料（2025）；ARC-AGI 专项分数
- 对照开源：[6.2.2 DeepSeek-R1](./02-deepseek-r1)

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- **黑盒**：thinking 不可见时难以 debug 与蒸馏。
- 过度 thinking 浪费 token（无效反思，R1 论文亦有讨论）。
- 闭源 recipe 复现难；开源路线见 GRPO/R1。


## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 同章：[6.2.2 R1](./02-deepseek-r1) · [6.2.3 PRM](./03-prm-vs-orm) · [6.2.4 MCTS](./04-mcts) · [6.2.5 Scaling](./05-inference-scaling-laws)
- RL：[6.3.1 GRPO](./../03-rl-reasoning/01-grpo-rloo)
- 评估：[7.1.2](../../07-evaluation/01-benchmarks/02-reasoning-benchmarks)
