# Engineering

## husky + lint-staged + gitleaks and CI

本地 pre-commit gitleaks git --staged —— 只扫这次提交的暂存改动, 能被：git commit --no-verify 绕过

CI gitleaks git（默认）—— 扫整个 git 历史的所有 commit
