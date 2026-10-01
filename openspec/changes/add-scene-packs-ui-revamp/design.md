## Context

MVP 已交付（24 题平铺抽取 + 基础暗色 UI）。用户选定外部"极光玻璃 Aurora Glass"原型为视觉与交互基准（大厅/好友/我的 tab + 动效体系），并要求题库扩量且覆盖暧昧/影视/现实议题。见 proposal.md。

## Goals / Non-Goals

**Goals:**

- 题库：9 场景 × 双向各 ≥4 题 = 72 题；含 private（暧昧信号）、screen（影视名场面解读）、future（房车/孩子/工作/生活方式）三类开放议题，尺度优雅。
- 结构：tabBar（大厅/好友/我的）+ 答题/结果导航页；大厅渐变场景大卡；阵营选择为底部弹层。
- 动效：aurora 光斑漂移、按压 spring 缩放、进度条 shimmer、选中自动连跳、计算过场、称号字符弹入、底部 sheet + toast。
- 双端安全 CSS：禁用 backdrop-filter/filter:blur（weapp 不支持），用半透明实色 + box-shadow 降级。

**Non-Goals:**

- 好友/我的为本地演示数据（明确标注），不接后端、不做真实匹配计算。
- 皮肤系统本次纳入范围（分身+精灵双池，详见 D7）。
- 不引入 UI 组件库。

## Decisions

### D1: 视觉改用霓虹派对风（用户从三套原型中选定，后改为本方案）

用户先选定 mag 贴纸杂志，体验后认为其与玩法内容不匹配，改选 **party 霓虹派对**：深紫底 #0A0812、radial-gradient 环境光斑（#4f7cff/#ff6b9d/#7c5cff）、半透明深色卡、蓝→紫→粉霓虹渐变主按钮 + 发光描边、答对绿光/答错红光。结构与交互仍沿用参考原型（tab 架构、弹层、揭示动画），仅视觉皮肤替换；所有效果均为双端安全 CSS（无 backdrop-filter/filter:blur 依赖）。

### D7: 皮肤系统（用户确认：阵营绑定 + 皮肤商店都要）

- **分身池**（Pixel Frog Pixel Adventure，CC0）：4 像素小人 Pink Man/Virtual Guy/Mask Dude/Ninja Frog；男生默认 Pink Man、女生默认 Ninja Frog，我的页可换。帧动画四态：idle(11f)/run(12f)/jump(6f)/hit(7f)，32×32 帧表离线 ×4 最近邻放大（保证 weapp 无 image-rendering 时仍清晰）；渲染用「裁剪容器 + Image 条带 translateX steps()」——wxss 支持 transform keyframes，双端一致。
- **精灵池**（ShadowPets，CC-BY 4.0）：6 只像素宠物 idle/bounce/greet 用 GIF `<Image>` 直接播（H5/weapp 均支持动图）；署名写入 docs/CREDITS.md。
- **联动**：答题答对=分身 jump + 精灵 bounce；答错=分身 hit + 精灵 greet；皮肤选择存 Taro storage（tg_skin_v1）。

### D2: category 一级字段 + bank.categories 元数据（9 类）

同前次设计，categoryIdSchema 扩为 9 值；`question.category` 经 superRefine 校验。

### D3: tabBar 用 Taro 原生 app.config tabBar（无 icon 图片，纯文字+emoji 前置）

weapp tabBar 的 iconPath 可选，省略即为纯文字 tab；H5 由 Taro 渲染一致。页面：pages/lobby、friends、mine（tab）+ pages/quiz、result（导航页），analyze 作为 quiz 内部过渡视图而非独立路由。

### D4: 好友/我的数据层

`friends` 页用内置演示数据 + 本地生成的 6 位好友码（存 Taro storage）；`mine` 页记录从 gameStore 写入 Taro.setStorageSync 的历史结果数组。全部标注"演示数据"。

### D5: `GameSession.start` 改 options 签名 + category

`start({side, category, count, bank, excludeIds, rng})`；category 为空即全场景。

### D6: 动效双端策略

keyframes/transition/transform/opacity/linear-gradient 双端通用；`backdrop-filter` 与 `filter:blur` 仅 H5 端通过运行时 env class 附加，weapp 下卡片用 rgba(255,255,255,.8) 实色，光斑用低透明度纯色圆。

## Risks / Trade-offs

- [72 题单文件体积] → 约 40KB JSON，双端打包无压力；后续分包/热更走 roadmap。
- [暧昧/隐私题审核风险] → 尺度限定"行为信号解读"，每题解析含"不代表所有人"；无露骨词。
- [weapp 动效降级观感] → 交付 checklist 要求真机走查光斑/卡片可读性。
- [好友演示数据误导] → 页面硬性标注"演示数据"，添加入口 toast 提示。

## Migration Plan

`GameSession.start` 签名变更同步更新 store.ts 与全部测试；题库旧题仅新增 category 字段，id 不变。
