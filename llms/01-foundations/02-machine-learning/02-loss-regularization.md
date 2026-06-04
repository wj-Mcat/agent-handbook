# 1.2.2 损失函数与正则化

## 概览

参考论文：[LOSS FUNCTIONS AND METRICS IN DEEP LEARNING](https://arxiv.org/pdf/2307.02694)  （后期可不断丰富此脑图）

## Cross Entropy Loss

交叉熵本质上是一个 one-hot 数据处理，第一个图片是二分类的公式，第二个是多分类的公式。

### 公式

交叉熵本质上是一个 one-hot 数据处理，第一个图片是二分类的公式，第二个是多分类的公式。

![公式](./imgs/9d10798a-7029-4200-cd0d-d474716c2bbd.png)

### 介绍

交叉熵主要用于分类任务中的损失函数，比如说文本分类、多标签分类甚至 Decoder-Only 任务解码中的损失函数。

#### 交叉熵其实就是 negative log likelyhood 的过程，其实本质上就是极大似然数估计的过程，想要最大化数据范围。

### 优点

#### 简单易懂，也易于实现，已经集成到各大训练框架当中

#### 计算之后的梯度更加平滑，让模型的整个训练

### 缺点

#### 对 outliner 和数据均衡分布太敏感了，一旦有相关的训练数据，训练的效果就会收到很大的影响。

#### 为了解决这个问题，当然也提出了很多不同种类的 loss function，比如：weighted cross-entropy, focal cross-entroy, class-balanced loss 。

#### 如果是分类的任务，loss 和最终的 acc 并不能直接关联，比如：loss=0.5，Acc 可能有 50% 和 90%，也都是有可能的。

## Metric Learning

### 介绍

#### 是为了预测输入样本之间的相对距离

### Ranking Loss

#### 介绍

#### 有二元组训练数据（Pairwise ranking loss）、三元组训练数据（triplet ranking loss）

#### 负例样本的选择

#### easy loss：负样本的例句足够大，这种情况基本上不用考虑

#### semi-head triplets：distance(anchor, negative) > distance(anchor, positive), 可是距离忍让是小于m

#### hard negatives

`distance(anchor, negative) < distance(anchor, positive)`

- 这种情况下是最难的

#### 最好是使用在线选择数据，这样效率会更高

- 在线选择triplet loss 的解决方案：https://omoindrot.github.io/triplet-loss
- 可视化loss： https://github.com/adambielski/siamese-triplet

#### 丰富 ranking loss

[https://gombru.github.io/2019/04/03/ranking_loss/](https://gombru.github.io/2019/04/03/ranking_loss/)

## Contrastive Learning

### InfoNCE（Information Noise-Contrastive Estimation）

![InfoNCE（Information Noise-Contrastive Estimation）](./imgs/df0056d5-9c76-4e89-959b-50e7d34c136d.jpeg)

#### InfoNCE 的目标是最大化正样本对（相似样本）的相似度，同时最小化负样本对（不相似样本）的相似度，从而学习数据表示。

#### 自监督学习、对比学习（如 SimCLR、MoCo）

#### InfoNCE 更侧重于表示学习，通过最大化互信息（Mutual Information）来优化模型，适合大规模负样本场景。其温度参数和负样本数量对模型性能有显著影响。

#### 主要用于自监督学习和对比学习，广泛应用于图像、文本、多模态任务（如 CLIP）

## Cross Entropy

### logits * label

## Parallal Cross Entropy

### 多张卡之间计算损失，并 gather 到一起。

## DPO Loss

### 介绍

#### 输入包含：输入的 query 、 policy_chosen 、 policy_reject、reference_chosen, reference_reject 五个模块，核心思想就是：query 的输出要与 chosen 靠近，与 reject 远离，同时 policy 和 reference 模型的分布还不能距离太远。

#### a = policy_chosen - policy_reject

#### b = reference_chosen - reference_reject

#### a - b

## ppo loss
