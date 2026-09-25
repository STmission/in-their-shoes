# ADR-0001: 采用 Taro 4 + React + pnpm monorepo 实现双端

- Status: Accepted
- Date: 2026-09-25
- Deciders: Devin (与用户确认)

## Context

需要一套代码同时交付 H5 网页版与微信小程序版；题库玩法无复杂渲染需求；后续可能扩展更多端（抖音/APP）。

## Decision

1. **Taro 4 + React 18 + TypeScript**：单代码库编译 H5/weapp。
2. **pnpm workspaces monorepo**：`apps/game` + `packages/core` + `packages/content`。
3. **游戏引擎纯 TS 独立成包**：UI 可替换，逻辑可测。

## Alternatives Considered

| 方案                  | 放弃原因                                            |
| --------------------- | --------------------------------------------------- |
| uni-app + Vue         | 无 Vue 技术栈偏好；React 生态更利于后续接入 Web SDK |
| 双端分写（Vite+原生） | UI 代码两份，题库玩法迭代需双端同步，维护成本翻倍   |
| 微信小游戏（Cocos）   | Canvas 引擎对问答 UI 是杀鸡用牛刀；提审类目更复杂   |
| Remax / 其他          | 社区活跃度低于 Taro                                 |

## Consequences

- +：业务代码零重复；core/content 可独立单测。
- −：Taro 升级需全量回归双端；@tarojs/* 必须锁同版本。
- −：样式/组件受 Taro 跨端子集约束，不能用任意 DOM API。
