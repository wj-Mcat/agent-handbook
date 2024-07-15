---
slug: dynamic-prompting
title: Dynamic Prompting
---

### 动态选择 Few-Shot Examples

如果你针对于目标场景下有很多的Examples（假设有100个case），此时是否一股脑儿将其全部塞入到 Prompt 当中吗？

非也非也，上文也讲过：
* 如果一个Examples 的数量超过20个，反而会降低模型生成的效果。
* 如果 Examples 的分布与真实输入场景越接近，此时模型生成的效果会越好。

于是，Examples 的选择如果动态起来，此时效果会越好。那如何选择Examples 也有相关的方法：

#### K-Nearest Neighbor（KNN）

方法很简单，可以针对于 所有的Examples 建索引，然后根据query 来召回出最相近的一批Examples，然后塞入到 Prompt 当中，即可提升模型的效果。

可是此方法有一个缺点：Examples 都是相似的，分布太集中，可能会影响模型的泛化性。

#### Self-Generated In-Context Learning

在Zero-Shot场景中，此方法能够有一定的提升效果，可是也存在一定的风险：一旦动态生成的 Examples 不符合目标领域效果，此时会将模型的生成内容给带偏，大大降低目标领域上的效果。

在实际开发过程中，如果能编写一些 Examples 就尽量写，而且也不是很复杂，也能够更稳定的控制好模型的输出效果，此方法不太建议大家使用。

#### 更复杂的Prompt 方法

比如说：LENS、UDR以及Active Example Selection 等方法利用了 embedding、retrieval以及强化学习等相关技术来筛选Examples，这样能够让Examples有更好的效果。

:::warning

这些复杂的方法我后续会详细展开给大家讲解介绍。

:::