# 1.4.2 经典 NLP 任务（分类、序列标注、机器翻译、QA）

## 序列生成训练

### Teacher Forcing

训练序列模型（如 RNN、Transformer Decoder）时，**Teacher Forcing** 指：解码第 $t$ 步时，把**真实上一 token**（来自标注序列）作为输入，而不是模型上一步的预测。这样能加速收敛，但会造成 **exposure bias**——训练时总看到正确历史，推理时只能用自己的预测，分布不一致。

常见缓解方式：Scheduled Sampling、Professor Forcing 等。
