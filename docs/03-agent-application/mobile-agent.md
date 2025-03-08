---
slug: mobile-agent
title: Mobile Agent
authors: wj-Mcat
tags: [tools, Function Call, Agent]
toc_min_heading_level: 2
toc_max_heading_level: 5
---

## 一：Mobile Agent 背景

AI 的发展已经逐渐蔓延到各行各业，其中手机行业也是在逐渐变革，其中 Mobile RPA 的技术方向如火如荼，也有很多厂家都在逐渐实现这项技术。

### 1.1 那什么是 RPA 呢？
全称：Robotic Process Automation，旨在模拟人工操作以实现自动化工作流，比如说在模拟手机上的点击、滑动、输入文字等不同操作内容，进而实现手机上常见的操作，比如：点一个螺蛳粉外卖、给妈妈打一个电话、导航到公司等不同的简单操作。

:::tip

如果以上功能实现了，手机将成为人们强有力的助手。

:::

### 1.2 Mobile Agent 如何实现呢?

1. Automation 工具：用以获得手机屏幕信息、模拟手机操作。
2. 视觉模型：用来理解当前画面中的各种元素，并寻找目标元素位置。
3. 语言模型：根据用户的 query 并根据上下文信息做任务规划。

这相当于：手机有了手、大脑和眼睛的辅助，就可以完成手机的自动化操作流程了。

## 二：技术路线

### 2.1 Android UI Automator

![UI Automator](./imgs/android-ui-automator.png)

自动化操作工具分为：系统级别和用户级别，此处重点关注用户级别，分别有以下相关工具：
- http://appium.io/docs/en/latest/intro/appium/
- https://github.com/openatx/uiautomator2

此类工具可以通过 adb 获取手机屏幕信息，模拟用户操作，进而完成手机自动化操作。此内容偏向于工程，不属于算法侧的重点关注对象，于是简单忽略即可。

### 2.2 视觉模型

手机屏幕当中的元素分为：XML 和 屏幕截图两种原始数据，前者可以使用纯语言模型来理解，后者就只能够用多模态语言语言来理解。

需要完成功能：
1. 理解当前屏幕中的元素内容：整体分析屏幕的功能。
2. 精准获得某一个元素（比如：搜索框，点赞按钮等）的矩阵坐标，进而给自动化工具进行操作。

:::tip 多模态模型能力现状

在当下的技术栈下，通常是需要使用多模态模型来完成此任务，毕竟图片中包含的信息丰富，且现在多模态模型发展越来越快，性能基本上已经满足此类需求。

目前多模态模型已经可以实现：
1. 图片信息的总结
2. object detection，进而在图片中查找并定位相关 icon 的具体位置。

:::

### 2.2 语言模型

语言模型需要完成：

1. 根据用户的问题生成任务编排（比如：给我老婆发给消息，说我今天晚点回家）
2. 根据历史执行步骤进行反思，决定下一步要执行什么动作。
3. 理解屏幕中的元素信息，总结并执行相关的操作。
4. 生成 Function Call 的 Calling Information 进而支持调用手机上的多种 API 完成指定任务，比如：打开某 APP、点击某个按钮以及在文本输入框中输入指定文字内容等。

所以此模型主要是一个 Function Call 类型模型，通常是需要应用在手机侧，故需要使用小模型完成指定任务。

其训练的 Prompt 通常如下：

```html
<|im_start|>system
You are a helpful assistant.<|im_end|>

{{tool_spec}}

<|im_start|>user
导航到北京天安门<|im_end|>
<|im_start|>plan
1. 打开高德地图 APP
2. 在搜索框中输入北京天安门
3. 点击搜索结果并导航去指定位置

<|im_start|>assistant
Thought: 我需要首先打开高德地图 APP
Action: open_app
Action Input: {"app_name": "高德地图"}
Observation: {"msg": "已成功打开高德地图 APP"}

<|im_start|>assistant
Thought: 我需要在搜索框中输入北京天安门
Action: search_and_write_text
Action Input: {"target": "search_box", "text": "北京天安门"}
Observation: {"msg": "我已经成功找到并输入指定内容"}

<|im_start|>assistant
Thought: 点击搜索结果并导航去指定位置
Action: navigate_to_location
Action Input: {"target": "target_location", "text": "北京天安门"}
Observation: {"msg": "已成功导航去指定位置"}

<|im_start|>assistant
Thought: 已完成指定任务，可以结束任务了
Final Answer: 已成功完成导航去北京天安门的操作<|im_start|>
```


## 三：核心技术难点

### 3.1 如何理解当前屏幕的内容？

- 通过 XML 来理解

优点：可使用当前 SOTA 语言模型进行辅助理解，可通过 xpath 的信息进行定位对应元素。
缺点：无法理解手机中的各种图片元素内容。

- 通过当前屏幕截图来理解
优点：可以理解屏幕当中的所有元素信息，能够精准获得每个元素的坐标，进而辅助自动控制模块操作。
缺点：传统多模态模型无法完成此类任务，需要由多个模型联合完成，比如诗视觉语言模型、物体检测模型等。

### 3.2 如何精准点击屏幕当中的某一个元素呢？

- XPath：通过 xml 可以进行精准定位。
- 图像：多个数据模型辅助完成此类任务，当然如果已有此类模型就更好了。

### 3.3 如何让模型学会使用手机？

想象一下：一个刚拿到手机的初中生，你让他要很熟练的操作手机是一件很难的事情，所以必须需要有一定的先验知识。

先验知识：
- 屏幕内容理解能力
- 手机常规操作的常识理解能力
- 不同场景的 Prompt 预先设置。

## 四：相关工作分享

### 4.1 ScreenAI: A visual language model for UI and visually-situated language understanding

- 简要介绍
模型混合了PaLI 和pix2struct 模型的架构，旨在识别 screen 中 UI element 的类型和location（坐标）。
也是一个 screen 标注模型。
发布了三个数据集：一个用于屏幕 UI 元素标注、两个专注于 QA。

- 模型架构
[图片]
- 训练数据的构造方式
[图片]
- Task annotation
[图片]

### 4.2 Mobile-Agent-v2: Mobile Device Operation Assistant with Effective Navigation via Multi-Agent Collaboration

方法包含：
- planning agent：做任务规划和编排
- decision agent：针对于当前屏幕信息和历史屏幕信息做决策
- reflection agent：根据历史消息决定下一步该做什么
[图片]

- 使用到的模型
Visual Perception Module
- OCR 识别： ConvNextViT-document
- icon 识别：GroundingDINO
- Icon description tool：Qwen-VL-Int4

MLLMs
Planning Agent可用纯文本的模型：GPT-4 OpenAI

### 4.3 UI-Star

## 五：罗马大道

重点放在模型测，需要解决以下问题：
1. 语言模型/视觉模型能够精准的理解当前界面的内容。
2. 语言模型能够根据当前界面进行合适的任务规划。
3. 能够精准的获取不同元素的位置、输入以及可以执行的相关操作等信息。

为了完成以上任务，此时就需要做以下工作：
1. 语言模型添加一些手机任务规划和反思的训练数据语料。
2. 视觉模型能够有效理解当前页面中奇奇怪怪的icon、图片、嵌套内容。

