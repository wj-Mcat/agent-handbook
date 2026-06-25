# Agent Handbook

<p align="center">
  <strong>一个面向 LLM、Agent、提示词工程与论文阅读的中文技术博客。</strong>
</p>

<p align="center">
  <a href="https://wj-mcat.github.io/agent-handbook">在线阅读</a>
  ·
  <a href="https://github.com/wj-Mcat/agent-handbook">GitHub</a>
  ·
  <a href="https://x.com/wj_Mcat">X / Twitter</a>
</p>

<p align="center">
  <img alt="Docusaurus" src="https://img.shields.io/badge/Docusaurus-3.4.0-2e8555?logo=docusaurus">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-%3E%3D20.18.1-339933?logo=node.js&logoColor=white">
  <img alt="Language" src="https://img.shields.io/badge/Language-中文-blue">
  <a href="https://x.com/wj_Mcat">
    <img alt="Follow on X" src="https://img.shields.io/twitter/follow/wj_Mcat.svg?logo=x">
  </a>
</p>

## About

Agent Handbook 是我在学习、实践和研究 AI Agent / LLM 过程中的公开笔记本。这里不会只做资料搬运，而是尽量把概念、论文、工程经验和个人理解整理成可以持续阅读、检索和复用的技术文章。

这个项目适合：

- 想系统入门 Agent、LLM、Prompt Engineering 的开发者和研究者；
- 想跟进 LLM 训练、对齐、推理、评测、部署等技术脉络的同学；
- 想通过论文阅读理解 Agent 与大模型前沿进展的人；
- 想把零散知识沉淀成结构化笔记的长期学习者。

## Content Map

| 模块 | 内容 |
| --- | --- |
| [Agent](https://wj-mcat.github.io/agent-handbook/docs/category/agent-%E4%BB%8B%E7%BB%8D) | Agent 基础概念、记忆、工具使用、规划、工作流与应用实践 |
| [LLMs](https://wj-mcat.github.io/agent-handbook/llms/intro) | 大语言模型发展脉络、Transformer、预训练、后训练、推理部署、评测与前沿方向 |
| [Prompt Engineering](https://wj-mcat.github.io/agent-handbook/docs/category/%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%B7%A5%E7%A8%8B) | ICL、CoT、任务分解、提示词优化与工程化经验 |
| [Paper Reading](https://wj-mcat.github.io/agent-handbook/paper-reading) | 面向 Agent、LLM 训练对齐、Benchmark、技术报告等方向的深度论文阅读 |
| [Weekly Paper](https://wj-mcat.github.io/agent-handbook/weekly-paper) | 每周整理 1-3 篇值得关注的论文，偏快速消化和趋势跟踪 |
| [Blog](https://wj-mcat.github.io/agent-handbook/blog) | 更自由的技术随笔、实践记录和阶段性思考 |

## Featured Topics

- Agent Workflow：从简单工具调用到可规划、可执行、可反思的智能体系统。
- LLM Training：预训练数据、Scaling Laws、分布式训练、SFT、RLHF、Preference Optimization。
- Reasoning Models：长链推理、Test-Time Compute、RLVR、可验证奖励与推理模型训练。
- Agentic Benchmarks：面向真实任务流、工具使用和多步骤任务的评测方法。
- Paper Notes：用“问题、方法、实验、启发”的结构拆解论文，而不是只摘摘要。

推荐从 Andrew Ng 的 Agentic Workflow 演讲开始建立直觉：

[![What's next for AI agentic workflows ft. Andrew Ng of AI Fund](https://img.youtube.com/vi/sal78ACtGTc/maxresdefault.jpg)](https://www.youtube.com/watch?v=sal78ACtGTc)

## Local Development

本项目基于 Docusaurus 构建，要求 Node.js `>= 20.18.1`。

```bash
npm install
npm run start
```

本地开发服务默认运行在：

```text
http://localhost:3001/agent-handbook
```

常用命令：

```bash
npm run start      # 启动本地开发服务
npm run build      # 构建静态站点
npm run serve      # 本地预览构建产物
npm run typecheck  # TypeScript 类型检查
npm run clear      # 清理 Docusaurus 缓存
```

## Writing Principles

这个仓库中的内容会尽量遵循几条写作原则：

- 先解释问题，再介绍方法，避免只堆概念和术语；
- 区分论文结论、个人理解和经验判断；
- 保留必要英文术语，但正文默认使用中文；
- 能画结构就不只写段落，能给例子就不只下定义；
- 关注“为什么重要”和“如何落地”，而不是只追逐热点。

## Contributing

欢迎通过 Issue 或 Pull Request 一起完善这个知识库。比较适合贡献的内容包括：

- 修正错别字、坏链、公式或代码片段；
- 补充 Agent / LLM 相关论文阅读笔记；
- 增加工程实践、Benchmark 解读或模型技术报告总结；
- 改进站点结构、搜索体验和阅读体验。

提交内容前建议先运行：

```bash
npm run typecheck
npm run build
```

## Community

- X / Twitter：[@wj_Mcat](https://x.com/wj_Mcat)
- Discord：[Agent Handbook Community](https://discord.gg/gJNKfdTr)
- 知识星球：[获取最新博客与讨论](https://t.zsxq.com/soEav)

## License

本项目遵循仓库中的 [LICENSE](./LICENSE)。如果你引用或转载其中内容，欢迎注明来源。
