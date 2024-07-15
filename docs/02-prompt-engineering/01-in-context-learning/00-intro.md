---
slug: intro
title: Introduction
---

# In-Context Learning

## 什么是 In-Context Learning

简单来说，就是提供具备一定信息量的上下文，让模型能够精准的学习关键知识，遵循相关指令。。

确切来说，就是编写具备一定引导性的Instruction、提供高质量的Examples、提供足够的外部知识提升大模型在目标任务上的能力。而这一切过程都没有模型的参数更新，仅仅是通过调整Prompt的内容即可完成。

:::tip 其实 Prompt Engineering 一点都不 Low

可能对于一直做LLM Finetune的算法工程师而言，Prompt Engineering 没啥关键技术，非常的Low，可是这就好比如模型训练过程中的 gradient descent 背后的技术就是：链式求导，哪些学数学的小伙伴肯定也是觉得很low，不过不得不承认，链式求导之后进行参数更新对于模型训练而言，至关重要。

:::

In-Context Learning 算是大模型目前最基础的能力之一了，其中Instruction Tuning分支就严重依赖于此能力。如果大家感兴趣的话，我可以写一篇文章来详细介绍此能力。
