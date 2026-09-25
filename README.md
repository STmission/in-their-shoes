# 《TA 的世界》In Their Shoes

> 一款让男女生换位思考的娱乐问答游戏：男生答女生的处境，女生答男生的处境。不比输赢，比"共情指数"。

**双端**：H5 网页版 + 微信小程序版，一套 Taro 代码编译两端。

## 快速开始

```bash
pnpm install
pnpm dev:h5        # 浏览器试玩
pnpm dev:weapp     # 微信开发者工具导入 apps/game/dist
```

## 仓库结构

```
apps/game        Taro 4 应用（页面/UI/双端构建）
packages/core    游戏引擎：对局状态机、共情计分、评级（纯 TS，平台无关）
packages/content 题库：JSON 内容包 + schema 校验 + 抽题
docs/            GDD / TDD / 原型设计 / ADR / Roadmap
openspec/        OpenSpec 规范与变更管理
```

## 文档索引

| 文档                                   | 说明                        |
| -------------------------------------- | --------------------------- |
| [docs/gdd.md](docs/gdd.md)             | 游戏设计文档                |
| [docs/tdd.md](docs/tdd.md)             | 技术设计文档                |
| [docs/prototype.md](docs/prototype.md) | 原型设计（线框/设计 token） |
| [docs/roadmap.md](docs/roadmap.md)     | 迭代路线                    |
| [docs/adr/](docs/adr/)                 | 架构决策记录                |
| [CONTRIBUTING.md](CONTRIBUTING.md)     | 提交与协作规范              |

## 常用命令

| 命令               | 作用                     |
| ------------------ | ------------------------ |
| `pnpm dev:h5`      | H5 开发预览              |
| `pnpm dev:weapp`   | 小程序开发产物（watch）  |
| `pnpm build:h5`    | 构建网页版静态站点       |
| `pnpm build:weapp` | 构建微信小程序包         |
| `pnpm test`        | 单元测试（core/content） |
| `pnpm lint`        | ESLint                   |
| `pnpm openspec`    | OpenSpec CLI             |
