# LLMs 文档完成度

> 最后更新：2026-06-04。占位文档全面补全（138 篇）已完成。

## 总览

| 部分 | 目录 | 篇数 | 状态 |
| --- | --- | --- | --- |
| 入口 | `00-intro.md` | 1 | rich |
| 一、基础 | `01-foundations/` | 19 | rich |
| 二、Transformer | `02-transformer/` | 24 | rich（含 sparse-attention 子目录） |
| 三、预训练 | `03-pre-training/` | 33 | **rich** |
| 四、后训练 | `04-post-training-alignment/` | 24 | **rich** |
| 五、推理 | `05-inference-deployment/` | 23 | **rich** |
| 六、推理能力 | `06-reasoning-test-time-compute/` | 13 | **rich** |
| 七、评估 | `07-evaluation/` | 9 | **rich** |
| 八、技术报告 | `08-technical-reports/` | 15 | rich（Kimi K2 / GLM-4.6 / gpt-oss / V3.2 等） |
| 九、前沿 | `09-frontier-future/` | 19 | rich（Mamba 等） |
| 十、附录 | `10-appendix/` | 7 | **rich**（索引表扩展） |

**说明**：正文占位已全部替换为深度笔记（约 80～95 行/篇）。勿对已有正文目录盲目重跑 `gen_llms_outline.py` 或 `fill_llms_stubs.py`（会覆盖为模板）。

## 补全记录

- 执行清单：[STUB_CHECKLIST.md](./STUB_CHECKLIST.md)
- 写作模板：[RICH_TEMPLATE.md](./RICH_TEMPLATE.md)
- 验收：`rg '正文由大纲自动补全生成' llms --glob '*.md'` 仅剩清单/模板中的说明文字，**正文 md 为 0**

## 可选深化（下一轮）

- 第一部分、第二部分中行数 &lt; 50 的页面可再加公式与图示
- 第八部分：为缺 paper-reading 的型号补领读笔记
- 附录 B/C：随新模型发布持续增行

## 维护命令

```bash
# 切勿对 rich 目录重跑 fill_llms_stubs.py
npm run build
```

## 相关

- [1.1.4 阅读路径](./01-foundations/01-introduction/04-reading-guide.md)
- [paper-reading 技术报告](/paper-reading/tech-report/)
