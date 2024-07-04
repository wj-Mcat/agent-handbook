---
slug: few-shot-prompting
title: Few-Shot Prompting
---


### Few-Shot Prompting

是不是看起来非常熟悉呢？以前有一个 Few-Shot Learning的NLP 方向，本质上也是给少量的几个case，然后训练模型基于此来学习领域内的知识。

而Agent时代的 Few-Shot 就是prompt 当中添加少量的case 来提升大模型在目标领域的理解能力。

比如当你想用大模型开发一个计算机的功能，并以中文回复，此时也可以在其中添加部分few-shot examples，示例如下所示：

```text
2+2: 四
4+5: 九
8+0:
```

当然，这个是最简单的examples 的例子，当功能变得更加复杂，此时 Examples 也需要写的更加复杂，那此时对Examples 的编写也有一定的要求：

* Example 的质量至关重要

认真编写覆盖你业务场景下的 examples 能够有效提升Prompt的效果，可是也不要加太多，如果超过了20个，效果就会降低。

* Example 的顺序也是有讲究的

在一些具体任务上，不同的 Example 顺序能够产生 -50% - 90%+ 的效果。

关于这点的话，还是比较玄学，不过有一定的前置条件：examples 的数量比较多时此问题才会特别明显。目前没有啥解决方案，必须得你不断的测试调整才能够在目标领域上缓解此问题。

* Example 的类别尽量均匀

如果你是做一个二分类的任务，有10个example 是关于0类别，有2个example是关于1类别，此时大模型的效果就肯定更偏向于1类别，由此可见，Few-Shot Examples 的类别分布要尽量均匀，此时才能够让模型有更高质量的输出。

此时如果一两个example已经能够解决70%的任务，想要继续提升效果，此时就需要针对于那些hard-case 编写高质量的example，进而提升效果瓶颈。

* Example 的格式

Example 的格式也会影响模型的效果，其中最常见的格式为：

```prompt
Q: {question}
A: {answer}
```

当然，针对于不同的任务应该有不同的输入输出格式，而大模型很擅长根据Instruction 和 Examples 输出指定格式的内容。

你也可以尝试多种不同的输入输出格式来测试效果，这也是Prompt Engineering中的重要一个环节。

* Example 的分布

如果你的Few-Shot Examples 能够更贴近测试中的Case，此时生成的效果也会更好。

此外，你也可以增加 Examples 的分布情况，尽量覆盖不同的边界情况，此时生成的效果也会更好。

总之，你给的 Examples 与真实场景更贴近，覆盖的范围更广，生成的效果就会更好。