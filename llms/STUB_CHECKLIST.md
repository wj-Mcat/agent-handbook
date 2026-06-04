# LLMs 占位文档补全清单

> **已完成**（2026-06-04）：138 篇占位正文已全部替换为深度笔记。下文保留批次索引供查阅。

## B1 — 预训练数据（5）✅

- [x] `03-pre-training/01-pretraining-data/01-data-sources.md`
- [x] `03-pre-training/01-pretraining-data/02-cleaning-deduplication.md`
- [x] `03-pre-training/01-pretraining-data/03-quality-filtering.md`
- [x] `03-pre-training/01-pretraining-data/04-data-mixture.md`
- [x] `03-pre-training/01-pretraining-data/05-data-licensing.md`

## B2 — 分词 + 预训练目标（11）

- [x] `03-pre-training/02-tokenization/01-tokenization-levels.md`
- [x] `03-pre-training/02-tokenization/02-bpe.md`
- [x] `03-pre-training/02-tokenization/03-wordpiece.md`
- [x] `03-pre-training/02-tokenization/04-sentencepiece-unigram.md`
- [x] `03-pre-training/02-tokenization/05-byte-level-bpe-tiktoken.md`
- [x] `03-pre-training/02-tokenization/06-multilingual-tokenization.md`
- [x] `03-pre-training/03-pretraining-objectives/01-causal-lm.md`
- [x] `03-pre-training/03-pretraining-objectives/02-masked-lm.md`
- [x] `03-pre-training/03-pretraining-objectives/03-prefix-lm-span-corruption.md`
- [x] `03-pre-training/03-pretraining-objectives/04-fim.md`
- [x] `03-pre-training/03-pretraining-objectives/05-multitask-pretraining.md`

## B3 — Scaling + 分布式（12）

- [x] `03-pre-training/04-scaling-laws/01-kaplan-scaling-laws.md`
- [x] `03-pre-training/04-scaling-laws/02-chinchilla-scaling-laws.md`
- [x] `03-pre-training/04-scaling-laws/03-compute-vs-inference-optimal.md`
- [x] `03-pre-training/04-scaling-laws/04-data-parameter-tradeoff.md`
- [x] `03-pre-training/04-scaling-laws/05-emergent-abilities.md`
- [x] `03-pre-training/05-distributed-training/01-data-parallelism.md`
- [x] `03-pre-training/05-distributed-training/02-tensor-parallelism.md`
- [x] `03-pre-training/05-distributed-training/03-pipeline-parallelism.md`
- [x] `03-pre-training/05-distributed-training/04-zero-deepspeed.md`
- [x] `03-pre-training/05-distributed-training/05-three-d-sequence-parallelism.md`
- [x] `03-pre-training/05-distributed-training/06-fsdp.md`
- [x] `03-pre-training/05-distributed-training/07-communication-optimization.md`

## B4 — 训练稳定性（5）

- [x] `03-pre-training/06-training-stability/01-mixed-precision.md`
- [x] `03-pre-training/06-training-stability/02-gradient-accumulation-clipping.md`
- [x] `03-pre-training/06-training-stability/03-checkpointing-recomputation.md`
- [x] `03-pre-training/06-training-stability/04-divergence-diagnosis.md`
- [x] `03-pre-training/06-training-stability/05-loss-spike.md`

## B5 — SFT / 指令 / RLHF（17）

- [x] `04-post-training-alignment/01-sft/01-sft-overview.md`
- [x] `04-post-training-alignment/01-sft/02-data-construction.md`
- [x] `04-post-training-alignment/01-sft/03-quality-quantity-tradeoff.md`
- [x] `04-post-training-alignment/01-sft/04-catastrophic-forgetting.md`
- [x] `04-post-training-alignment/02-instruction-tuning/01-flan-t0-self-instruct.md`
- [x] `04-post-training-alignment/02-instruction-tuning/02-alpaca-vicuna-wizardlm.md`
- [x] `04-post-training-alignment/02-instruction-tuning/03-high-quality-instruction-data.md`
- [x] `04-post-training-alignment/03-rlhf/01-rlhf-pipeline.md`
- [x] `04-post-training-alignment/03-rlhf/02-reward-model.md`
- [x] `04-post-training-alignment/03-rlhf/03-ppo.md`
- [x] `04-post-training-alignment/03-rlhf/04-kl-penalty-stability.md`
- [x] `04-post-training-alignment/03-rlhf/05-rlhf-challenges.md`

## B6 — DPO / CAI / PEFT（13）

- [x] `04-post-training-alignment/04-preference-optimization/01-dpo.md`
- [x] `04-post-training-alignment/04-preference-optimization/02-ipo-kto-orpo-simpo.md`
- [x] `04-post-training-alignment/04-preference-optimization/03-offline-vs-online.md`
- [x] `04-post-training-alignment/04-preference-optimization/04-methods-comparison.md`
- [x] `04-post-training-alignment/05-constitutional-ai-rlaif/01-constitutional-ai.md`
- [x] `04-post-training-alignment/05-constitutional-ai-rlaif/02-rlaif.md`
- [x] `04-post-training-alignment/05-constitutional-ai-rlaif/03-self-improvement-critique.md`
- [x] `04-post-training-alignment/06-peft/01-adapter.md`
- [x] `04-post-training-alignment/06-peft/02-prefix-prompt-p-tuning.md`
- [x] `04-post-training-alignment/06-peft/03-lora-qlora.md`
- [x] `04-post-training-alignment/06-peft/04-dora-lora-plus.md`
- [x] `04-post-training-alignment/06-peft/05-peft-selection-guide.md`

## B7 — 推理部署（23）

见 `rg -l "正文由大纲自动补全生成" llms/05-inference-deployment`

## B8 — 推理能力 + 评估（22）

见 `llms/06-reasoning-test-time-compute` 与 `llms/07-evaluation`

## B9 — 技术报告占位（11）

见 `llms/08-technical-reports`（排除已 rich 的 K2、GLM-4.6、V3.2、gpt-oss）

## B10 — 前沿（18）

见 `llms/09-frontier-future`（排除 `01-mamba-ssm.md`）

## B11 — 附录（7）

见 `llms/10-appendix`
