## Context

全新空仓库，无既有代码。目标：单代码库产出 H5 网页 + 微信小程序，单机离线可玩。动机见 proposal.md。

## Goals / Non-Goals

**Goals:**

- 游戏引擎与题库为纯 TypeScript、零平台依赖的 npm workspace 包，UI 层只做渲染与输入。
- 双端构建可复现：`pnpm build:h5` 产静态站点，`pnpm build:weapp` 产小程序包。
- 题库 JSON 内置随包分发，加载时经 schema 校验，坏数据立即失败而非静默错。
- 全部代码、文档、commit 规范对齐国际游戏工作室惯例（GDD/TDD/ADR/Conventional Commits/trunk-based）。

**Non-Goals:**

- 无后端、无账号、无联机对战、无排行榜（roadmap 后续 change）。
- 不做微信小游戏（Canvas 引擎向），本题库玩法用小程序页面承载更合适。
- 不接统计/广告/支付 SDK。

## Decisions

### D1: Taro 4 + React 18 + TypeScript（而非 uni-app 或双端分写）

一套 React 代码编译 H5 与 weapp，京东维护、更新活跃、React 生态可直接复用。备选：uni-app（Vue 栈，团队无 Vue 偏好且 React 生态更利于后续接 Web SDK）；两端分写（UI 代码双份，违背共享目标）。引擎/题库放独立 package，即使未来换掉 Taro 也不伤核心。

### D2: monorepo pnpm workspaces：`packages/core` + `packages/content` + `apps/game`

- `core`：对局状态机（选边→抽题→作答→结算）、计分、评级，纯函数+类，Vitest 覆盖。
- `content`：题库 JSON + zod schema + 加载校验 + 抽题函数。题目内容与代码分离，便于后续运营审校与热更。
- `apps/game`：Taro 应用，仅依赖上述两包。备选：全部塞进 app（违背"引擎可测、内容可换"）。

### D3: 题库内置 JSON 文件，构建期打包

MVP 离线即玩、零网络依赖、小程序免域名白名单配置。代价是更新题目要发版——可接受，热更列入 roadmap。

### D4: 对局状态机用显式 `phase: 'idle' | 'answering' | 'revealed' | 'finished'`

UI 按 phase 渲染，禁止在 UI 层散落布尔标志。计分规则封装在 core，UI 不直接改分。

### D5: 工程规范基线

Conventional Commits + commitlint + husky(commit-msg/pre-commit) + lint-staged(eslint+prettier)；Vitest 测 core/content；GitHub Actions 跑 lint/typecheck/test/build；ADR 记录本文件中的 D1–D4 及后续重大决策。

### D6: 视觉基调

移动端竖屏、性别中性配色（紫粉×蓝的双色对抗视觉但不刻板化）、大按钮单手可达、答对/答错用动效+色彩即时反馈。

## Risks / Trade-offs

- [小程序构建无法在本机完全验证] → CI 做类型检查+构建产物存在性检查；交付文档注明需开发者工具人工验收。
- [Taro 版本与小程序基础库兼容性] → 锁定 Taro 4.x 具体版本，锁文件入库。
- [题库内容易被认为刻板] → 每题解析强制"非标签化"提醒（见 question-bank spec），题目 PR 需内容审校 checklist。
- [双端样式差异] → 使用 Taro 组件库原子组件 + px→rpx 设计稿换算约定（设计稿 375px 宽）。

## Migration Plan

新项目无迁移。首次发布：H5 部署任意静态托管；小程序经开发者工具上传提审。
