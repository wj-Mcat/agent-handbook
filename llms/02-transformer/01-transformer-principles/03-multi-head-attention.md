# 多头注意力（Multi-Head Attention）

## Attention

伪代码如上所示

### Grouped Query Attentionppo

![Grouped Query Attentionppo](./imgs/5b9746ae-2409-4e62-ad58-4beb6447f905.png)

#### 将 query 在 KV cache 当中保存了 G 份，这样现存就少很多了

#### query 是全量的 heads，可是 k-v 的 heads 就比较少了

![query 是全量的 heads，可是 k-v 的 heads 就比较少了](./imgs/619c8ad5-716b-4ff8-811b-92ee1133bf28.png)

#### 计算逻辑

![计算逻辑](./imgs/b872f6e0-f9c2-4c49-ccf8-dd7dc6888c05.png)

#### 优点

#### 减少了计算量

#### 减少了 kv-cache 的容量，进而提升整个模型的吞吐

### Multi-Lantent-Attention

伪代码如上所示

![Multi-Lantent-Attention](./imgs/01279cf7-b9d3-4da7-bda0-b8a7637793d2.png)

#### hidden_state = up(down(hidden_size))

### 稀疏与高效注意力（专章）

Ring Attention、NSA、滑动窗口、DeepSeek DSA、线性注意力等 **长序列与稀疏注意力** 内容已迁至专章，避免与原理篇重复维护：

- [2.3.6 稀疏注意力总览](../03-transformer-improvements/06-sparse-attention/01-overview)
- GQA / MLA 公式与图示见 [2.3.4 注意力变体](../03-transformer-improvements/04-attention-variants)
