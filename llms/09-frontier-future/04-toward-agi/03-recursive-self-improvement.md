# 9.4.3 自我改进与递归自举

## 要解决的问题

若 AI 能 **自主写代码、跑实验、更新自身权重**，是否出现 **递归自举（Recursive Self-Improvement）** 导致能力 **指数跃迁**？这是 AGI 安全与政策的核心争论点。

## 概念分层

| 层级 | 行为 | 现状（2025） |
| --- | --- | --- |
| **工具辅助** | 人用 Copilot 写训练代码 | 普遍 |
| **半自动科研** | AI 提议实验，人审批 | 早期 |
| **闭环自训** | 模型生成数据→RL→新模型 | R1、AlphaEvolve 类探索 |
| **全自动 RSI** | 无人工 gate 的持续自我升级 | **未实现** |

## 技术组件（已有）

- **合成数据**：Self-Instruct、宪法 AI、R1 式 RL rollout。
- **代码进化**：遗传算法 + LLM 突变（AlphaEvolve 报道）。
- **评测驱动迭代**：用基准当奖励函数（易过拟合）。

```mermaid
flowchart LR
  m0[模型 M0] --> gen[生成数据/代码]
  gen --> train[训练 M1]
  train --> eval[评测]
  eval --> m0
```

## 风险叙事（对齐社区）

- **目标错位**：优化错误奖励 → 能力仍升。
- **速度超预期**：政策跟不上部署。
- **集中 vs 开源**：权重开放是否加速 RSI。

## 缓解措施（工业实践）

- **人工 red team** 与 **发布 gate**。
- **沙箱** 执行 AI 生成代码。
- **能力评估** 先于规模放大（evals-first）。
- 拒绝 **无监控的自动权重推送**。

## 与 LLM 课程关系

本大纲 **人类在回路** 的学习路径仍适用：理解 [3.4 Scaling](../../03-pre-training/04-scaling-laws/)、[4.3 RLHF](../../04-post-training-alignment/03-rlhf/)、[6.3 RL 推理](../../06-reasoning-test-time-compute/03-rl-reasoning/) 后，能判断 **哪一环可自动化**。

## 局限与注意点

- 「即将 RSI」声明 **证据不足**，多为推测。
- 自动数据闭环易 **模式崩溃** 与 **基准过拟合**。
- 法规与 **算力许可** 可能硬限制自举速度。

## 检查清单（自学 / 落地）

| 步骤 | 动作 |
| --- | --- |
| 1 | 阅读官方 primary source（报告、博客、模型卡） |
| 2 | 固定 prompt 与解码参数，在自有验证集上建基线 |
| 3 | 记录延迟、成本、上下文长度与是否启用思考模式 |
| 4 | 与相邻章节对照，画出与上下游模块的数据流 |
| 5 | 在 [paper-reading](/paper-reading/) 或本大纲相关节做深度笔记 |

## 常见误区

| 误区 | 澄清 |
| --- | --- |
| 公开基准 = 产品表现 | 必须用业务端到端任务回归 |
| 长窗口 = 长理解 | 需 Needle + 真实文档任务验证 |
| 单次实验可定论 | 固定随机种子、数据版本与评测脚本 |

## 延伸练习

- 复现表中 **一行关键结论**（ablation 或小型对照实验）。
- 用 [附录 D 工具](../../10-appendix/04-d-tools-ecosystem) 或 [lm-eval](https://github.com/EleutherAI/lm-evaluation-harness) 跑通评测脚本。
- 将未知参数整理进 [9.5.3 开放问题](../05-conclusion/03-open-questions) 个人笔记。

## 相关章节

- Constitutional AI：[4.5.1](../../04-post-training-alignment/05-constitutional-ai-rlaif/01-constitutional-ai)
- RLVR：[6.3.2](../../06-reasoning-test-time-compute/03-rl-reasoning/02-rlvr)
- AGI 时间线：[9.4.4](./04-agi-timeline)
