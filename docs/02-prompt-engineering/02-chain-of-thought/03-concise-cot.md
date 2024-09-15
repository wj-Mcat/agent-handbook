---
title: "Concise Thought"
---


CoT 的长度通常是会影响整体时延,有的项目当中会直接把 CoT 的策略给删除,可是这个通常会影响模型的效果.

此时你可以有两种策略:
1. 增加你的训练数据
2. 缩短你的 CoT 长度进而提升模型的效果.

第一种方法就非常的简单粗暴，不过很可能会破坏你这个模型的通用 chat 能力，除非你的目的就是要构建一个垂类的不具备很强通用 chat 能力的模型。


## 参考文章

* [[1] Concise Thoughts: Impact of Output Length on LLM Reasoning and Cost](h是)
