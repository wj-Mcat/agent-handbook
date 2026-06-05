# gpt-oss（OpenAI 开源权重模型）

> 官方：[Introducing gpt-oss](https://openai.com/index/introducing-gpt-oss/)（2025-08）

## 要解决的问题

OpenAI 在 GPT-2 之后再次发布 **开放权重** 语言模型，供本地/私有云部署、研究与定制，并与 Meta、DeepSeek 等开源路线竞争。

## 双型号

| 型号 | 总参数 | 激活参数 | 部署 |
| --- | --- | --- | --- |
| **gpt-oss-120b** | 117B | 5.1B | 约 **80GB** 显存（MXFP4） |
| **gpt-oss-20b** | 21B | 3.6B | 约 **16GB**，可笔记本 |

## 架构要点

- **MoE** + 交替 **dense / 局部带状稀疏 attention**（类似 GPT-3 风格）
- **GQA**（group size 8）
- **RoPE**，原生 **128K** 上下文
- 权重 **MXFP4** 量化分发（Hugging Face）

## 能力与训练

- 强调 **推理、工具调用、可配置 CoT**
- 训练融合 **RL** 与内部前沿系统（o3 等）经验
- **Apache 2.0** 许可证

:::note 与 API 产品的区别

**gpt-oss 不在 ChatGPT / OpenAI API 中提供**；需自托管或通过 HF、Ollama、vLLM、云厂商镜像使用。

:::

## 生态

- 本地：Ollama、LM Studio、llama.cpp
- 服务：vLLM、Baseten、Azure 等
- 安全：OpenAI 报告额外安全评测与 Preparedness Framework

## 参考链接

- [OpenAI 开放模型页](https://openai.com/open-models/)
- [Help Center：gpt-oss](https://help.openai.com/en/articles/11870455)
- [8.6.5 Mistral](./05-mistral)（同为开放权重路线对比）
