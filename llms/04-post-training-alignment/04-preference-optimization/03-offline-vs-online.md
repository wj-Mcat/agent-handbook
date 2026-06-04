# 4.4.3 离线 vs 在线偏好学习

## 要解决的问题

**离线** 偏好学习在固定数据集上更新策略（DPO、IPO 等）；**在线** 方法让当前策略 **自己采样** 回复，再经人类或 AI 评判后更新（PPO-RLHF、在线 DPO、迭代 RM）。二者在 **数据新鲜度、成本、稳定性** 上权衡不同，影响对齐飞轮设计。

## 核心概念

| 维度 | 离线（Offline） | 在线（Online） |
| --- | --- | --- |
| **数据** | 静态 $(x,y_w,y_l)$ | 每轮用 $\pi_\theta$ rollout 新 $y$ |
| **分布** | 行为策略 $\pi_b$ 可能 ≠ $\pi_\theta$ | 缓解 OOD，但方差大 |
| **成本** | 标注一次可多次训 | 每轮需 RM/人评，算力高 |
| **代表** | DPO、IPO、ORPO | PPO-RLHF、RLAIF 迭代 |

**Off-policy 误差**：离线数据由旧策略或人工生成，当前策略访问的状态未覆盖，易导致 **过拟合历史偏好** 或 **低估新回复**。

## 方法 / 在线与离线谱系

```mermaid
flowchart LR
  off[离线 DPO/IPO]
  hyb[混合: 定期重采样标注]
  on[在线 PPO / 在线偏好]
  off --> hyb --> on
```

### 纯离线

- 固定 HH-RLHF、UltraFeedback 等训练 1–3 epoch。
- 优点：可复现、易并行；缺点：策略改进后 **数据滞后**。

### 混合（工业常见，个人理解）

1. 离线 DPO 打底。
2. 部署收集 **隐式偏好**（编辑、重试、点赞）。
3. 周期性 **重训** 或 **小步在线** 更新。
4. 可选 **拒绝采样** 生成新 $y_w,y_l$ 扩充集。

### 纯在线

- PPO：每 batch rollout → RM 打分 → 更新（[4.3.3](../03-rlhf/03-ppo)）。
- **RLAIF**：AI 标注替代人（[4.5.2](../05-constitutional-ai-rlaif/02-rlaif)）。
- **Online DPO / SPIN / self-play** 类：用当前模型生成对手数据再 DPO（研究活跃，稳定性待验证）。

## 工程实践

| 场景 | 建议 |
| --- | --- |
| **初创/开源** | 离线 DPO + 强 SFT 通常性价比最高 |
| **有流量产品** | 混合：日志脱敏 → 偏好标注 → 周级重训 |
| **安全关键** | 在线需 **人工审核** 新偏好，防用户诱导有害偏好 |
| **监控** | 离线：train loss vs held-out win-rate；在线：KL、reward、毒性 |

算力：在线 RL 需 **推理集群** 常驻；离线主要训练算力。

## 代表工作

- RLHF 在线范式：Ouyang et al., 2022。
- **RLAIF**（Lee et al., 2023）：AI 反馈在线扩数据。
- **Self-Play fine-tuning** 等：[领读](/paper-reading/agentic/self-play-finetune)（Agent 向，思想相通）。

## 局限与注意点

- 在线 **反馈循环** 可能放大偏见（只服务活跃用户群体）。
- 离线数据 **泄漏** 进 benchmark 会高估离线方法。
- 「在线更好」非定理：弱 RM 在线会 **更快 hack**（[4.3.5](../03-rlhf/05-rlhf-challenges)）。

## 数据新鲜度指标

| 信号 | 解读 |
| --- | --- |
| 部署后用户 rewrite 率上升 | 静态偏好数据可能过时，考虑增量 DPO |
| 新功能 prompt 集 win-rate 低 | 需定向增补数据，非盲目加 $\beta$ |
| 在线 RL reward 涨、人评跌 | 典型 hacking，暂停在线阶段 |

## 合规与日志

- 在线学习从用户日志构造偏好时，遵守 **脱敏、知情同意、退出训练** 选项（地区法规各异）。
- 保留 **数据血缘**：哪版策略生成了哪些 $y$，便于审计与回滚。

## 相关章节

- [4.4.1 DPO](./01-dpo)
- [4.3.1 RLHF](../03-rlhf/01-rlhf-pipeline)
- [4.5.2 RLAIF](../05-constitutional-ai-rlaif/02-rlaif)
- [4.4.4 方法对比](./04-methods-comparison)
