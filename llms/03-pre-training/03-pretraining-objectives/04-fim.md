# 3.3.4 FIM（Fill-in-the-Middle）

## 要解决的问题

代码补全不仅需要「续写后缀」，还需要根据**上文与下文**填充中间片段（IDE 光标在中间）。Fill-in-the-Middle（FIM）在预训练阶段随机打乱片段顺序并预测中间，使 Decoder-only 模型具备非因果填空能力，显著提升 StarCoder、CodeLlama 等代码模型表现。

## 核心概念

将文档切为三段 $(\text{prefix}, \text{middle}, \text{suffix})$，以概率 $p_{\text{FIM}}$ 训练 FIM 而非普通 CLM。常见排列（PSM）：

$$
\text{Input} = \langle \text{prefix} \rangle \; P \; \langle \text{suffix} \rangle \; S \; \langle \text{middle} \rangle \; M
$$

模型因果 attend，损失在 $M$（及可选 sentinel）上计算。另一排列 SPM 交换 sentinel 顺序。

| 超参 | 典型范围 |
| --- | --- |
| $p_{\text{FIM}}$ | 0.2～0.5 |
| span 长度 | 按行或 AST 启发式 |

## 方法/算法

1. 从代码样本随机选切分点（避免切断字符串字面量可用启发式 parser）；
2. 以 $p_{\text{FIM}}$ 走 FIM 排列，否则标准 CLM；
3. 特殊 token：`<fim_prefix>` `<fim_suffix>` `<fim_middle>`（名称因模型而异）；
4. 与 [CLM](./01-causal-lm.md) 共用 backbone，仅数据布局不同。

```mermaid
flowchart LR
  code[源代码] --> split[切_P_M_S]
  split --> layout[FIM_排列或_CLM]
  layout --> loss[因果损失]
```

## 工程实践

- **推理**：API 提供 `suffix` 参数时启用 FIM 布局；需与训练 sentinel 一致。
- **非代码**：FIM 也可用于表格、日志，但收益小于代码（个人理解）。
- **数据**：GitHub 清洗代码见 [3.1.1](../01-pretraining-data/01-data-sources.md)；许可证见 [3.1.5](../01-pretraining-data/05-data-licensing.md)。
- **工具**：`transformers` 部分代码模型内置 `fim_rate` 数据 collator。

## 代表工作

- Fried et al. InCoder：https://arxiv.org/abs/2204.05999
- Bavarian et al.（OpenAI Codex FIM 技术说明）
- Li et al. StarCoder：https://arxiv.org/abs/2305.06161
- Rozière et al. Code Llama：https://arxiv.org/abs/2308.12950

## 局限与注意点

- **与纯 CLM 混合比例**：FIM 过高可能略损左到右续写（需 ablation）。
- **AST 感知切分**：朴素随机切分可能破坏语法，高级实现用 tree-sitter。
- **长上下文**：suffix 很远时 RoPE 外推与 FIM 同时存在难度。
- **评测**：HumanEval 多为函数补全；中间填空需 IDE-Bench 类指标。


## 延伸说明
避免在字符串字面量中间切分；tree-sitter 可降低无效 FIM 样本。
## 实践检查清单
- [ ] PSM
- [ ] SPM
- [ ] 代码

## 小结

本节核心：PSM 与全链路 SPM 协同；上线前用检查清单做回归。


## FIM 与 IDE 场景

| 场景 | 布局 |
| --- | --- |
| 行尾补全 | 纯 CLM |
| 光标在中间 | PSM / SPM |
| 多文件 | 需路径与 repo 上下文（数据层） |

训练数据应包含目录结构、import 语句，以匹配真实仓库分布。

## 相关章节

- 上一节：[3.3.3 Prefix / Span](./03-prefix-lm-span-corruption.md)
- 下一节：[3.3.5 多任务](./05-multitask-pretraining.md)
- CLM：[3.3.1](./01-causal-lm.md)
- 代码推理：[6.1.2 代码推理](../../06-reasoning-test-time-compute/01-complex-reasoning/02-code-reasoning.md)
