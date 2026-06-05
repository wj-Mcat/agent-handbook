# 模型编辑（ROME、MEMIT）

## 要解决的问题

权重静态导致 **事实过时**（CEO 更换）或 **有害关联** 无法快速修正。全量重训不现实；**模型编辑** 希望在 **局部更新** 知识的同时 **不破坏** 无关能力。

## 核心设定

给定事实三元组 $(s, r, o)$，例如 `(Einstein, born_in, Ulm)`，求参数扰动 $\Delta\theta$ 使：

$$
P_\theta(o \mid s, r) \uparrow,\quad \text{且 } P_\theta(\cdot \mid s', r') \approx \text{unchanged}
$$

## 代表方法

| 方法 | 思路 | 特点 |
| --- | --- | --- |
| **ROME** | 定位 FFN 中存储事实的层，秩-1 更新 | 单条编辑快 |
| **MEMIT** | 批量编辑，多事实联合优化 | 适合知识库补丁 |
| **MEND / SERAC** | 学习超网络预测编辑 | 泛化到新事实 |
| **ICL 对比** | 不改权重，prompt 注入 | 零成本但非永久 |

## 因果追踪（直觉）

通过 **干预激活** 观察哪些层对 $(s,r)\rightarrow o$ 因果贡献大，再在 **关键 FFN 层** 施加 closed-form 更新（ROME 路线）。

## 工程场景

- **合规更正**：产品文档错误名人人格。
- **安全**：削弱特定 **有害补全** 关联（效果不稳定）。
- **研究**：理解 **知识定位** 是否集中在 MLP。

## 与 RAG / 持续学习对比

| | 模型编辑 | RAG | 持续学习 |
| --- | --- | --- | --- |
| 持久性 | 权重内 | 外部索引 | 权重漂移 |
| 可删除性 | 难 | 易 | 难 |
| 规模 | 少量事实 | 海量文档 | 流式数据 |

## 局限与注意点

- **副作用**：编辑一条事实可能波及 **语义邻居**（幻觉式牵连）。
- **对抗**：用户 prompt 可 **覆盖** 编辑效果。
- **MoE** 上定位更复杂；工业界仍以 **RAG+重训** 为主流。
- 批量编辑的 **可预测性** 不足，生产慎用。

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

- 持续学习：[9.2.3](./03-continual-learning)
- 灾难性遗忘：[4.1.4](../../04-post-training-alignment/01-sft/04-catastrophic-forgetting)
- 幻觉：[1.1.1 什么是 LLM](../../01-foundations/01-introduction/01-what-is-llm)
