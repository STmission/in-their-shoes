# ADR-0003: Trunk-Based + Conventional Commits + OpenSpec

- Status: Accepted
- Date: 2026-09-25

## Context

需要可持续的协作与变更管理规范，对齐游戏工作室惯例。

## Decision

- 分支：trunk-based，短生命周期 feature 分支，squash merge 进 main。
- 提交：Conventional Commits，commitlint 强制，husky+lint-staged 本地拦截。
- 变更管理：OpenSpec（proposal → specs → design → tasks → apply → archive）。
- 版本：SemVer；CHANGELOG 由 conventional commits 生成（roadmap 接 changesets）。

## Consequences

- +：main 永远可发布；AI/人类协作者通过 OpenSpec 获得一致的变更上下文。
- −：小改动也需走 change 流程——对纯重构/文档允许 `skip_specs`。
