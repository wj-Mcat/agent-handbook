# 人类评估（Chatbot Arena / LMSYS）

## 要解决的问题

自动指标与真实用户满意度存在差距。**人类评估**（众包、专家、产品内反馈）是黄金标准，但成本高、一致性差。LMSYS **Chatbot Arena** 用匿名 pairwise 投票 + Elo 排名，成为开源社区最引用的「人类偏好」参考，亦暴露统计与博弈问题。

## 核心概念

| 方式 | 描述 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **Pairwise 偏好** | 二选一谁更好 | 比绝对分可靠 | 需大样本 |
| **Elo / Bradley-Terry** | 从成对结果估强度 | 动态排行榜 | 新模型方差大 |
| **Likert 量表** | 1–5 分多维 | 细粒度 | 标尺漂移 |
| **专家评** | 安全、医学 | 高可信 | 难扩展 |

**Elo 更新**（胜者 $A$，期望 $E_A$）：

$$
R_A' = R_A + K(S_A - E_A), \quad E_A = \frac{1}{1+10^{(R_B-R_A)/400}}
$$

$S_A \in \{1, 0.5, 0\}$。

```mermaid
flowchart LR
  user[用户] --> blind[匿名 A vs B]
  blind --> vote[投票]
  vote --> elo[Elo 更新]
  elo --> lb[公开排行榜]
```

## 方法 / Arena 机制要点

1. **盲测**：用户不知模型身份，减品牌偏见。
2. **采样**：从真实用户 prompt 分布抽取，非仅考试题。
3. **去重**：防刷票、IP 异常检测（平台持续演进）。
4. **与基准关系**：Arena 高 ≠ MMLU 高；能力维度不同（[7.1.1](../01-benchmarks/01-general-benchmarks)）。

## 工程实践

- 产品内 **thumbs up/down** 积累私有人类偏好，用于 DPO（[4.4.1 DPO](../../04-post-training-alignment/04-preference-optimization/01-dpo)）。
- 众包需 **指南 + 质控**（黄金题、一致性不足 80% 剔除）。
- 报告样本量：Elo 95% CI 随 battles 增加收窄。

## 代表工作

- Chiang et al., Chatbot Arena（LMSYS）
- Boubdir et al., 评委偏见分析；Anthropic 人类反馈实践

## 实践检查清单

- [ ] 固定评测/推理配置（温度、max_tokens、parser 版本）便于回归
- [ ] 记录硬件：GPU 型号、驱动、框架 commit
- [ ] 对比基线：未优化前 TTFT/TPOT 或 Acc
- [ ] 文档化失败案例：OOM、解析失败率、拒答率
- [ ] 交叉阅读本章「相关章节」避免孤立优化


## 局限与注意点

- **非代表用户**：技术社区偏好 ≠ 全球用户。
- 英语主导；中文 Arena（如部分国内榜）规则不同，不可横向比。
- 模型 **拒答** 策略影响「有用性」投票（安全对齐第四部分）。



## 术语对照（中英）

本节英文关键词：**Chatbot Arena / LMSYS**（与社区论文、API 文档检索一致）。

## 延伸阅读

- 本仓库 [LLMs 入口](/llms/intro) 可回溯全局大纲；修改单点优化前建议先读上下游章节链接。
- 技术报告精读见 `llms/08-technical-reports/` 与 [paper-reading](/paper-reading/) 专栏。
- 工程复现优先锁定：框架版本 + 量化格式 + 评测 harness commit，三者缺一即难以对齐论文数字。

## 相关章节

- 同章：[7.2.2 Judge](./02-llm-as-judge) · [7.2.4 污染](./04-reliability-contamination)
- 偏好优化：[4.4 偏好优化](../../04-post-training-alignment/04-preference-optimization/01-dpo)
- 中文：[7.1.3](../01-benchmarks/03-multilingual-chinese-benchmarks)
