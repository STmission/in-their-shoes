# Contributing Guide

对齐国际游戏工作室（Supercell / Riot / Epic 风格）的协作规范：小而快的变更、明确的 Ownership、每个 PR 可独立交付价值。

## 分支模型：Trunk-Based Development

- `main` 是唯一长期分支，永远保持可发布状态（green build）。
- 所有工作通过短生命周期的 feature 分支完成：`feat/<scope>-<slug>`、`fix/<slug>`、`content/<slug>`、`docs/<slug>`。
- 分支存活时间目标 < 3 天；做不完就拆任务，不堆大 PR。
- 禁止直接在 `main` 上提交（CI + branch protection 强制）。

## Commit 规范：Conventional Commits

格式：`type(scope): subject`（英文 subject，祈使句，≤72 字符）

| type                          | 用途                 | 示例                                       |
| ----------------------------- | -------------------- | ------------------------------------------ |
| `feat`                        | 新功能/新玩法        | `feat(session): add streak bonus scoring`  |
| `fix`                         | 缺陷修复             | `fix(quiz): prevent double-tap on options` |
| `content`                     | 题库/文案内容变更    | `content(bank): add 6 for-male scenarios`  |
| `refactor`                    | 不改变行为的重构     | `refactor(core): extract scoring module`   |
| `perf`                        | 性能优化             | `perf(h5): lazy-load result page`          |
| `docs`                        | 文档                 | `docs(gdd): clarify empathy index formula` |
| `test`                        | 测试                 | `test(core): cover streak reset scenario`  |
| `style`                       | 格式（不改逻辑）     | `style: run prettier`                      |
| `build`/`ci`/`chore`/`revert` | 构建、CI、杂项、回滚 | `ci: cache pnpm store`                     |

scope 建议使用包/领域名：`core`、`content`、`game`、`h5`、`weapp`、`session`、`quiz`、`gdd`、`ci` 等。

- 一个 commit 只做一件事；不合规的 commit message 会被 commitlint 拒绝。
- PR 合并采用 **Squash Merge**，合并后的 commit 即上述规范格式。

## Pull Request 规范

每个 PR 必须包含：

1. **标题**：Conventional Commits 格式（squash 后沿用）。
2. **Summary**：变更动机与内容（why > what）。
3. **Test Plan**：勾选项清单，说明如何验证（命令/步骤/截图）。
4. **Spec 关联**：行为变更必须关联 OpenSpec change（`openspec/changes/<name>`）。

### Code Review Checklist（评审人逐项过）

- [ ] 符合 spec（`openspec/specs`）或有对应 change delta
- [ ] 逻辑在 `packages/core`/`content`，UI 层无业务规则泄漏
- [ ] 新行为有测试；`pnpm test` / `lint` / `typecheck` / `build` 全绿
- [ ] 题库 PR 额外检查：内容基调准则（见 `docs/gdd.md` §内容准则）
- [ ] 无 console.log/调试残留、无密钥/凭据

## Definition of Done

一个任务只有全部满足才算完成：

- 代码合入 main 且 CI 绿
- spec 场景有对应测试或人工验证记录
- 文档（GDD/TDD/ADR）同步更新
- OpenSpec change 的 tasks 勾选完毕，走完 archive 流程

## 本地开发

```bash
pnpm install
pnpm dev:h5        # H5 开发预览 http://localhost:10086
pnpm dev:weapp     # 小程序开发产物，微信开发者工具导入 apps/game/dist
pnpm test && pnpm lint && pnpm typecheck
```

首次提交前请运行 `pnpm prepare`（husky install）一次。

## 规范工作流：OpenSpec

- 新能力/行为变更：先创建 change（proposal + specs + design + tasks），再实现，最后 archive。
- 命令：`pnpm openspec list / status / validate`。
- AI Agent 工作流：`/openspec-propose` → `/openspec-apply-change` → `/openspec-archive-change`。
