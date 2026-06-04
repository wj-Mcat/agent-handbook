# 附录 F　学习资源与社区

汇总 **课程、博客、社区、中文资源**，与大纲正文互补。链接需自行验证可用性。

## 官方文档与教程

| 资源 | 说明 |
| --- | --- |
| [Hugging Face Course](https://huggingface.co/learn) | Transformer、微调、RLHF |
| [PyTorch Tutorials](https://pytorch.org/tutorials/) | 深度学习基础 |
| [DeepSpeed Docs](https://www.deepspeed.ai/) | 分布式训练 |
| [vLLM Docs](https://docs.vllm.ai/) | 生产推理 |
| [OpenAI Cookbook](https://cookbook.openai.com/) | API、Agent 模式 |
| [Google Gemma Docs](https://ai.google.dev/gemma) | 边缘与多模态 |

## 高质量博客与通讯

| 资源 | 说明 |
| --- | --- |
| **Lil'Log** (Lilian Weng) | 综述型（RL、Agent、扩散等） |
| **Sebastian Raschka** | 论文速读与实践 |
| **Hugging Face Blog** | 工具与模型发布 |
| **Interconnects** (Nathan Lambert) | RLHF、对齐、工业观察 |
| **SemiAnalysis** | 芯片与算力（系统视角） |
| **Andrej Karpathy** | 教育视频与 nanoGPT |

## 论文聚合

| 资源 | 说明 |
| --- | --- |
| [arXiv cs.CL / cs.LG](https://arxiv.org/) | 预印本 |
| [Papers with Code](https://paperswithcode.com/) | 基准与实现 |
| **Semantic Scholar** | 引用图谱 |
| 本仓库 **[paper-reading](/paper-reading/)** | 中文领读 |
| 本仓库 **[weekly-paper](/weekly-paper/)** | 周刊 |

## 社区与讨论

| 资源 | 说明 |
| --- | --- |
| **Hugging Face Forums** | 模型与工具 |
| **r/LocalLLaMA** | 本地部署与量化 |
| **Latent Space Discord/Podcast** | 工程师访谈 |
| **GitHub Trending** | 开源模型发布 |
| **知乎 / 公众号** | 中文解读（注意营销稿） |

## 中文课程与书籍（选）

| 资源 | 说明 |
| --- | --- |
| 斯坦福 CS324 / CS336（各年网页） | 基础模型系统 |
| 《动手学深度学习》 | 深度学习入门 |
| 本站点 **[LLMs 大纲](/llms/intro)** | 结构化中文笔记 |
| 本站点 **[Agent Handbook docs](/docs/)** | Agent 应用 |

## 会议（跟踪前沿）

| 会议 | 方向 |
| --- | --- |
| **NeurIPS / ICML / ICLR** | 机器学习综合 |
| **ACL / EMNLP** | NLP |
| **COLM** | 语言模型专会 |
| **OSDI / MLSys** | 系统与推理 |

## 实践项目建议

1. 用 **lm-eval** 评测一个 7B 模型，提交可复现表格。  
2. 用 **vLLM** 部署并压测 **TTFT vs 并发**。  
3. 读一篇 tech-report 并写笔记到 **paper-reading** 风格。  
4. 实现 **最小 Agent**（3 工具 + 循环）+ 回归用例。

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
- 用 [附录 D 工具](./04-d-tools-ecosystem) 或 [lm-eval](https://github.com/EleutherAI/lm-evaluation-harness) 跑通评测脚本。
- 将未知参数整理进 [9.5.3 开放问题](../09-frontier-future/05-conclusion/03-open-questions) 个人笔记。

## 相关章节

- 工具地图：[附录 D](./04-d-tools-ecosystem)
- 论文清单：[附录 E](./05-e-paper-list)
- 从业者建议：[9.5.2](../09-frontier-future/05-conclusion/02-advice-practitioners)
