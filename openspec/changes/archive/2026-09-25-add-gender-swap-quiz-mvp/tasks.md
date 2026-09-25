## 1. 工程基线与文档

- [x] 1.1 创建 pnpm monorepo 骨架（root package.json、pnpm-workspace.yaml、.gitignore、.editorconfig），`pnpm install` 成功
- [x] 1.2 编写 docs/gdd.md（游戏设计文档：玩法、循环、计分、称号表、内容基调准则），文档存在且覆盖 GDD 标准章节
- [x] 1.3 编写 docs/tdd.md（技术设计文档：架构图、包边界、状态机、构建管线），与设计决策 D1–D6 一致
- [x] 1.4 编写 docs/adr/0001-taro-react-monorepo.md 等 ADR，记录 D1–D4 决策
- [x] 1.5 编写 docs/prototype.md（原型设计：页面线框、设计 token、交互流程）与 docs/roadmap.md
- [x] 1.6 编写 CONTRIBUTING.md（Conventional Commits、分支模型、PR checklist、Definition of Done、代码评审规范）
- [x] 1.7 配置 ESLint + Prettier + husky + commitlint + lint-staged，`git commit` 触发校验可运行
- [x] 1.8 添加 .github/workflows/ci.yml：lint + typecheck + test + build，yaml 语法有效

## 2. packages/content 题库

- [x] 2.1 定义题目 zod schema 与 TS 类型，`pnpm -F @game/content test` 校验通过
- [x] 2.2 编写内置题库 ≥24 题（for-male/for-female 各 ≥10），每题含解析与可选 funFact，schema 校验通过
- [x] 2.3 实现抽题函数（随机、不重复、不足兜底、排除上局题），单元测试覆盖三个场景

## 3. packages/core 游戏引擎

- [x] 3.1 实现对局状态机（idle→answering→revealed→finished）与阵营开局逻辑，`pnpm -F @game/core test` 通过
- [x] 3.2 实现共情指数计分（100 基础分 + 连对加成封顶 +50）与评级称号映射，单元测试覆盖 spec 全部场景
- [x] 3.3 实现"再来一局"不重复上局题目逻辑，单元测试通过

## 4. apps/game Taro 应用

- [x] 4.1 脚手架 Taro 4 + React + TS 应用并入 workspace，`pnpm -F game typecheck` 通过
- [x] 4.2 实现首页（标题、阵营选择、开始按钮），移动端竖屏布局
- [x] 4.3 实现对局页（进度条、场景卡、选项、即时对错反馈、解析展示、连对提示）
- [x] 4.4 实现结果页（共情指数、称号、答对统计、再来一局、分享入口按平台降级）
- [x] 4.5 接入 core/content 包，完整游玩闭环可用

## 5. 验证与交付

- [x] 5.1 `pnpm build:h5` 产出 dist 静态站点，浏览器打开可完整游玩
- [x] 5.2 `pnpm build:weapp` 产出小程序 dist 目录（供开发者工具导入）
- [x] 5.3 全部 lint/typecheck/test/build 通过，git 按 Conventional Commits 完成首次提交
