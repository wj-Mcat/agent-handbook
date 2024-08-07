---
title: "Text Grad: 基于文本的自动微分"
---

## Abstract

在Agent时代中，编写Prompt 是一个**非常不稳定**和**枯燥**的事情。

不稳定在于：你需要针对于具体业务测试、优化并评估整个Prompt，这条链路非常长，而且


.DEFAULT_GOAL = dev
files_to_format_and_lint = business_agent_scripts
           
.PHONY: dev
dev: format lint type-check
           
           
.PHONY: format
format:    
    python3 -m black $(files_to_format_and_lint)
    python3 -m isort $(files_to_format_and_lint)
           
.PHONY: lint
lint:      
    python3 -m flake8 $(files_to_format_and_lint) --ignore E402,W503,E203
    python3 -m isort --check-only --diff $(files_to_format_and_lint)
    python3 -m black --check --diff $(files_to_format_and_lint)
    python3 -m pylint --disable all --enable=C0114,C0115,C0116 $(files_to_format_and_lint)