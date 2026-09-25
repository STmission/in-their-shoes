# ADR-0002: 题库以 JSON 内置随包分发

- Status: Accepted
- Date: 2026-09-25

## Context

MVP 需要题库。可选：内置 JSON / 远程 CMS / 微信云开发数据库。

## Decision

题库为 `packages/content` 中的 JSON 文件，构建期打包进两端产物；加载时经 zod schema 校验；带 semver 版本号。

## Alternatives Considered

- 远程 CMS：需要后端与域名白名单（小程序），MVP 成本过高。
- 微信云开发：H5 端无法使用，破坏双端一致性。

## Consequences

- +：零网络依赖，离线可玩，免小程序域名配置。
- −：更新题目需发版。缓解：roadmap 预留 `bank.version` 热更通道，届时走独立 OpenSpec change。
