---
title: "[Paper Reading]ORPO: Monolithic Preference Optimization without Reference Model"
---

## 主要解决的问题

ORPO 提出了一个非常创新的方法：将 模型对齐阶段 和 SFT阶段 融合到一起，进而提升模型的训练方法。

在 SFT 阶段，就直接将对齐的数据加入到训练当中，进而在SFT 阶段就已经实现了模型对齐的能力。

## 方法介绍

在 PPO  和 DPO 方法当中，都必须要有一个 Reference Model，如果要想在 SFT 阶段实现对齐算法，就肯定要**砍掉** Reference Model 这个玩意儿。

在正式介绍方法之前，首先要提一嘴，SFT 和 DPO 之间的区别：
* 数据构造不一样
  * SFT的数据主要是做数据生成，输入一般包含有：input, output
  * DPO的数据主要做不同答案之间的内容判别，输入包含：input, choosen, reject 三种数据类型。

* loss 函数不一样
  * SFT 的loss 主要是Shift Cross Entropy
  * DPO 的loss 就比较复杂，为代码为： loss = (policy_choosen_loss - poclicy_reject) - (reference_choosen_loss - referencey_reject)

所以，需要在SFT 阶段完成 DPO 的方法，此时就需要：
* 将policy Model 作为 Reference Model
* SFT 的数据和 DPO 的数据不能在同一个batch 当中，否则无法进行模型forward 以及计算loss。

## 优缺点

优点：
1. 大大降低了SFT 和 对齐阶段的复杂度，进而有效的利用计算和时间资源。
2. 效果更好？（有待社区验证，如果没有什么动静的话，那基本上就G 了）

缺点：
1. 增大了SFT阶段的复杂度，有一定的适配成本。