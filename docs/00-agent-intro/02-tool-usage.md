---
sidebar_position: 1
slug: tool-usage
---

# 工具使用

大多数的工具调用基于 [ReAct](https://arxiv.org/abs/2210.03629) 模板，可以让LLM 与外部工具进行交互，从而从一定程度上缓解幻觉问题、提升能力边界。

以下为ReAct 的示例：

```txt
query = Who is Olivia Wilde's boyfriend? What is his current age raised to the 0.23 power?

> Entering new AgentExecutor chain...
 I need to find out who Olivia Wilde's boyfriend is and then calculate his age raised to the 0.23 power.
Action: Search
Action Input: "Olivia Wilde boyfriend"
Observation: Olivia Wilde started dating Harry Styles after ending her years-long engagement to Jason Sudeikis — see their relationship timeline.

Thought: I need to find out Harry Styles' age.
Action: Search
Action Input: "Harry Styles age"
Observation: 29 years

Thought: I need to calculate 29 raised to the 0.23 power.
Action: Calculator
Action Input: 29^0.23
Observation: Answer: 2.169459462491557
 
Thought: I now know the final answer.
Final Answer: Harry Styles, Olivia Wilde's boyfriend, is 29 years old and his age raised to the 0.23 power is 2.169459462491557.
 
> Finished chain.
```

工具调用目前属于LLM的基础能力，主流LLM和Agent框架都会集成此类能力。

