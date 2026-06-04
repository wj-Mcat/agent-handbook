# 9.3.4 神经符号融合

## 要解决的问题

LLM **概率生成** 擅长语言与启发，但在 **严格逻辑、算术证明、规划可行性** 上易错。神经符号（Neuro-Symbolic）尝试把 **神经网络** 与 **符号引擎**（定理证明、SQL、规则）结合。

## 融合范式

| 范式 | 流程 | 示例 |
| --- | --- | --- |
| **符号引导解码** | 语法/类型约束采样 | JSON schema、SQL grammar |
| **工具调用** | LLM 生成 → 执行器验证 | Python REPL、Lean |
| **神经→符号提取** | NL → 逻辑式 → 求解器 | 数学 word problem |
| **符号→神经反馈** | 错误反传为 CoT 修正 | CRITIC、自我反思 |

## 与 Agent 的关系

现代 **Agent = LLM + 工具** 可视为 **实用神经符号**：

- **神经**：规划与自然语言接口。
- **符号**：编译器、数据库、单元测试 **硬反馈**。

见 `docs` Agent 与 [7.1.5 Agent 基准](../../07-evaluation/01-benchmarks/05-agent-benchmarks)。

## 代表研究方向

- **Logic-LM**：LLM 生成一阶逻辑，外部求解。
- **Program-aided**：PAL、PoT 用代码作中间表示。
- **形式验证**：Lean/Isabelle 对接（数学证明助手）。

## 工程实践

- **Structured output**：JSON mode、regex、constrained decoding（Outlines、guidance）。
- **Plan-Execute 分离**：Planner（LLM）与 Executor（确定性 VM）。
- **失败回退**：符号执行失败 → 提示模型 **修订计划**。

## 局限与注意点

- 符号层 **覆盖不全** 时，模型仍 **幻觉** 调用不存在 API。
- 严格系统 **脆弱**：环境稍变即失败，需鲁棒重试。
- 「真正理解逻辑」vs「模式匹配工具链」—— **哲学争议** 未决。
- 个人理解：短期落地靠 **Agent 工具环**，而非端到端可微定理证明（待验证）。

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

## 外部参考（精选）

| 类型 | 入口 |
| --- | --- |
| 原始报告 | 见正文 arXiv / 官方博客链接 |
| 权重与配置 | Hugging Face `config.json` 与 model card |
| 深度领读 | 见上文 `:::tip` 或 [tech-report 索引](/paper-reading/tech-report/) |
| 工具链 | [附录 D　工具生态](../../10-appendix/04-d-tools-ecosystem) |
| 术语 | [附录 B　术语表](../../10-appendix/02-b-glossary) |

## 相关章节

- 逻辑推理：[6.1.3](../../06-reasoning-test-time-compute/01-complex-reasoning/03-logical-symbolic-reasoning)
- 代码推理：[6.1.2](./../../06-reasoning-test-time-compute/01-complex-reasoning/02-code-reasoning)
- Function Call：`docs` 相关章节
