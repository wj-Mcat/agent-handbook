# 2.1.3 多头注意力（Multi-Head Attention）

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

### Ring Attention

![Ring Attention](./imgs/8d988c38-056d-40b2-dd98-7ae13b43a13b.png)

#### 核心原理

#### 在计算 Attention 时，假如说 32K 长度的 Attention，此时主要的 Attention 是在于 K 的长度（兼容训练和推理），当平均分为 4 份之后，通过 ring 四次，进而得到完整的 attention 内容

#### 性能指标

![性能指标](./imgs/c2631eae-8cfc-4076-eefc-3012236a6d57.png)

#### 可以发现通过 sequence parallel 可以很大程度上减少

### Native Sparse Attention

#### 背景

#### 此前的方法都是属于

### Sparse Attention 相关方法

#### 参考文章

[https://x.com/rasbt/status/2055637086380650538](https://x.com/rasbt/status/2055637086380650538)
