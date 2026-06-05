# 高质量指令数据构造方法

## 要解决的问题

开源合成数据泛滥后，「再堆 100 万条」边际效益递减。**高质量指令数据** 强调：可验证、多样、与产品场景对齐、且与评测解耦。本节汇总工业界常用的 **构造方法组合**（非单一秘籍），供设计自有数据飞轮。

## 核心概念

高质量数据的 **可操作定义**（可制成 rubric）：

| 维度 | 检查项 |
| --- | --- |
| **任务覆盖** | 核心 SKU 场景占比 > 长尾噪声 |
| **输入真实性** | 来自用户日志/工单，而非纯合成套话 |
| **输出可验** | 代码能跑、数学有标答、政策有条文依据 |
| **对比度** | 含「差点对」负例，供 DPO/RM 使用（见 [4.4](../04-preference-optimization/01-dpo)） |

## 方法 / 构造管线

### 1. 人类专家 + 双层质检

- 标注员写回复 → 资深审核 → 争议样本第三轮。
- 适合医疗、金融、合规；成本高，作为 **黄金集** 锚定自动管线。

### 2. 模型合成 + 强过滤

```mermaid
flowchart LR
  prompt[场景 prompt 库] --> gen[多采样 N 条回复]
  gen --> score[RM/规则/执行器打分]
  score --> top[取 top-1 或构造 preference pair]
```

- **N-best 筛选**：同一 prompt 生成多条，用 RM 或单元测试选最优。
- **拒绝采样**：丢弃低分样本，避免污染 SFT。

### 3. 用户反馈闭环

- 点赞/点踩、编辑后发送（implicit preference）。
- 注意 **position bias** 与 **仅反馈差评** 的选择偏差；需时间衰减与去重。

### 4. 课程与进化

- 从短指令 → 多工具链 → 长 CoT（Evol-Instruct 思路，[领读](/paper-reading/agentic/evol-instruct)）。
- 与 [4.1.3 质量数量权衡](../01-sft/03-quality-quantity-tradeoff) 配合：先提质再扩量。

### 5. 与偏好数据联动

- 同一 prompt 保留 $(y_w, y_l)$ 供 RM/DPO；SFT 仅用 $y_w$ 或二者混合（recipe 各异）。

## 工程实践

| 工具/实践 | 说明 |
| --- | --- |
| **数据版本** | DVC / lakeFS + manifest JSON |
| **毒性/PII** | 发布前扫描；合成数据也需 |
| **泄漏检测** | 与 MMLU、GSM8K 等 n-gram 重叠率 |
| **小批试验** | 1k 金标 → SFT → Arena 微评测 → 再扩 |

Constitutional / RLAIF 路线可用 AI 批评迭代数据，见 [4.5 Constitutional AI](../05-constitutional-ai-rlaif/01-constitutional-ai)。

Meta-judge 自改进对齐可参考领读：[Meta Reward LM](/paper-reading/rl-algo/meta-reward-language-models-self-improving-alignment-with-llm-as-a-meta-judge)。

## 代表工作

- **OpenAI InstructGPT** 数据工程：人工排序 + SFT 示范。
- **Anthropic HH-RLHF** 公开偏好集（后续 RLHF 常用）。
- **Tülu / UltraChat** 等开源「精选混合」配方（以各自 model card 为准）。

## 局限与注意点

- LLM 当裁判会形成 **自我强化循环**（模型偏好自己的文风）。
- 过度针对内部 RM 优化会导致 **reward hacking** 式数据（见 [4.3.5](../03-rlhf/05-rlhf-challenges)）。
- 「高质量」随产品迭代；需 **定期废弃** 过期政策样本（如旧 API 文档）。

## 相关章节

- [4.1.2 数据构造](../01-sft/02-data-construction)
- [4.2.1 FLAN、Self-Instruct](./01-flan-t0-self-instruct)
- [4.2.2 Alpaca、Vicuna、WizardLM](./02-alpaca-vicuna-wizardlm)
- [4.3.2 奖励模型](../03-rlhf/02-reward-model)
