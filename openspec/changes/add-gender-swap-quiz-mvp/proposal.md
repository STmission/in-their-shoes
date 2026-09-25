# Proposal: add-gender-swap-quiz-mvp

## Why

性别话题容易滑向对立与争吵，但"换位思考"是能真正促进理解的方式。我们想做一款轻量娱乐游戏《TA 的世界》（In Their Shoes）：让男生回答女生的典型处境、女生回答男生的典型处境，用"共情指数"替代输赢对抗，把性别差异从"互相指责"变成"互相理解"。目标平台为 H5 网页版与微信小程序版，一套代码双端发布，最低成本验证玩法。

## What Changes

- 新增跨端游戏工程：Taro 4 + React + TypeScript 单代码库，编译产物同时覆盖 H5 网页与微信小程序。
- 新增题库能力：场景化问答题库，按"目标视角"分向（给男生的处境题由女生答、给女生的处境题由男生答），含答案解析与平权小知识，JSON 内容包带 schema 校验与版本号。
- 新增游戏会话能力：单机 MVP 玩法"灵魂互换赛"——选边（男生视角队/女生视角队）→ 逐题作答 → 即时解析 → 结算页给出"共情指数"评级与称号。
- 新增计分与结果体系：答对计共情分，连对有加成；结果页产出可分享的评级称号（如"读心大师/懂王/直男探测器"等正向幽默称号）。
- 新增工程规范基线：Conventional Commits + commitlint + husky + lint-staged、ESLint/Prettier、Vitest 单元测试、GitHub Actions CI、ADR 决策记录、GDD/TDD 文档（对齐国际游戏大厂文档规范）。

## Capabilities

### New Capabilities

- `question-bank`: 题库内容模型与加载校验。场景题按 targetPerspective（male/female/neutral）分类，包含场景描述、选项、参考答案、解析、平权小贴士；支持版本化与按局抽题。
- `game-session`: 单机对局生命周期。选边 → 抽题 → 作答 → 即时反馈 → 结算；共情指数计分规则、连对加成、结果评级称号。
- `dual-platform-shell`: 双端应用外壳。Taro 应用骨架、页面路由（首页/对局/结果）、双端条件编译差异处理、H5 与微信小程序构建产物。

### Modified Capabilities

（无 — 项目为全新仓库，无既有 spec。）

## Impact

- 新增 monorepo：`apps/game`（Taro 应用）、`packages/core`（纯 TS 游戏引擎，平台无关）、`packages/content`（题库 JSON + schema）。
- 新增文档：`docs/gdd.md`、`docs/tdd.md`、`docs/prototype.md`、`docs/adr/`、`CONTRIBUTING.md`、`docs/roadmap.md`。
- 新增工具链依赖：Taro 4、React 18、TypeScript、Vitest、ESLint、Prettier、husky、commitlint。
- 暂不含后端：MVP 题库随包离线分发；联机对战、账号、排行榜列入 roadmap 后续 change。
- 风险：微信小程序真机表现需开发者工具验证（本地无法编译验证 wxml 产物，CI 只做类型与构建检查）。
