# 世界模型与具身智能

## 要解决的问题

文本 LLM 仅在 **符号界** 学习统计关联；**具身智能** 需要感知-行动闭环与世界 **动态模型**（预测下一状态）。世界模型（World Model）研究如何让 AI **在脑中模拟物理与社会后果**。

## 核心概念

| 术语 | 含义 |
| --- | --- |
| **世界模型** | 给定状态 $s_t$ 与动作 $a_t$，预测 $s_{t+1}$ 或观测 |
| **具身（Embodied）** | 智能体有传感器与执行器（机器人、游戏 avatar） |
| **Sim-to-real** | 仿真训练迁移真实硬件 |

## 与 LLM 的结合路径

| 路径 | 描述 |
| --- | --- |
| **LLM 作高层规划** | 语言分解任务 → 低层策略网络执行 |
| **多模态 LLM** | 图像/深度输入 → 语言推理 → 动作 token |
| **视频世界模型** | Sora 类生成模型作 **想象 rollout**（研究热） |
| **VLA 模型** | Vision-Language-Action 端到端策略 |

## 代表方向（2024–2026）

- **RT 系列**（Google）：机器人 Transformer。
- **OpenVLA / π0**：开源 VLA 栈。
- **游戏与模拟**：Minecraft、MuJoCo 中 LLM 指挥工具 API。

## 工程栈

- **仿真**：Isaac Gym、MuJoCo、Habitat。
- **数据**：遥操作演示、人类视频。
- **安全**：真实机器人 **力矩限制**、急停、沙箱。

## 与纯文本 Agent 对比

| | 文本 Agent | 具身 Agent |
| --- | --- | --- |
| 反馈 | 工具 stdout | 物理噪声、延迟 |
| 错误成本 | 低（可重试） | 高（损坏、伤人） |
| 数据 | 互联网文本 | 稀缺、贵 |

## 局限与注意点

- LLM **空间几何** 推理仍弱；需 **专用感知** 模块。
- 世界模型 **幻觉** 在物理域可 **灾难性**。
- 伦理：**劳动力替代、军事** 应用需治理。
- 个人理解：中期产品形态是 **「LLM + 仿真规划 + 小模型控制」** 分层（待验证）。

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

- 多模态基准：[7.1.4](../../07-evaluation/01-benchmarks/04-multimodal-benchmarks)
- Agent 基准：[7.1.5](../../07-evaluation/01-benchmarks/05-agent-benchmarks)
- 能力边界：[9.4.1](./01-capability-boundaries)
