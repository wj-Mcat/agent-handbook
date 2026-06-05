# 可验证奖励（RLVR）

## 要解决的问题

RLHF 依赖人类偏好模型，**昂贵且主观**。数学、代码、逻辑题存在 **客观可验证** 答案：对则 $r=1$，错则 $0$（或连续 partial）。**RL with Verifiable Rewards（RLVR）** 用规则/单元测试/定理检查器作 reward，支撑 DeepSeek-R1、Open-R1 等无需人工标注每一步的推理 RL。

## 核心概念

**稀疏结果奖励**：

$$
r(y) = \begin{cases}
1 & \text{if } \text{Verify}(y, y^\*) \\
0 & \text{otherwise}
\end{cases}
$$

**Verify** 实现：

| 域 | 验证器 | 注意 |
| --- | --- | --- |
| 数学 | 答案提取 + sympy/latex 归一化 | parser 鲁棒性 |
| 代码 | sandbox 单测 | 超时、安全 |
| 逻辑 | SAT/DSL 执行 | 形式化成本 |
| 多选 | 选项字母匹配 | 简单可靠 |

**过程奖励扩展**（可选）：单元测试部分通过给 $r \in (0,1)$；或 PRM（[6.2.3](../02-test-time-compute/03-prm-vs-orm)）。

```mermaid
flowchart LR
  rollout[模型输出 y] --> extract[解析答案/代码]
  extract --> verify[Verify]
  verify --> r[标量 reward]
  r --> grpo[GRPO 更新]
```

## 方法 / 数据与课程

1. **题库**：GSM8K、MATH、LeetCode 风格、合成可验证题（防泄漏见 [7.2.4](../../07-evaluation/02-evaluation-methods/04-reliability-contamination)）。
2. **格式奖励**：附加模板分（如 `` 结构），防 RL .hack 空输出。
3. **课程**：由易到难，避免早期全零 reward（[6.3.1 GRPO](./01-grpo-rloo) 组内归一化仍困）。
4. **与 SFT**：冷启动 SFT 再 RLVR（R1 路径）优于纯 RL（R1-Zero 可读性差）。

## 工程实践

- **验证器单元测试**：独立于训练 pipeline，版本锁定。
- **假阳性**：parser 把错解标对 → 强化错误；需 golden set 监控。
- **吞吐**：rollout 瓶颈在生成；验证通常快于 forward。

## 代表工作

- DeepSeek-R1、DeepSeekMath（RLVR + GRPO）
- Lambert et al., Open-R1；Google Minerva 工具验证思路
- 代码：RLHF with execution feedback 系列

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- **不可验证任务**（创意写作）不适用；仍需 RM/DPO（第四部分）。
- 模型可 **reward hacking**（格式对答案错），需格式+内容双 reward。
- 验证器漏洞等于训练信号漏洞（安全关键）。


## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 同章：[6.3.1 GRPO](./01-grpo-rloo) · [6.3.3 长 CoT](./03-long-cot-training)
- 数学/代码：[6.1.1](../01-complex-reasoning/01-mathematical-reasoning) · [6.1.2](../01-complex-reasoning/02-code-reasoning)
- R1 领读：[paper-reading DeepSeek-R1](/paper-reading/tech-report/deepseek/deepseek-r1)
