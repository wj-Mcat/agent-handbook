# RWKV、RetNet

## 要解决的问题

在保持 **可并行训练** 的同时，用 **线性递推** 替代 full attention，降低长序列推理的 **KV 增长**，探索 Transformer 之外的骨干。

## RWKV（Receptance Weighted Key Value）

| 属性 | 说明 |
| --- | --- |
| 形式 | 线性 RNN + 通道混合，**时间混合** 替代 attention |
| 训练 | 并行化形式（WKV 算子） |
| 推理 | $O(1)$ 状态更新 / step |
| 生态 | RWKV-LM 社区模型、GGUF |

**强项**：长生成吞吐、边缘部署。  
**弱项**：精确拷贝、复杂检索相对 Transformer **需实测**。

## RetNet（Retention Network）

Microsoft 提出 **多尺度保留机制**，统一 **并行训练** 与 **递推推理**：

$$
\text{Retention}(Q,K,V) = \text{并行形式} \equiv \text{递推形式}
$$

| 模式 | 用途 |
| --- | --- |
| 并行 | 训练像 Transformer block |
| 递推 | 推理像 RNN，省 KV |

产业落地少于 RWKV/Mamba，但影响 **线性注意力理论** 叙述。

## 三者对比（直觉）

| | Transformer | RWKV | RetNet |
| --- | --- | --- | --- |
| 训练并行 | 优 | 优（特殊核） | 优 |
| 推理 KV | 线性增 | 固定状态 | 固定状态 |
| 生态 | 最大 | 中 | 研究为主 |

## 工程实践

- **RWKV**：`rwkv.cpp`、Hugging Face 转换；适合 **小说、语音流** 长生成。
- **与混合架构**：常与少量 attention 层交替（见 [9.3.3](./03-hybrid-architectures)）。
- 选型前跑 **Needle、代码补全、多轮对话** 三联测。

## 局限与注意点

- 预训练 **数据与算力** 投入远小于 Transformer，同尺寸 **通用榜** 常落后。
- CUDA kernel **成熟度** 影响实际吞吐优势。
- 个人理解：2025–2026 主线仍是 **稀疏/压缩 Transformer**，RWKV 占 **细分场景**（待验证）。

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

- Mamba：[9.3.1](./01-mamba-ssm)
- 混合架构：[9.3.3](./03-hybrid-architectures)
- 线性注意力：[2.3.6.5](../../02-transformer/03-transformer-improvements/06-sparse-attention/05-linear-attention)
