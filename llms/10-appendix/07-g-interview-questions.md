# 附录 G　常见面试题与思考题

面向 **算法、训练、推理、应用** 岗位。答案要点指向大纲章节，面试时应结合 **项目经历** 展开。

## 基础与 Transformer

1. **自回归 LM 损失如何写？与 MLM 有何区别？**  
   → [1.1.1](../01-foundations/01-introduction/01-what-is-llm)、[3.3.1](../03-pre-training/03-pretraining-objectives/01-causal-lm)

2. **Scaled dot-product 为何要除以 $\sqrt{d_h}$？**  
   → [2.1.2](../02-transformer/01-transformer-principles/02-scaled-dot-product-attention)

3. **RoPE 相对位置编码的核心思想？**  
   → [2.1.4](../02-transformer/01-transformer-principles/04-positional-encoding)

4. **GQA 相比 MHA 省什么？**  
   → KV 头数减少，推理省显存。

## 预训练与 Scaling

5. **Chinchilla 法则对数据/参数配比的建议？**  
   → [3.4.2](../03-pre-training/04-scaling-laws/02-chinchilla-scaling-laws)

6. **MoE 负载均衡为何重要？DeepSeek 无 aux-loss 怎么做？**  
   → [8.1.1](../08-technical-reports/01-deepseek/01-deepseek-v3)

7. **BPE 与 WordPiece 差异？**  
   → [3.2](../03-pre-training/02-tokenization/)

## 对齐

8. **RLHF 三阶段 pipeline？**  
   → [4.3.1](../04-post-training-alignment/03-rlhf/01-rlhf-pipeline)

9. **DPO 相对 PPO 的优缺点？**  
   → [4.4.1](../04-post-training-alignment/04-preference-optimization/01-dpo)

10. **灾难性遗忘如何缓解？**  
    → replay、LoRA、[4.1.4](../04-post-training-alignment/01-sft/04-catastrophic-forgetting)

## 推理与系统

11. **KV cache 显存如何估算？**  
    → [5.2.1](../05-inference-deployment/02-kv-cache-attention-optimization/01-kv-cache)、[附录 A](./01-a-math-notation)

12. **PagedAttention 解决什么问题？**  
    → [5.2.2](../05-inference-deployment/02-kv-cache-attention-optimization/02-paged-attention)

13. **投机解码成立条件？**  
    → 草稿与目标分布接近，[5.5.1](../05-inference-deployment/05-accelerated-decoding/01-speculative-decoding)

14. **INT4 量化为何可能掉点？**  
    → [5.3](../05-inference-deployment/03-quantization/)

## 推理与 Agent

15. **GRPO 与 PPO 的关键区别？**  
    → 无 critic，组内基线，[6.3.1](../06-reasoning-test-time-compute/03-rl-reasoning/01-grpo-rloo)

16. **测试时 compute 与训练 scaling 关系？**  
    → 正交杠杆，[6.2.5](../06-reasoning-test-time-compute/02-test-time-compute/05-inference-scaling-laws)

17. **RAG 何时优于微调？**  
    → 知识更新频、可解释检索、`docs`

## 评估与前沿

18. **基准污染如何检测？**  
    → [7.2.4](../07-evaluation/02-evaluation-methods/04-reliability-contamination)

19. **Needle 测试局限？**  
    → [9.1.3](../09-frontier-future/01-long-context/03-needle-in-haystack)

20. **LLM 幻觉根因与缓解？**  
    → 生成式目标、工具验证、RAG，[9.4.1](../09-frontier-future/04-toward-agi/01-capability-boundaries)

## 系统设计题（白板）

21. **设计一个日活百万的 Chat API**：模型服务、限流、缓存、评测回归。  
    → [5.6](../05-inference-deployment/06-inference-serving/)

22. **如何在 8×A100 上微调 70B？**  
    → QLoRA、FSDP、DeepSpeed ZeRO，[4.6.3](../04-post-training-alignment/06-peft/03-lora-qlora)

23. **Agent 调用工具失败如何重试？**  
    → 状态机、指数退避、人工升级，`docs` Agent

## 思考题（无标准答案）

24. 开源权重是否 **加速** 或 **阻碍** AGI 安全？  
    → [9.4.3](../09-frontier-future/04-toward-agi/03-recursive-self-improvement)

25. 五年后主导架构仍是 Transformer 吗？  
    → [9.3](../09-frontier-future/03-new-architectures/)

## 相关章节

- 术语：[附录 B](./02-b-glossary)
- 模型表：[附录 C](./03-c-model-comparison)
- 从业者建议：[9.5.2](../09-frontier-future/05-conclusion/02-advice-practitioners)
