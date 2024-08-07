---
---


## Few-Shot CoT

顾名思义，这个是在Prompt当中添加一些Examples 来提升CoT 的效果，那如何实现呢：在Example当中添加Thought 的数据，这样，模型就可以借鉴一些“思考”，进而进行更稳定的思考。

Example 中的思考可以是人手写的，也可以是模型动态生成的。

所以Few-Shot CoT 的目标就是提高Thought 的准确性。

### Contrastive CoT Prompting

通常我们会添加一些正确的思考内容，可是作者提出，我们同时也需要给出一些错误的思考方式，今日提升思考正确性。

简单来说，我们不仅仅要提供“我们应该这样思考”，还要提供“我们不应该那样思考”，这样LLM的思考效果才会更好。

### 实在是不想写这个篇幅了

其实还有一些其他Few-Shot CoT 的方法，我这边没有写，因为在我看来，这TM全部是都是注水论文，没有任何实用价值，免得脏了您的眼，所以我就没有写，如果你们感兴趣的话，可以亲自去读一读相关系列论文。