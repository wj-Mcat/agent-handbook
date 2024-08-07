---
sidebar_position: 1
slug: memory-of-agent
---

# 记忆管理

说的高级一点，就是智能体拥有长期记忆；说的Low 一点，就是把历史对话和开发者觉得重要的相关信息以一定格式塞入到 Prompt 当中，这样大模型就能够看到历史信息，此时便拥有了记忆。

当然，这里`说的Low一点`仅仅是为了方便大家理解，并没有任何贬低的意思。

当然，就好比如人类，记忆也分为长期记忆和短期记忆，并不是所有的内容都需要存放到记忆当中，毕竟记忆存储的空间是有限的。就好比如人类其实只能记忆一部分重要的内容，随着时间的流逝，很多曾经的美好都已忘却，甚至是曾经那个最重要人的生日。这些都不重要了，重要的是眼前这个人才是你接下来的人生路途中最重要的。

所以，记忆的内容是需要有选择性的，你可以让Agent 选择性的记忆不同的内容，根据记忆类型区分，可以将其分为两类：短期记忆、长期记忆。而这两类有点类似于思考快与慢当中的System1和System2。

### 短期记忆

> Short-Term Memory

短期记忆的作用仅限于在执行某个任务时存在的记忆，一旦任务完成之后相关的记忆即可被清除。

假如，你去医院挂号看医生，在等待的那段时间，你对医生的名字记忆非常深刻，甚至会产生一种本能反应：一旦听到这个医生的相关声音，此时就会竖起耳朵听。可是当你走出医院刷会儿手机之后，你还记得刚才那个医生的全名叫什么吗？

几乎记不得，因为这个名字对于看完病之后的我们而言，并不重要，他的作用仅仅只体现在看病那个时间段。

Agent 中的记忆也是一样的，如果要完成一个复杂的任务，通常会将其拆分成不同的小任务来执行，在不同的小任务当中的记忆内容很可能是不一样的，而当所有的任务都技术之后，只需要将任务的需求描述和执行结果给出来即可，不需要包含每个小任务中的细节。

所以，短期记忆你明白了吗？

### 长期记忆

> Long-Term Memroy

那长期记忆也非常重要，可能会一直印在脑子里面的信息，比如说：你爸妈是谁，你是谁，1+1 等于多少 等相关信息。

人的一生会很长，可能会包含很多很杂的信息，可是你的记忆容量是有限的，只能包含部分信息，所以此时你可以将记忆内容进行精简，从而达到能够记忆的目的：

1. Memory Summary：将一段时间内的记忆进行总结，归纳成一段话。
2. Important Memory：记住一段时间内的非常重要的人、事或者物。
3. RAG：将每段时间的记忆存储到数据库当中，方便后续检索，提取重点信息。

通过 Memory Summary 可以将大大减少记忆的存储长度，也不确实记忆的完整度；Important Memory 则是将重要的人、事或者物进行记录，属于高频重要信息；RAG 则可以有选择性的检索重点信息，提供给自己使用。

这些方法能够让Agent在记忆管理方面像人一样工作，处理复杂的问题，进而为人类赋能。

如想了解更多更详细记忆相关的知识点，可查看 [记忆管理](./01-memory.md) 小节。