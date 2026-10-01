# Proposal: add-scene-packs-ui-revamp

## Why

试玩反馈两点：题目平铺直抽太单一、缺乏"选场景专场测"的仪式感；UI 粗糙缺乏游戏感。用户指定参照外部原型（极光玻璃 Aurora Glass 风格）的大厅/好友/我的 tab 结构与动效；内容上要更开放、含暧昧隐私话题、影视名场面与现实议题（房车/孩子/工作/生活质量/娱乐）。

## What Changes

- 题库场景化：9 大场景——chat 聊天密语 / date 约会现场 / emotion 情绪时刻 / money 消费观念 / life 生活日常 / social 社交习惯 / private 暧昧心事 / screen 荧幕情感 / future 未来蓝图；每题归属一个场景，双向各场景 ≥4 题，题库扩至 72 题。
- 内容基调扩展：允许暧昧期信号、隐私边界、影视引用（《请回答1988》《前任3》《三十而已》等）与现实议题；仍须遵守内容准则（幽默不冒犯、解析温柔、非标签化），暧昧题只做信号解读不做露骨描述。
- 应用结构改为 tab 架构：大厅（首页，场景大卡入口）/ 好友 / 我的 三个 tab + 答题、结果导航页。
- 大厅：品牌头 + 渐变场景大卡（随机全场景 + 9 专场）+ 阵营选择（开局弹层）。
- 好友 tab（原型态，本地演示数据）：好友码、邀请提示、好友列表与匹配度展示、按码添加。
- 我的 tab：角色卡入口、进行中/已完成的测试记录（本地存储）。
- 答题页升级：场景徽标、流光进度条、选完自动下一题（短延迟）、即时对错+解析。
- 结果页升级：深色渐变页 + 称号字母逐个弹入揭示动画 + 共情指数 + 分享卡弹层。
- UI 采用霓虹派对风（Neon Party，用户经三套原型稿对比后改选）：深紫底 + 环境光斑 + 蓝粉紫渐变发光元素；结构与动效沿用参考原型的 tab 架构（大厅/好友/我的）与交互模式。
- 新增角色皮肤系统：双池——「分身」像素小人（Pixel Frog Pixel Adventure，CC0）与「陪测精灵」像素宠物（ShadowPets，CC-BY 4.0，需署名）；阵营默认皮肤 + 我的页换装商店；答题对错时角色即时动作反馈。

## Capabilities

### New Capabilities

（无 — 均为既有能力的需求修改。）

### Modified Capabilities

- `question-bank`: 题目模型加 `category` 字段；场景分类元数据扩展至 9 类并含内容基调要求；抽题支持场景过滤。
- `game-session`: 开局需选定阵营与场景范围；对局内题目统一场景（全场除外）。
- `dual-platform-shell`: 页面结构改为 tab 架构（大厅/好友/我的）+ 答题/结果页；大厅含场景大卡与阵营弹层；好友与我的页为本地演示数据；答题自动连跳；结果揭示动画；霓虹派对视觉规范；角色皮肤系统。

## Impact

- `packages/content`: schema 加 category 枚举（9 类）与场景元数据；questions.json 扩至 72 题。
- `packages/core`: `GameSession.start` 改 options 对象签名支持 category。
- `apps/game`: 重构为 tabBar 应用（pages/lobby、friends、mine + quiz、result、analyze）；新增阵营选择弹层与分享弹层；全部页面样式重写。
- 测试同步更新；docs/gdd.md、docs/prototype.md 需同步；原型稿 prototypes/ 已产出三套方向作废，以参考原型为准。
