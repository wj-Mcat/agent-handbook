import type {TimelineSectionData} from './index';

/** LLM 发展简史时间线数据，供 llms/01-foundations/01-introduction/03-tech-stack-overview 使用 */
export const llmHistoryTimelineSections: TimelineSectionData[] = [
  {
    id: 'prehistory',
    title: '一、史前与奠基期（1950s – 2016）',
    intro:
      '在「语言模型」成为主流之前，语言智能的核心思想和关键技术砖块陆续就位。',
    items: [
      {
        date: '1950',
        title: '图灵发表《计算机器与智能》，提出「图灵测试」',
        description:
          '首次系统地提出「机器能否思考」这一命题，成为后世衡量语言智能的隐喻性标尺',
      },
      {
        date: '1966',
        title: 'Joseph Weizenbaum 开发 ELIZA',
        description:
          '最早的对话程序之一，用模式匹配模拟心理咨询师，展示了人对机器对话的投射心理',
      },
      {
        date: '1980s–1990s',
        title: '统计语言模型（n-gram）兴起',
        description: '用概率建模「下一个词」，成为机器翻译、语音识别的主力方法',
      },
      {
        date: '2003',
        title: 'Bengio 等提出神经概率语言模型',
        description: '首次用神经网络学习词的分布式表示，奠定「词向量」思路',
      },
      {
        date: '2013',
        title: 'Google 发布 word2vec（Mikolov 等）',
        description:
          '高效学习词嵌入，「国王 - 男人 + 女人 ≈ 女王」成为经典示例',
      },
      {
        date: '2014',
        title: 'Seq2Seq（序列到序列）与注意力机制雏形',
        description:
          'Sutskever 等提出编码器-解码器框架；Bahdanau 等引入注意力，解决长序列翻译难题',
      },
    ],
  },
  {
    id: 'transformer-era',
    title: '二、Transformer 与预训练时代（2017 – 2019）',
    intro: '架构与「预训练 + 微调」范式确立，现代 LLM 的技术骨架成型。',
    items: [
      {
        date: '2017.06',
        title: 'Google 发表《Attention Is All You Need》，提出 **Transformer**',
        description:
          '抛弃循环结构，纯靠注意力机制，具备强并行性，成为此后几乎所有大模型的底层架构',
        links: [{label: 'arXiv:1706.03762', href: 'https://arxiv.org/abs/1706.03762'}],
      },
      {
        date: '2018.06',
        title: 'OpenAI 发布 **GPT-1**',
        description: '确立「生成式预训练 + 下游微调」范式，验证无监督预训练的有效性',
      },
      {
        date: '2018.10',
        title: 'Google 发布 **BERT**',
        description: '双向预训练，刷新一众理解类任务榜单，引爆 NLP 的「预训练革命」',
        links: [{label: 'arXiv:1810.04805', href: 'https://arxiv.org/abs/1810.04805'}],
      },
      {
        date: '2019.02',
        title: 'OpenAI 发布 **GPT-2**（15 亿参数）',
        description:
          '因「可能被滥用」而分阶段开源，首次让公众感受到生成文本的逼真度，引发安全讨论',
      },
      {
        date: '2019',
        title: 'T5、RoBERTa、XLNet 等相继问世',
        description: '各类预训练变体百花齐放，推动规模与方法快速迭代',
      },
    ],
  },
  {
    id: 'scaling-era',
    title: '三、规模化时代（2020 – 2022 中）',
    intro: '「大力出奇迹」——参数规模、数据与算力的扩张带来涌现能力。',
    items: [
      {
        date: '2020.01',
        title: 'OpenAI 提出**缩放定律**（Scaling Laws，Kaplan 等）',
        description:
          '给出模型性能随规模、数据、算力变化的经验规律，为「做大」提供理论依据',
        links: [{label: 'arXiv:2001.08361', href: 'https://arxiv.org/abs/2001.08361'}],
      },
      {
        date: '2020.05',
        title: 'OpenAI 发布 **GPT-3**（1750 亿参数）',
        description:
          '「少样本/上下文学习」能力震撼业界，无需微调即可完成多任务，开启大模型时代',
      },
      {
        date: '2021',
        title: 'OpenAI Codex 发布，驱动 GitHub Copilot',
        description: '把代码生成推向实用，开启「AI 编程助手」赛道',
      },
      {
        date: '2022.01',
        title: 'OpenAI 发表 **InstructGPT**，引入 **RLHF**',
        description: '用人类反馈强化学习对齐模型，让模型「听话」且更有用，是 ChatGPT 的直接前身',
      },
      {
        date: '2022.03',
        title: 'DeepMind 发表 **Chinchilla**',
        description:
          '提出「算力最优」训练观点：多数大模型其实训练不足，数据量应与参数同步扩张',
        links: [{label: 'arXiv:2203.15556', href: 'https://arxiv.org/abs/2203.15556'}],
      },
      {
        date: '2022.04',
        title: 'Google 发布 **PaLM**（5400 亿参数）',
        description: '展示规模化下的强推理与思维链（Chain-of-Thought）能力',
      },
    ],
  },
  {
    id: 'chatgpt-era',
    title: '四、ChatGPT 引爆与开源浪潮（2022 末 – 2023）',
    intro:
      '技术走向大众；Meta Llama 点燃全球开源，智谱 GLM、月之暗面 Kimi 等国内团队同步加入基座与长上下文竞赛。',
    items: [
      {
        date: '2022.08',
        title: '智谱 AI / 清华开源 **GLM-130B**',
        description:
          '中英双语千亿级开源基座，验证 GLM 架构在大规模训练上的可行性，为后续 ChatGLM 系列奠基',
        links: [
          {label: 'Tech Report (ICLR 2023)', href: 'https://arxiv.org/abs/2210.02414'},
          {label: 'GitHub', href: 'https://github.com/zai-org/GLM-130B'},
        ],
      },
      {
        date: '2022.11.30',
        title: 'OpenAI 发布 **ChatGPT**',
        description:
          '史上用户增长最快的消费级应用之一，把 LLM 带入主流视野，引发全球 AI 热潮',
      },
      {
        date: '2023.02',
        title: 'Meta 发布 **LLaMA**（权重外泄）',
        description: '高质量开源基座点燃开源社区，催生 Alpaca、Vicuna 等一大批衍生模型',
        links: [{label: 'arXiv:2302.13971', href: 'https://arxiv.org/abs/2302.13971'}],
      },
      {
        date: '2023.02',
        title: '微软推出 New Bing（集成 GPT）',
        description: '搜索引擎与对话式 AI 结合的首次大规模尝试',
      },
      {
        date: '2023.03',
        title: 'OpenAI 发布 **GPT-4**；Anthropic 推出 **Claude**；Google 推出 Bard',
        description: '多模态（图文）能力登场，头部厂商正式进入竞争',
      },
      {
        date: '2023.03.14',
        title: '智谱开源 **ChatGLM-6B**',
        description:
          '62 亿参数中英对话模型，支持消费级显卡 INT4 本地部署，成为中文社区最广泛试用的开源基座之一',
        links: [
          {label: 'GitHub', href: 'https://github.com/THUDM/ChatGLM-6B'},
          {label: 'ChatGLM 家族 Tech Report', href: 'https://arxiv.org/abs/2406.12793'},
        ],
      },
      {
        date: '2023.06.25',
        title: '智谱开源 **ChatGLM2-6B**',
        description:
          '上下文从 2K 扩展到 32K，MMLU / GSM8K 等基准显著提升，推理速度提升约 42%',
        links: [{label: 'GitHub', href: 'https://github.com/THUDM/ChatGLM2-6B'}],
      },
      {
        date: '2023.07',
        title: 'Meta 发布 **Llama 2**（可商用开源）',
        description: '开源可商用许可，极大推动企业级开源部署',
      },
      {
        date: '2023.09',
        title: 'Mistral 发布 **Mistral 7B**',
        description: '小而强的开源模型，后续 Mixtral 把 MoE（专家混合）带向开源主流',
        links: [{label: 'arXiv:2310.06825', href: 'https://arxiv.org/abs/2310.06825'}],
      },
      {
        date: '2023.10',
        title: '月之暗面发布 **Kimi Chat**（Moonshot 长上下文模型）',
        description:
          '国内首个产品化支持约 20 万汉字上下文的对话助手，以长文本理解与检索成为差异化卖点',
        links: [
          {label: 'Kimi', href: 'https://www.moonshot.cn/'},
          {label: 'Moonshot API 文档', href: 'https://platform.moonshot.cn/docs'},
        ],
      },
      {
        date: '2023.10.27',
        title: '智谱开源 **ChatGLM3-6B**',
        description:
          '第三代 6B 对话模型，强化工具调用、代码与多轮对话能力，延续 GLM 中英双语路线',
        links: [{label: 'GitHub', href: 'https://github.com/THUDM/ChatGLM3'}],
      },
      {
        date: '2023.12',
        title: 'Google 发布 **Gemini**',
        description: '原生多模态设计，正式对标 GPT-4',
      },
    ],
  },
  {
    id: 'multimodal-reasoning',
    title: '五、多模态与推理模型（2024）',
    intro:
      '从「会说话」走向「会看、会想」；DeepSeek、GLM、MiniMax 等国内团队密集开源 MoE 与长上下文基座。',
    items: [
      {
        date: '2024.01',
        title: '深度求索开源 **DeepSeek LLM** 与 **DeepSeek-Coder**',
        description:
          '67B 通用模型在代码、数学、中文上对标 Llama2-70B；Coder 系列 1.3B–33B 专攻代码补全与项目级生成',
        links: [
          {label: 'DeepSeek LLM Report', href: 'https://arxiv.org/abs/2401.02954'},
          {label: 'DeepSeek-Coder Report', href: 'https://arxiv.org/abs/2401.14196'},
          {label: 'GitHub', href: 'https://github.com/deepseek-ai/DeepSeek-LLM'},
        ],
      },
      {
        date: '2024.01.16',
        title: '智谱发布 **GLM-4** 与 **GLM-4 All Tools**',
        description:
          '闭源 API 与 All Tools 智能体版本上线，支持 128K 上下文与浏览器、代码解释器等工具编排',
        links: [
          {label: 'ChatGLM 家族 Tech Report', href: 'https://arxiv.org/abs/2406.12793'},
          {label: '智谱开放平台', href: 'https://open.bigmodel.cn/'},
        ],
      },
      {
        date: '2024.01',
        title: 'MiniMax 发布 **abab 6**（国内早期 MoE 基座）',
        description:
          '在 MoE 尚未成为行业共识时即押注稀疏架构，为后续万亿参数 abab 6.5 系列积累工程经验',
        links: [{label: 'MiniMax 新闻', href: 'https://www.minimaxi.com/news'}],
      },
      {
        date: '2024.03',
        title: 'Anthropic 发布 **Claude 3**（Opus/Sonnet/Haiku）',
        description: '分层产品策略，在多项基准上与 GPT-4 正面竞争',
      },
      {
        date: '2024.04.17',
        title: 'MiniMax 发布 **abab 6.5** / **abab 6.5s**',
        description:
          '万亿 MoE 与高效 6.5s 变体，支持 200K 上下文，在 MMLU、数学、编程等评测上接近 GPT-4 / Claude-3 梯队',
        links: [
          {label: '官方发布', href: 'https://www.minimaxi.com/news/%E9%80%9A%E7%94%A8%E5%A4%A7%E6%A8%A1%E5%9E%8Babab65%E7%B3%BB%E5%88%97'},
          {label: 'MiniMax 开放平台', href: 'https://platform.minimaxi.com/'},
        ],
      },
      {
        date: '2024.05',
        title: 'OpenAI 发布 **GPT-4o**（omni）',
        description: '原生多模态、低延迟实时语音交互，体验接近自然对话',
      },
      {
        date: '2024.05',
        title: '深度求索发布 **DeepSeek-V2**',
        description:
          '236B MoE（每 token 激活 21B），MLA 注意力与 DeepSeekMoE 显著降低 KV 缓存与训练成本，128K 上下文',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2405.04434'},
          {label: 'GitHub', href: 'https://github.com/deepseek-ai/DeepSeek-V2'},
        ],
      },
      {
        date: '2024.07',
        title: 'Meta 发布 **Llama 3.1**（含 405B）',
        description: '当时最强开源模型之一，缩小开源与闭源的差距',
      },
      {
        date: '2024.08',
        title: '智谱开源 **GLM-4-9B** 系列（128K / 1M 上下文）',
        description:
          '将 GLM-4 能力下沉至 9B 规模并开放权重，降低本地部署与二次开发门槛',
        links: [
          {label: 'ChatGLM 家族 Tech Report', href: 'https://arxiv.org/abs/2406.12793'},
          {label: 'Hugging Face', href: 'https://huggingface.co/THUDM'},
        ],
      },
      {
        date: '2024.09',
        title: 'OpenAI 发布 **o1**（推理模型）',
        description:
          '引入「推理时计算」（inference-time compute），通过强化学习训练长链思考，开辟推理模型新范式',
      },
      {
        date: '2024.09.05',
        title: '深度求索发布 **DeepSeek-V2.5**',
        description:
          '合并 V2-Chat 与 Coder-V2 能力的一体化开源模型，通用对话与代码任务统一 API',
        links: [
          {label: '发布说明', href: 'https://api-docs.deepseek.com/news/news0905'},
          {label: 'Hugging Face', href: 'https://huggingface.co/deepseek-ai/DeepSeek-V2.5'},
          {label: '架构参考 (V2 Report)', href: 'https://arxiv.org/abs/2405.04434'},
        ],
      },
      {
        date: '2024.12.26',
        title: '深度求索发布 **DeepSeek-V3**',
        description:
          '671B MoE（激活 37B），14.8T token 预训练，开源性能对标顶尖闭源模型，训练稳定性与成本引发全球关注',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2412.19437'},
          {label: 'GitHub', href: 'https://github.com/deepseek-ai/DeepSeek-V3'},
        ],
      },
    ],
  },
  {
    id: 'reasoning-cost-2025',
    title: '六、推理与低成本竞赛（2025）',
    intro:
      '推理能力成为主战场；DeepSeek-R1 / V3.2、Kimi k1.5、GLM-4.5–4.7、MiniMax-M1 等国内模型以技术报告与开源权重改写成本与能力曲线。',
    items: [
      {
        date: '2025.01',
        title: 'MiniMax 开源 **MiniMax-Text-01** / **MiniMax-VL-01**',
        description:
          '456B MoE（激活 45.9B），Lightning Attention 混合架构，训练 1M、推理可扩至 4M token 上下文',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2501.08313'},
          {label: 'GitHub', href: 'https://github.com/MiniMax-AI/MiniMax-01'},
        ],
      },
      {
        date: '2025.01',
        title: '月之暗面发布 **Kimi k1.5**',
        description:
          '多模态 RL 推理模型，128K RL 上下文与 long2short 蒸馏，AIME / MATH-500 等成绩对标 OpenAI o1',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2501.12599'},
          {label: 'GitHub', href: 'https://github.com/MoonshotAI/Kimi-k1.5'},
        ],
      },
      {
        date: '2025.01.20',
        title: '深度求索发布 **DeepSeek-R1** / **DeepSeek-R1-Zero**',
        description:
          '纯 RL 与多阶段冷启动 + RL 两套推理路线开源，蒸馏 1.5B–70B 系列；训练成本远低于西方对手，打破「美国独大」叙事',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2501.12948'},
          {label: 'GitHub', href: 'https://github.com/deepseek-ai/DeepSeek-R1'},
        ],
      },
      {
        date: '2025.02',
        title: 'OpenAI 发布 **GPT-4.5**（代号 Orion）',
        description: '主打更自然的对话，被官方定位为非「前沿」模型',
      },
      {
        date: '2025.03',
        title: 'Google 发布 **Gemini 2.5 Pro**',
        description: '百万级上下文窗口，登顶多项榜单',
      },
      {
        date: '2025.06',
        title: 'MiniMax 开源 **MiniMax-M1**',
        description:
          '全球首个开源大规模混合注意力推理模型，Lightning Attention + MoE，面向长上下文 Agent 与代码任务',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2506.13585'},
          {label: 'GitHub', href: 'https://github.com/MiniMax-AI/MiniMax-M1'},
        ],
      },
      {
        date: '2025.08',
        title: '智谱开源 **GLM-4.5** / **GLM-4.5-Air**',
        description:
          '355B MoE（激活 32B）ARC 基座，支持思考/非思考双模式，Agent、推理与编码统一评测领先开源梯队',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2508.06471'},
          {label: 'GitHub', href: 'https://github.com/zai-org/GLM-4.5'},
        ],
      },
      {
        date: '2025.08.07',
        title: 'OpenAI 发布 **GPT-5**',
        description:
          '统一多模态模型，内置实时路由（自动在标准/思考/Pro 模式间切换），40 万 token 上下文，免费用户亦可使用核心能力',
      },
      {
        date: '2025.09.30',
        title: '智谱开源 **GLM-4.6**',
        description:
          'GLM-4.5 后继：上下文扩至 200K、推理时工具调用与 Agent 能力增强，MIT 许可权重公开',
        links: [
          {label: '官方博客', href: 'https://z.ai/blog/glm-4.6'},
          {label: 'Hugging Face', href: 'https://huggingface.co/zai-org/GLM-4.6'},
          {label: '架构参考 (GLM-4.5 Report)', href: 'https://arxiv.org/abs/2508.06471'},
        ],
      },
      {
        date: '2025.10',
        title: 'MiniMax 开源 **MiniMax-M2**',
        description:
          '230B MoE（激活 10B）面向编码与 Agent 工作流，强调工具调用可靠性与高性价比推理',
        links: [
          {label: 'GitHub', href: 'https://github.com/MiniMax-AI/MiniMax-M2'},
          {label: 'Hugging Face', href: 'https://huggingface.co/MiniMaxAI/MiniMax-M2'},
        ],
      },
      {
        date: '2025.12.01',
        title: '深度求索发布 **DeepSeek-V3.2** / **DeepSeek-V3.2-Speciale**',
        description:
          '引入 DSA 稀疏注意力与大规模 Agent 任务合成；标准版对标 GPT-5，Speciale 在 IMO/IOI 等奥赛获金牌级成绩',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2512.02556'},
          {label: 'Hugging Face', href: 'https://huggingface.co/deepseek-ai/DeepSeek-V3.2'},
          {label: '发布说明', href: 'https://api-docs.deepseek.com/news/news251201'},
        ],
      },
      {
        date: '2025.12.22',
        title: '智谱开源 **GLM-4.7**',
        description:
          '355B MoE 编程专精迭代：SWE-bench、Terminal Bench 与多文件 Agent 编码显著提升，支持「先思考再行动」',
        links: [
          {label: '官方博客', href: 'https://z.ai/blog/glm-4.7'},
          {label: 'Hugging Face', href: 'https://huggingface.co/zai-org/GLM-4.7'},
          {label: 'GitHub (GLM 系列)', href: 'https://github.com/zai-org/GLM-4.5'},
        ],
      },
      {
        date: '2025',
        title: '推理模型在国际数学奥林匹克（IMO）等竞赛取得金牌级表现',
        description: 'DeepMind、OpenAI 的推理模型展示出接近顶尖人类的数学能力',
      },
      {
        date: '2025 下半年',
        title: 'Gemini 3、Grok 4.1、Claude Opus 4.5、GPT-5.1/5.2 等密集发布',
        description:
          '「智能体（Agentic AI）」成为年度核心战场，模型从助手走向能自主执行多步任务的工具',
      },
    ],
  },
  {
    id: 'multipolar-2026',
    title: '七、多极竞争格局（2026）',
    intro:
      '不再有单一「最强模型」，各家在不同赛道分别领先；智谱 **GLM-5** 与深度求索 **DeepSeek-V4** 将百万级上下文与 Agent 工程推上新台阶。',
    items: [
      {
        date: '2026.02.05',
        title: 'Anthropic 发布 **Claude Opus 4.6**；OpenAI 同日发布 **GPT-5.3-Codex**',
        description: '编码与智能体能力成为竞争焦点，两家同日交锋',
      },
      {
        date: '2026.02.11',
        title: '智谱开源 **GLM-5**',
        description:
          '744B MoE（激活 40B），28.5T token 预训练；采用 DSA 与异步 RL 基础设施 Slime，面向长程 Agent 与端到端软件工程（Agentic Engineering）',
        links: [
          {label: 'Tech Report', href: 'https://arxiv.org/abs/2602.15763'},
          {label: 'GitHub', href: 'https://github.com/zai-org/GLM-5'},
          {label: 'Hugging Face', href: 'https://huggingface.co/zai-org/GLM-5'},
        ],
      },
      {
        date: '2026.02',
        title: 'Anthropic 发布 **Sonnet 4.6**；Google 发布 **Gemini 3.1 Pro**（预览）',
        description:
          '14 天内三家四款前沿模型集中亮相，榜单首次「分车道」，不再有全能冠军',
      },
      {
        date: '2026.03',
        title: 'OpenAI 发布 **GPT-5.4**',
        description: '持续围绕工具调用可靠性、长上下文、智能体稳定性迭代',
      },
      {
        date: '2026.04.23',
        title:
          'OpenAI 发布 **GPT-5.5**；Anthropic 发布 **Claude Opus 4.7**；Google 推进 **Gemini 3.1 Pro**',
        description:
          '三家旗舰数周内集中发布：GPT 强于智能体/研究，Claude 领先软件工程，Gemini 主打性价比与多模态',
      },
      {
        date: '2026.04.24',
        title: '深度求索预览发布 **DeepSeek-V4-Pro** / **DeepSeek-V4-Flash**',
        description:
          '1.6T Pro（激活 49B）与 284B Flash（激活 13B）均支持 **100 万 token** 上下文；混合压缩/稀疏注意力（CSA+DSA）、mHC 与 Muon 优化，面向 Agent 长程推理',
        links: [
          {label: 'Tech Report (PDF)', href: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf'},
          {label: '发布说明', href: 'https://api-docs.deepseek.com/news/news260424'},
          {label: 'Hugging Face 合集', href: 'https://huggingface.co/collections/deepseek-ai/deepseek-v4'},
          {label: 'DeepSeek-V4-Pro', href: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro'},
          {label: 'DeepSeek-V4-Flash', href: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash'},
        ],
      },
      {
        date: '2026.05.19',
        title: 'Google I/O 发布 **Gemini 3.5 Flash**，并预告 **Gemini 3.5 Pro**（6 月 GA）',
        description: '新一代家族登场，Pro 目标 200 万 token 上下文与 Deep Think 推理',
      },
      {
        date: '2026.05.28',
        title: 'Anthropic 发布 **Claude Opus 4.8**',
        description: '截至本文更新时的最新前沿模型之一',
      },
    ],
  },
];
