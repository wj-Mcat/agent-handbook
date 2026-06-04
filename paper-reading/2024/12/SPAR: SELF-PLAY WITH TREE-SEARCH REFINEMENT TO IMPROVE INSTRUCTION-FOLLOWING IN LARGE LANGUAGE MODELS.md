---
title: "SPAR: SELF-PLAY WITH TREE-SEARCH REFINEMENT TO IMPROVE INSTRUCTION-FOLLOWING IN LARGE LANGUAGE MODELS"
---

此论文提出了一种名为 SPAR 的 self-play 框架，旨在通过自玩来提高大型语言模型 (LLM) 的指令遵循能力。SPAR 的核心思想是通过树搜索算法对模型生成的响应进行自我优化，从而生成具有最小无关变异的偏好对，突出显示导致指令遵循成功的关键差异。通过迭代训练，SPAR 显著提高了 LLM 在指令遵循任务上的表现，并在多个基准测试中取得了优异的成绩。此外，SPAR 还展示了良好的可扩展性和迁移性，能够有效地提升不同规模模型的指令遵循能力。
