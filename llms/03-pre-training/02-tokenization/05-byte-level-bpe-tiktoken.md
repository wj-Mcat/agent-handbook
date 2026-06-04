# 3.2.5 Byte-level BPE 与 Tiktoken

## 要解决的问题

Unicode 字符集极大，纯字符 BPE 仍可能遇到罕见码点；**字节级**词表固定为 256（或 512 含扩展），任意 UTF-8 文本均可分解为字节序列再合并，彻底消除 UNK。OpenAI GPT-2/3/4 与 Claude 等商用栈广泛采用；`tiktoken` 提供高性能 Rust 实现。

## 核心概念

流程：

1. UTF-8 文本 → 字节序列 $b_1,\ldots,b_L$，$b_i \in \{0,\ldots,255\}$；
2. 在字节对上运行 BPE merges，得到子词 token；
3. 可选 **regex 预切分**（GPT-2 模式）：先按模式切分再对每段做 BPE。

词表大小 $V$ 通常含 256 字节 token + merges 产物 + 特殊 token。

| 实现 | 特点 |
| --- | --- |
| **tiktoken** | OpenAI 维护，编码极快，与 GPT-4 兼容 |
| **HF tokenizers** | `ByteLevel` + `BPE`，生态广 |

平均每 token 字节数（英文）：

$$
\text{BPT} = \frac{\text{UTF-8 bytes}}{\text{\#tokens}}
$$

BPT 越低，同样上下文窗口可塞入更多字符。

## 方法/算法

GPT-2 风格 pretokenization 正则（概念上）将文本分为字母块、数字、空白等，再对每块独立 BPE，避免跨类别错误合并。

训练与 [3.2.2 BPE](./02-bpe.md) 相同，仅初始 alphabet 为字节。

编码复杂度：$O(L \cdot \log V)$ 量级，tiktoken 用 Rust 表查找优化至接近线性实践吞吐。

## 工程实践

- **安装**：`pip install tiktoken`；`tiktoken.get_encoding("cl100k_base")` 等对应 GPT-3.5/4。
- **自定义**：`tiktoken.Encoding` 从 `mergeable_ranks` 字典构建，需与训练 merges 完全一致。
- **与推理**：vLLM、OpenAI API 假设特定 encoding；混用 encoding 会导致乱码或长度超限。
- **成本**：同样 8k 上下文，cl100k 通常比旧 GPT-2 编码 token 数更少（模型计费相关）。

## 代表工作

- Radford et al. GPT-2 技术报告：https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf
- Brown et al. GPT-3：https://arxiv.org/abs/2005.14165
- tiktoken：https://github.com/openai/tiktoken

## 局限与注意点

- **可读性差**：单个「字符」可能对应多字节 token，调试生成结果更困难。
- **中文效率**：字节 BPE 对 CJK 往往 1～3 字节/token，序列仍长于专用中文词表（见 [3.2.6](./06-multilingual-tokenization.md)）。
- **安全**：字节级可编码任意二进制模式，需内容过滤仍在文本层完成。
- **版本锁定**：`o200k_base` 等新 encoding 与旧模型不兼容。


## 延伸说明
生产环境锁定 `cl100k_base` / `o200k_base` 等名称，API 与训练不一致会长度超限。
## 实践检查清单
- [ ] 256 字节
- [ ] regex
- [ ] BPT

## 小结

本节核心：256 字节 与全链路 regex 协同；上线前用检查清单做回归。


## 常见 encoding 对照

| 名称 | 关联模型 |
| --- | --- |
| `r50k_base` | GPT-3 早期 |
| `p50k_base` | Codex 部分 |
| `cl100k_base` | GPT-3.5/4 类 |
| `o200k_base` | 较新 OpenAI 模型 |

切换 encoding 会导致同字符串 token 数不同，**上下文窗口计费**随之变化。

## 相关章节

- 上一节：[3.2.4 SentencePiece](./04-sentencepiece-unigram.md)
- 下一节：[3.2.6 多语言](./06-multilingual-tokenization.md)
- BPE 基础：[3.2.2](./02-bpe.md)
- CLM：[3.3.1](../03-pretraining-objectives/01-causal-lm.md)
