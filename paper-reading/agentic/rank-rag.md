---
title: "RankRAG: Unifying Context Ranking with Retrieval-Augmented Generation in LLMs"
---

## 简要介绍

粗略的来看，LLM时代下的RAG当中会包含以下二个步骤：
1. Retrival：从知识库当中召回出k个文本。
2. Generation：将召回出来的k个文本，塞到模型当中，让模型来生成最终回复。

> 个人感觉 本论文所假设的问题有点过于简单，在[LlamaIndex](https://github.com/run-llama/llama_index) 当中的方法很多，远远能解决此问题，不过还是来仔细看看吧。

可是这个和传统方法相比，缺少了一个ranking的阶段，而本论文提出一个新方法，在Instruction-Tuning 训练的过程中，加入了 Ranking 相关的训练数据，实验效果非常好，这样可同时解决Rank和Generation的问题。

## 详细介绍

### 要解决的问题

在当前
