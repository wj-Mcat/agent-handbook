---
slug: on-policy-vs-off-policy
---

# On-Policy vs Off-Policy RL

经典 RL 里另一组常被混淆的概念：**更新目标策略时，经验是否必须来自「当前正在评估/改进的那条策略」**？本节厘清 **on-policy / off-policy** 的定义、代表算法（SARSA、Q-learning）与重要性采样，并映射到 LLM 后训练；与上一节 [4.4.3 离线 vs 在线](./03-offline-vs-online) 正交——后者问的是 **训练期是否继续与环境交互**，本节问的是 **行为策略 $\pi_b$ 与目标策略 $\pi_\theta$ 是否一致**。

---

## 1. 策略（Policy）与探索–利用

**策略** $\pi$ 是从状态 $s$（或 prompt $x$）到动作 $a$（或 token / 回复 $y$）的决策规则。智能体目标是在长期折扣回报下学到更优的 $\pi$。

**探索（Exploration）**：尝试未知动作以收集信息；**利用（Exploitation）**：按当前认知选最优动作以拿即时奖励。$\epsilon$-greedy、熵 bonus、温度采样等都是在二者间折中——无论 on-policy 还是 off-policy，都需要这一平衡，但两种范式对「用哪条策略产生的数据来更新」约束不同。

---

## 2. On-Policy：向当前策略学习

**On-policy（同策略）** 方法评估并改进的，就是 **智能体当下正在执行的那条策略**（含探索噪声）。数据分布与 **行为策略** = **目标策略** 对齐；策略一变，旧轨迹的统计意义就变弱，样本利用率通常较低，但 **信用分配** 更直白。

直观类比（[GeeksforGeeks](https://www.geeksforgeeks.org/machine-learning/on-policy-vs-off-policy-methods-reinforcement-learning/)）：自己学骑车——摔过的每一次都算在你 **当前这套骑法** 上，而不是看别人骑完再假装那是你的动作。

### 2.1 SARSA（典型 on-policy TD）

**SARSA**（State–Action–Reward–State–Action）用 **实际执行的下一步动作** $a_{t+1}$ 做 bootstrap：

$$
Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha \Big[ r_{t+1} + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t,a_t) \Big]
$$

其中 $a_{t+1}$ 由 **当前行为策略**（如 $\epsilon$-greedy 于当前 $Q$）采样，因此更新的是 **「含探索」的 policy 的 value**，与正在跑的 agent 一致。

| 符号 | 含义 |
| --- | --- |
| $Q(s,a)$ | 在策略 $\pi$ 下、从 $(s,a)$ 出发的期望回报 |
| $\alpha$ | 学习率 |
| $\gamma$ | 折扣因子 |
| $a_{t+1}$ | **真实会执行的** 下一动作，非 $\arg\max$ 假想动作 |

### 2.2 其他 on-policy 代表

| 方法 | 说明 |
| --- | --- |
| **蒙特卡洛 on-policy** | 整条 episode 回报，只沿当前策略轨迹 |
| **A2C / A3C** | 同步/异步 actor–critic， critic 估 $V$，actor 按当前 $\pi_\theta$ 采样 |
| **PPO** | 裁剪 surrogate，要求 **新策略贴近 rollout 时的旧策略**（信任域），本质 on-policy |
| **TRPO** | 显式 KL 约束的 on-policy 策略梯度 |

---

## 3. Off-Policy：向目标策略学习，数据可来自别处

**Off-policy（异策略）** 方法用 **行为策略** $\pi_b$ 采集的数据，去估计或改进 **目标策略** $\pi$（常取最优或部署策略）。可以「看别人骑」：日志来自旧版模型、人类示范或更激进的探索策略，而优化对象仍是当前的 $\pi_\theta$。

### 3.1 Q-Learning（典型 off-policy TD）

**Q-learning** 在更新时用 **下一状态上的最大 Q**（隐含 greedy 目标策略），与 **实际采样的** $a_{t+1}$ 可以不一致：

$$
Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha \Big[ r_{t+1} + \gamma \max_a Q(s_{t+1}, a) - Q(s_t,a_t) \Big]
$$

行为上仍可用 $\epsilon$-greedy 探索，但 bootstrap 的是 **最优动作价值**，故为 off-policy。

### 3.2 重要性采样（Importance Sampling）

当必须用 $\pi_b$ 的数据训练 $\pi$ 时，需对分布 mismatch 做校正。轨迹层面的重要性权重：

$$
\rho_{0:T-1} = \prod_{t=0}^{T-1} \frac{\pi(a_t|s_t)}{\pi_b(a_t|s_t)}
$$

实践中常 **截断 / 归一化** $\rho$ 以控方差（PPO 的 ratio clipping、离线 RL 的 conservative Q 等都可看作相关思想）。没有校正时，off-policy 估计会 **有偏或方差爆炸**。

### 3.3 其他 off-policy 代表

| 方法 | 说明 |
| --- | --- |
| **DQN + Replay** | 行为用 $\epsilon$-greedy，目标网络估 $\max_a Q$ |
| **DDPG / TD3 / SAC** | 确定性/随机 actor 与 replay，目标策略与行为策略分离 |
| **离线 RL（CQL、IQL 等）** | 仅用固定日志，$\pi_b$ 常为历史策略 |
| **行为克隆（BC）** | 人类轨迹 $\pi_{\text{human}}$ → 学 $\pi_\theta$，典型 off-policy |

---

## 4. On-Policy vs Off-Policy：对比

| 维度 | On-Policy | Off-Policy |
| --- | --- | --- |
| **数据与目标策略** | 一致（含探索版） | 可不一致；$\pi_b \neq \pi_\theta$ |
| **样本效率** | 通常较低，旧数据易「过期」 | 可复用 replay、历史日志 |
| **实现与方差** | 相对直接；PPO 用 clip/KL 稳 ratio | 需 IS 或保守目标；离线场景要防 OOD |
| **典型算法** | SARSA、PPO、A2C | Q-learning、DQN、DPO（见下） |
| **探索–利用** | 探索 **计入** 被评估策略 | 可用更猛的 $\pi_b$ 探索，目标仍 greedy / $\pi_\theta$ |
| **安全 / 部署** | 训练分布≈部署分布（若探索适中） | 易利用 **更好示范**；也易 **分布偏移** |

```mermaid
flowchart TB
  subgraph on["On-Policy"]
    O1["当前策略 π_θ 与环境交互"] --> O2["用同一策略产生的轨迹更新 π_θ"]
  end
  subgraph off["Off-Policy"]
    F1["行为策略 π_b 产生数据"] --> F2["目标策略 π_θ 从数据中学习"]
    F2 -.->|"π_b 可 ≠ π_θ"| F1
  end
```

### SARSA vs Q-Learning：更新差异一览

| | SARSA（on-policy） | Q-Learning（off-policy） |
| --- | --- | --- |
| **Bootstrap** | $Q(s_{t+1}, a_{t+1})$，$a_{t+1}$ 按当前策略采 | $\max_a Q(s_{t+1}, a)$ |
| **估计对象** | 当前 **含探索** 策略的价值 | **最优** 动作价值 |
| **数据复用** | 差（策略一变轨迹失效） | 好（replay 常见） |

---

## 5. 与「离线 vs 在线」的关系

两维 **正交**，可组合成四种常见形态（[4.4.3](./03-offline-vs-online) 详述离线/在线）：

| | **On-Policy** | **Off-Policy** |
| --- | --- | --- |
| **Online** | PPO-RLHF：当前 $\pi_\theta$ rollout → 立即 PPO 更新 | 在线 DPO 变体：用 **旧** 偏好数据训 **新** $\pi_\theta$（若数据未刷新则偏 off-policy） |
| **Offline** | 少见严格定义；若日志即 $\pi_\theta$ 且只训该分布一次 | **DPO / IPO**：固定 $(x,y_w,y_l)$，$\pi_b$ 为标注时的模型 |

要点：

- **Online + On-Policy**：数据新鲜且与当前策略一致 → PPO、OPD、GRPO 类。
- **Offline + Off-Policy**：固定偏好集、行为策略为旧模型 → 标准 DPO；存在 **分布偏移**（[4.4.3](./03-offline-vs-online) 中的反事实查询）。
- 称某方法「在线 DPO」时，若在每轮用 **当前** $\pi_\theta$ 生成并 **立即** 标注再更新，更接近 **online + on-policy 数据**；若仍用旧标注训新模型，则 **online 采集、off-policy 学习**。

---

## 6. 在 LLM 偏好学习中的映射

| 范式 | LLM 中的对应 | 行为策略 $\pi_b$ | 目标 $\pi_\theta$ |
| --- | --- | --- | --- |
| **On-policy** | PPO-RLHF、在线 RM、OPD、GRPO | 当前学生 rollout | 同一 $\pi_\theta$（PPO 用旧 snapshot 作 ratio 分母） |
| **Off-policy** | 静态偏好集上的 DPO / IPO / ORPO | 标注时的 SFT / 旧 checkpoint | 正在微调的 $\pi_\theta$ |
| **Off-policy + 教师** | 经典 KD：教师生成轨迹，学生 SFT | 教师 $\pi_T$ | 学生 $\pi_\theta$ |
| **On-policy + 教师** | [OPD](../03-rlhf/06-on-policy-distillation)：学生 rollout，教师给 token 监督 | 学生 **当前** 状态上的 $\pi_\theta$ | 仍优化 $\pi_\theta$，但监督来自 $\pi_T$ |

**DPO** 在固定数据集上优化 $\pi_\theta$，而偏好对往往由 **$\pi_{\text{ref}}$ 或更早模型** 参与构造 → 典型的 **off-policy 偏好学习**；迭代刷新偏好对可减轻偏移，见 [4.4.1 DPO](./01-dpo)、[4.4.3](./03-offline-vs-online)。

**PPO-RLHF** 要求 rollout 来自 **当前策略族**（经 clip/KL 约束），是 LLM 对齐里最常见的 **on-policy** 管线，见 [4.3.3 PPO](../03-rlhf/03-ppo)。

---

## 7. 选型提示

| 场景 | 倾向 |
| --- | --- |
| 只有一批人类偏好、算力有限 | **Off-policy** 离线 DPO / IPO |
| 需要持续对齐部署分布、有 RM + 推理集群 | **On-policy** PPO / 在线 RL |
| 有强教师、怕 exposure bias | **On-policy** OPD，而非纯 off-policy KD |
| 日志来自很旧的 $\pi_b$，且不能重标 | 警惕 off-policy **OOD**；补数据或保守正则（IPO、$\beta$ 调节） |

**监控**：若 reward / DPO loss 改善但 **针对新 prompt 的人评** 下降，可能是 off-policy 偏移或 off-policy 数据上的 **过拟合历史 $\pi_b$**；若 PPO KL 飙升，则是 on-policy 更新步长过大。

---

## 8. 极简代码对照（FrozenLake）

以下摘录自 [GeeksforGeeks 教程](https://www.geeksforgeeks.org/machine-learning/on-policy-vs-off-policy-methods-reinforcement-learning/) 的核心更新逻辑（省略环境与作图）：

```python
# SARSA：bootstrap 实际执行的 next_action
Q[s, a] += alpha * (r + gamma * Q[new_s, new_a] - Q[s, a])

# Q-Learning：bootstrap 下一状态的最大 Q
Q[s, a] += alpha * (r + gamma * np.max(Q[new_s, :]) - Q[s, a])
```

---

## 参考文章

- [GeeksforGeeks — On-policy vs Off-policy methods in RL](https://www.geeksforgeeks.org/machine-learning/on-policy-vs-off-policy-methods-reinforcement-learning/)
- [HF Deep RL Course — Offline vs. Online](https://huggingface.co/learn/deep-rl-course/unitbonus3/offline-online)（与 on/off-policy 不同维）
- Sutton & Barto, *Reinforcement Learning: An Introduction*（第 5–6 章：TD、on/off-policy）
- 本库：[4.4.3 离线 vs 在线偏好学习](./03-offline-vs-online) · [4.4.5 方法对比](./04-methods-comparison) · [4.3.6 OPD](../03-rlhf/06-on-policy-distillation)
