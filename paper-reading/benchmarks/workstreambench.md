---
title: "WorkstreamBench"
---

# WorkstreamBench: Evaluating LLM Agents on End-to-End Spreadsheet Tasks in Finance

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[WorkstreamBench](https://arxiv.org/abs/2605.22664v1) 关注一个很具体但很重要的 Agent 能力：LLM Agent 能不能从高层自然语言需求出发，完成端到端的金融电子表格工作流。

论文的核心观点是：现有 spreadsheet benchmark 多数只评测“问答”“补公式”“修改几个单元格”这类原子任务，但真实金融工作里的 deliverable 往往是一个完整、多 sheet、可审计、可复用、可修改的 Excel workbook。对于这类任务，仅看最终数字是否匹配是不够的，还需要评估公式设计、可读性、格式规范和专业交付质量。

## 论文信息

:::tip
- 论文标题：WorkstreamBench: Evaluating LLM Agents on End-to-End Spreadsheet Tasks in Finance
- 论文链接：https://arxiv.org/abs/2605.22664v1
- 关键词：Agent Benchmark、Spreadsheet、Finance、End-to-End Task、LLM-as-Judge、Artifact Evaluation
:::

## 解决的问题

电子表格是金融分析、财务建模、预测、估值和情景分析里的核心工具。近年来，Claude for Excel、ChatGPT for Excel、ChatGPT Agent 等产品已经开始支持直接生成或编辑 spreadsheet，这意味着 Agent 不只是回答问题，而是在生产一个可交付的工作成果。

但是现有 benchmark 通常存在两个缺口：

1. 任务太原子化：例如根据表格回答问题、生成单个公式、修改少量单元格。
2. 评价太结果导向：常用 exact match 或最终值比较，难以衡量公式是否可维护、结构是否清晰、格式是否符合专业标准。

在真实金融场景中，一个 workbook 经常会被 analyst、manager、VP、客户团队反复审阅和修改。一个模型即使算出了正确 IRR，如果把关键假设硬编码在公式里，或者用一个巨大的单元格公式完成所有逻辑，也很难被视为合格的专业交付物。

## Benchmark 设计

WorkstreamBench 评测的是端到端金融 spreadsheet 任务。Agent 输入通常包括任务说明、起始 workbook 或 PDF case brief，输出则是一个完整的 Excel 文件。

### 任务来源

论文从三个来源构造任务集合：

| 来源 | 特点 | 主要价值 |
| --- | --- | --- |
| FMWC：Financial Modeling World Cup | 竞赛式金融建模任务，强调速度、准确性和动态建模 | 覆盖复杂、多步骤、可变情景的建模要求 |
| ModelOff | 2012-2019 年的全球金融建模比赛，历史题库质量高 | 提供高质量专业 Excel 建模案例 |
| WSP：Wall Street Prep | 投行、PE、公司金融培训课程 | 更贴近职业培训和标准化工作流 |

这些任务覆盖 DCF、3-statement model、LBO、scenario analysis、debt schedule、valuation、FP&A 等典型金融工作流。

### 与 SpreadsheetBench 的差异

论文强调 WorkstreamBench 与 SpreadsheetBench 的区别不只是“更多任务”，而是任务形态不同。

| 指标 | SpreadsheetBench | WorkstreamBench |
| --- | --- | --- |
| 任务形态 | 原子级 spreadsheet 操作 | 端到端 workbook 构建 |
| 目标输出 | 单个公式、答案或局部编辑 | 完整多 sheet Excel 文件 |
| 平均单元格数 | 约 1.8K | 约 58.3K |
| 中位函数调用数 | 10 | 933 |
| 评价重点 | 值匹配、局部正确性 | 准确性、公式质量、格式与可审计性 |

论文报告中，WorkstreamBench 的 golden solution 平均单元格数量约为 SpreadsheetBench 的 33 倍，中位函数调用数约为 93 倍。这种规模差异会带来真实的复杂性：公式之间相互依赖，多个 sheet 需要保持一致，输入假设改变后结果也应自动更新。

## 评价体系

WorkstreamBench 的评价不是单一分数，而是围绕三个核心维度展开：`Accuracy`、`Formula` 和 `Format`。

<Tabs defaultValue="accuracy">
<TabItem value="accuracy" label="Accuracy">

Accuracy 衡量 workbook 是否真正完成任务，以及关键计算是否正确。它不只是看最终答案，还会检查起始值、任务要求、符号方向和场景分析是否完整。

典型问题包括：

- 是否完成了题目要求的所有输出。
- IRR、估值、现金流、债务余额等关键计算是否正确。
- 是否正确处理正负号，例如金融模型中支出、负债、现金流出是否方向一致。
- 是否覆盖了题目要求的 scenario 或 sensitivity analysis。

这个维度对应金融交付物最基本的正确性，但论文反复强调：<span style={{color: 'red', fontWeight: 'bold'}}>只有 Accuracy 高还不够</span>。

</TabItem>
<TabItem value="formula" label="Formula">

Formula 衡量 spreadsheet 的公式是否健壮、可审计、可维护。

论文特别关注几类专业 spreadsheet 常见问题：

- `Logic Readability`：公式是否拆解为可读的中间步骤，而不是一个难以审计的巨型公式。
- `Hardcoded Values`：关键假设是否写在单元格输入区，而不是直接硬编码进公式。
- `Edge Cases`：是否处理 `#DIV/0!`、缺失值或异常输入。
- `Range Issues`：引用范围是否合理，是否会漏掉新增数据。
- `Absolute References`：复制公式时该锁定的全局参数是否使用绝对引用。

例如，一个模型可以在单个公式里算出正确 expense，但如果公式过长且无法解释，中间变量不可见，manager 很难快速检查和修改。这在专业环境中就是质量问题。

</TabItem>
<TabItem value="format" label="Format">

Format 衡量 workbook 是否像一个专业金融交付物，而不是只是一堆可计算的单元格。

主要关注：

- sheet 结构是否清晰。
- 假设、计算、输出是否分区合理。
- 数字格式、单位、字体、边框、颜色是否一致。
- 是否使用符合金融建模习惯的负数表示、百分比表示和单位列。
- 冻结窗格、对齐、标题层级是否有助于阅读和导航。

这类标准很难用 exact match 写成确定性规则。一个 workbook 的结构可以和参考答案不同，但仍然合理；反过来，它也可能数值正确但结构混乱、难以审计。

</TabItem>
</Tabs>

## LLM-as-Judge 评测

由于很多评价标准无法用程序化规则直接判断，论文使用 LLM-as-Judge 来评估 Agent 生成的 spreadsheet。

评测流程大致是：

1. 将参考解和 Agent 生成的 workbook 转换为结构化表示。
2. 把评价 rubric 和结构化 workbook 提供给 judge。
3. judge 对每个子维度输出 `Pass` / `Fail`，并给出失败位置、原因和期望修复方式。
4. 根据人工设定的权重计算三个维度和总体 composite score。

论文对 judge 做了两类验证：

| 验证方式 | 目的 | 结果 |
| --- | --- | --- |
| Synthetic perturbations | 在 golden solution 中注入受控错误，检查 judge 是否能识别 | judge 能捕捉多数细粒度错误 |
| LLM agent attempts | 用真实 Agent 输出和专家标注对比 | 在 408 条专家标注上达到 0.92 accuracy、0.88 balanced accuracy、0.85 $F_1$ |

这部分是论文的重要贡献之一。它不是简单地说“用 LLM judge 评分”，而是把 judge 当成一个需要被验证的评测组件，并用金融专业人士的标注来检查其可靠性。

### Judge 能捕捉的非显性错误

论文举了两个很有代表性的案例。

第一个是 off-by-one 错误。某个 Agent 在计算 LTM EBITDA 时窗口范围偏了一期，但由于季度数值接近，最终结果碰巧接近参考值。单纯 exact match 可能发现不了这个逻辑问题，而 judge 能指出公式窗口存在错误。

第二个是硬编码答案。某个 Agent 在交易模拟任务中没有用 Excel 公式实现逻辑，而是把外部计算出的结果直接粘贴为数值。最终数值可能正确，但模型失去了可审计性和可修改性。judge 将其判为失败，因为专业 workbook 需要暴露计算过程。

## Agent 设置

论文评测了两类 Agent。

### GUI Agent

这类 Agent 是面向用户的商业图形界面产品，例如：

- Claude Web
- Claude for Excel
- ChatGPT Pro
- ChatGPT Agent
- ChatGPT for Excel

由于这些产品通常没有统一 API，论文用 Playwright 自动化交互，模拟用户上传文件、输入任务、下载结果。

### API Agent

为控制 Agent harness 差异，论文还实现了一个自建的 Excel CLI Agent。它通过 MCP 工具操作 spreadsheet，支持创建 sheet、读写单元格、设置公式、格式化、验证公式等操作。

API Agent 中比较了多种模型端点，例如 GPT-5.4、Claude Opus 4.6、Gemini 3.1 Pro、Grok 4.20、Kimi K2.5、Qwen 3.6 Plus 和 OLMo 3.1 Instruct。

这个设置很有意思：一方面，GUI Agent 更接近真实用户产品；另一方面，API Agent 让不同底层模型在同一工具框架下比较，便于区分模型能力和产品 harness 能力。

## 关键结果

### Claude Web 表现最好，但仍远不到专业水平

论文发现 Claude Web 在三个核心维度上整体领先，输出也最接近专业 spreadsheet 风格。但即使最强 Agent，整体得分也只有 69.1/100，并且在难度上升后明显下滑。

这说明当前 Agent 已经能完成一部分简单或中等难度金融 spreadsheet 任务，但距离稳定生成专业质量 workbook 仍有明显差距。

### Excel 插件不一定优于 Web Agent

一个反直觉发现是：专门面向 Excel 的 Agent 产品并不总是比 Web 版 Agent 更好。

论文的人工检查显示，Claude for Excel 和 ChatGPT for Excel 经常出现格式不一致、单位缺失、硬编码数值、公式不透明等问题。相比之下，Claude Web 虽然是通过文件上传和重建 workbook 的方式工作，却经常产出更干净、更有结构的结果。

这提示我们：真正影响结果的不只是“模型能不能访问 Excel”，还包括 Agent harness、内部工具链、上下文管理、文件读写方式和任务规划能力。

### 难度越高，性能越差

论文按任务难度分析后发现，无论 GUI Agent 还是 API Agent，随着任务难度上升，性能都有系统性下降。

很多 Agent 会识别到更难的任务并花更多时间，但这并不保证质量提升。比如某些模型会在复杂任务中陷入大量读取和检查，迟迟不写入公式；有些模型会创建完整 sheet 框架，但留下大量空白；还有模型会声明任务完成，却没有真正构建可用计算逻辑。

### 硬编码和巨型公式是常见失败模式

论文多次提到两个 spreadsheet 任务中特别关键的失败模式：

1. 硬编码结果：Agent 把答案或中间值直接写成数字，而不是用公式连接假设和计算。
2. 巨型公式：Agent 用一个很长的公式完成复杂计算，虽然有时数值正确，但难以审计和维护。

这两个问题都说明，Agent 可能具备“算出答案”的能力，却没有掌握“交付专业模型”的能力。金融 spreadsheet 的价值不是最终数字本身，而是让其他人能理解、修改、复核和复用这套计算逻辑。

## 与已有 Benchmark 的关系

WorkstreamBench 和传统 spreadsheet benchmark 的关系类似于 SWE-Bench 与简单编程题的关系：它把评测对象从局部技能推进到完整工作流。

它也和 GDPval 有相似点，都关注经济上有价值的真实任务。但 WorkstreamBench 更聚焦金融 spreadsheet，并提供了更透明、可扩展的 rubric 和 judge pipeline。

可以把它放在几条 Benchmark 线索中理解：

- 相比 SpreadsheetBench：从原子 spreadsheet 操作走向端到端 workbook 交付。
- 相比金融 QA Benchmark：从文本问答和数值推理走向可执行、可审计的 Excel artifact。
- 相比通用 Agent Benchmark：强调真实办公产物的质量不等于最终状态匹配。
- 相比 GDPval：更垂直、更透明，聚焦金融建模场景和 spreadsheet 专业标准。

## 个人理解

WorkstreamBench 的价值在于提醒我们：Agent benchmark 不应该只评测“任务是否完成”，还要评测“产物是否可用”。

很多真实工作不是一次性问答，而是交付一个会被别人继续使用的 artifact。对金融 spreadsheet 来说，这个 artifact 必须满足三个层次：

1. 数字要对。
2. 公式要能解释、能复核、能随假设变化而更新。
3. 格式和结构要让人愿意接手继续工作。

这对 Agent 系统设计也有启发。一个面向生产力任务的 Agent，不应该只优化最终答案，而应该在生成过程中保持结构化工作习惯：区分输入假设、计算过程和输出结果；避免硬编码；拆解复杂公式；保留审计路径；必要时遵循领域惯例。

同时，这篇论文也说明 LLM-as-Judge 在 artifact-level evaluation 中可能是必要的。对于 spreadsheet、PPT、报告、设计稿、数据分析 notebook 这类复杂交付物，很多质量标准都无法用 exact match 捕捉。关键不在于是否使用 LLM judge，而在于是否为 judge 设计了清晰 rubric，并用专家标注验证它的可靠性。

## 总结

WorkstreamBench 是一个面向端到端金融 spreadsheet 工作流的 Agent Benchmark。它的核心贡献不是提出更难的 Excel 题，而是把评测目标从“局部正确”扩展到“专业可交付”。

论文展示了当前 LLM Agent 在真实办公 artifact 生成上的典型差距：容易算出部分答案，但难以稳定生成可维护、可审计、格式专业、可复用的完整 workbook。对于构建下一代办公 Agent 来说，这类 benchmark 比单点问答或简单工具调用更接近真实能力边界。
