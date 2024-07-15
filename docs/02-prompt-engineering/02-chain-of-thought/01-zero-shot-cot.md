---
---

## Zero-Shot CoT

像原始论文中仅仅加入了：“let's think step by step”就是属于Zero-Shot 方法，可是除了这句话，还有其它的sentence可以让模型有更好的思考方式。

:::tip 人是如何思考？大模型是如何思考？

写到这里，突然感觉其实CoT就是在让模型如何思考。上升到更上层的维度，思考方式对于人而言至关重要，大决定了一个人的命运，小到如何有效解决一个问题。

所以大模型的思考方式也是一个非常有趣的话题，当然这个除了你告诉他如何思考之外，也取决于背后LLM的思考能力，是否有训练过多种思考方式（与训练数据集相关）。

:::

这里也有一起其它的方法能够让模型有不同的思考：

```prompt
你需要一步一步的思考并解决此问题，最终保证你真的解决了此问题。

首先，你需要从不同层面且具备一定逻辑性的思考这个问题。
```

Zero-Shot CoT 的方法应用也是非常广泛，同时非常吸引人，因为：构造Examples 也需要一定的成本（虽然我并不觉得 Examples 的构造有多复杂）。

### Step-Back Prompting

此方法主要是让模型在开始Reasoning之前先生成几个更上层的问题和概念，然后回答它，此时能够让模型获得更全面的整体信息，进而提升回答的效果。

### Thread-of-Thought Prompting

这个方法相对比其它方法，也是换汤不换药：让LLM从不同角度来思考（给予模型不同的思考方式），进而提升模型的效果。

关键Prompt 如下所示：

```prompt
Walk me through this context in manageable parts step by step, summarizing and analyzing as we go.
```

### Tabular Chain-of-Thought

这个更TM有意思，让模型以Markdown的方式来输出，进而提升模型的结构化推理能力。

大家可自行编写适应与你们自己任务的Prompt，目标就是让思考过程 markdown 化。

:::tip 老铁你们说，这个想法能发一篇论文吗？

在这里脑暴一下，我如果让思考过程以json 的方式来输出，效果会不会更好呢？是否有资格发一篇论文呢？

:::
