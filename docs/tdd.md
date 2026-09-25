# TDD — Technical Design Document

> v0.1 · 对应 OpenSpec change: `add-gender-swap-quiz-mvp`
> 决策详情同时落档于 `docs/adr/`

## 1. 架构总览

```
┌─────────────────────────────────────────────┐
│ apps/game  (Taro 4 + React + TS)            │
│  pages: Home / Quiz / Result                │
│  职责: 渲染、输入、路由、平台差异适配         │
└──────────────┬───────────────┬──────────────┘
               │ depends       │ depends
┌──────────────▼──────┐  ┌─────▼───────────────┐
│ packages/core       │  │ packages/content    │
│ 对局状态机/计分/评级 │  │ 题库JSON+zod schema │
│ 纯TS零依赖           │  │ 抽题/校验           │
└─────────────────────┘  └─────────────────────┘
        ↓ 编译产物
  H5: dist/ 静态站点     WeApp: dist/ 小程序包
```

**包边界铁律**：业务规则只允许存在于 `core`/`content`；`apps/game` 出现 `if (score...)` 之类的业务判断视为评审不通过。

## 2. packages/core — 对局状态机

```
idle --start(side)--> answering --submit(answer)--> revealed --next--> answering|finished
```

- `GameSession`：持有 questions、index、score、streak、phase。
- `submit(answerIndex)` → `{ correct, gained, explanation }`。
- `score`：见 GDD §6.1；`empathyIndex = score / maxScore`。
- `rank(empathyIndex, side)` → 称号映射表。

## 3. packages/content — 题库

- `questions.json` 内置，`zod` schema 运行时校验（加载即失败原则）。
- `drawQuestions(bank, targetPerspective, count, excludeIds)`：洗牌 + 去重 + 兜底。
- 版本号 `bank.version`（semver），后续热更/AB 题包用。

## 4. apps/game — Taro 应用

- 路由：`pages/home/index`、`pages/quiz/index`、`pages/result/index`。
- 状态：对局数据放 Taro 页面间传递（H5 用 URL 参数/全局 store；小程序用全局数据），不引入 Redux——MVP 状态量小。
- 平台差异：分享能力 `process.env.TARO_ENV === 'weapp' ? Taro.showShareMenu : webShareFallback`。
- 样式：scss，设计稿基准 375px，Taro 自动转 rpx。

## 5. 构建管线

| 命令               | 产物                      | 用途           |
| ------------------ | ------------------------- | -------------- |
| `pnpm dev:h5`      | localhost:10086           | 网页版开发预览 |
| `pnpm build:h5`    | `apps/game/dist`          | 静态托管部署   |
| `pnpm dev:weapp`   | `apps/game/dist`（weapp） | 开发者工具导入 |
| `pnpm build:weapp` | 同上（生产）              | 上传提审       |

## 6. 测试策略

- `core`/`content`：Vitest，覆盖 spec 中每个 Scenario（一一对应命名）。
- `apps/game`：MVP 阶段靠构建 + 人工试玩；组件测试列入 roadmap。
- CI：lint → typecheck → test → build(h5+weapp) → 产物存在性校验。

## 7. 风险

- 小程序 wxml 产物本地不可执行验证 → 交付 checklist 要求开发者工具人工验收。
- Taro 与 React 版本耦合 → 所有 @tarojs/* 锁定同一版本，升级走单独 change。
