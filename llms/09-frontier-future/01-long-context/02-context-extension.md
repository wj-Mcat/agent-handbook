# 9.1.2 上下文扩展方法（位置插值、YaRN、LongRoPE）

## 要解决的问题

在不 **从头预训练** 超长序列的前提下，让已在 4K–8K 训练的模型 **外推** 到 128K+，且 loss 与 perplexity 可控。

## 核心思路

RoPE 将位置编码为旋转相位；外推失败源于 **高频分量** 在未见长度上相位错乱。扩展方法 **重标定频率** 或 **插值位置索引**。

## 方法对比

| 方法 | 机制 | 优点 | 风险 |
| --- | --- | --- | --- |
| **位置插值（PI）** | 线性压缩位置索引 | 实现简单 | 近距离分辨率下降 |
| **NTK-aware** | 调整 RoPE base | 少改训练 | 需调 base 超参 |
| **YaRN** | 分段插值 + 注意力温度 | 128K 常用 | 任务敏感 |
| **LongRoPE** | 非均匀频率缩放 | 更长外推 | 实现复杂 |

## YaRN 要点（概念）

对维度分组应用不同插值因子，并在推理时缩放 attention logits（**temperature**）以稳定长距依赖：

$$
\text{attn\_scale} = f(L,\ L_\text{train},\ \text{slope})
$$

工程上常以 **少量长文继续训练（< 1% tokens）** 配合 YaRN 固化行为。

## 推荐流程

1. 选定目标长度 $L_\text{target}$（如 128K）。
2. 应用 **YaRN / LongRoPE** 配置（Transformers `rope_scaling`）。
3. **继续预训练或 SFT** 长文样本（代码库、书籍章节）。
4. 跑 **Needle + 真实 RAG** 回归（见 [9.1.3](./03-needle-in-haystack)）。

## 与架构改动关系

| 仅算法外推 | 算法 + 架构 |
| --- | --- |
| PI、YaRN | MLA 减 KV |
| LongRoPE | DSA 减 FLOPs |
| 继续训练 | 线性 attention（MiniMax） |

## 工程实践

- Hugging Face：`config.rope_scaling = {"type": "yarn", ...}`。
- vLLM：确认 **max_model_len** 与 kernel 支持。
- **不要** 仅改 config 不测 Needle——易出现「窗口开但找不到针」。

## 局限与注意点

- 外推 **≠** 新事实学习；超长文中的 **新分布** 仍需数据。
- 代码/JSON 等 **结构化长输入** 对位置敏感，需专项评测。
- 与 **聊天模板** 截断策略冲突时会静默丢上下文。

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

- 挑战：[9.1.1](./01-long-context-challenges)
- 位置编码基础：[2.1.4 RoPE](../../02-transformer/01-transformer-principles/04-positional-encoding)
- Prefix 缓存：[5.2.4 Prefix Caching](../../05-inference-deployment/02-kv-cache-attention-optimization/04-prefix-prompt-caching)
