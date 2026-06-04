---
title: "StrategyLLM: Large Language Models as Strategy
Generators, Executors, Optimizers, and Evaluators for
Problem Solving"
---

## Abstract

问题背景：现有的提示方法存在泛化性和一致性问题，因为它们通常依赖于特定实例的解决方案，可能不适用于其他实例，并且在所选的少量示例中缺乏任务级别的一致性。

提出方法：StrategyLLM，一个全面的框架，允许大型语言模型（LLMs）通过归纳推理从特定任务实例中推导出一般策略，并通过演绎推理将这些一般策略应用于特定任务示例，以构建可泛化和一致的少量提示。

这个方法本质上和 DSPY 做的是一样的事，都是通过尝试通过训练数据来自动化调整Prompt，从而提升在目标领域上的效果。


## 方法介绍

