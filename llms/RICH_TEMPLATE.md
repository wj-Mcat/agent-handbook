# LLMs 深度文档写作模板

每篇替换占位正文时遵循以下结构（目标 **80～150 行**）。

## 必备章节

1. **要解决的问题** — 工程/研究痛点，1～2 段
2. **核心概念** — 表格或 KaTeX 公式
3. **方法 / 算法 / 架构** — 分步、对比表、mermaid（可选）
4. **工程实践** — 工具、成本、可观测指标
5. **代表工作** — arXiv / 官方链接；优先链到本仓库 `paper-reading`、`docs`
6. **局限与注意点**
7. **相关章节** — 同章前后节相对路径

## 禁止保留

- `:::note 持续更新` 与「正文由大纲自动补全生成」
- 与标题无关的通用 filler（「明确输入输出」「小规模验证后扩展」等套话）

## 标杆页面

| 类型 | 路径 |
| --- | --- |
| 概念 | `01-foundations/01-introduction/01-what-is-llm.md` |
| 公式/架构 | `02-transformer/03-transformer-improvements/06-sparse-attention/04-deepseek-sparse-route.md` |
| 技术报告 | `08-technical-reports/04-kimi/02-kimi-k2.md` |

## 检查项

- [ ] H1 保留章节编号（如 `# 3.2.2 BPE`）
- [ ] 至少 1 个对比表或公式块
- [ ] 交叉链接使用相对路径
- [ ] 推测性结论标注「待验证」或「个人理解」
- [ ] 第八部分技术报告：文末 `:::tip` 指向 paper-reading 领读
