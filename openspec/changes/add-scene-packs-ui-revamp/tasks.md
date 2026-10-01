## 1. content 场景化改造

- [x] 1.1 schema：categoryId 扩为 9 类（chat/date/emotion/money/life/social/private/screen/future）+ categories 元数据 + 引用校验，单测过
- [x] 1.2 questions.json：72 题（9 场景 × 双向各 ≥4），含暧昧信号/影视解读/现实议题且尺度优雅，schema 校验过
- [x] 1.3 drawQuestions 加 category 过滤参数，测试更新过

## 2. core 适配

- [x] 2.1 GameSession.start 改 options 签名支持 category，暴露场景信息，测试更新过

## 3. apps/game 结构与视觉（霓虹派对 Neon Party）

- [x] 3.1 app.scss：霓虹派对 token 体系（深紫底/radial 光斑/渐变发光/深色玻璃卡）+ 按钮/弹层/卡片基础样式（全双端安全 CSS）
- [x] 3.2 app.config.ts 改 tabBar（大厅/好友/我的）+ 页面注册
- [x] 3.3 大厅页：品牌头 + 随机全场景卡 + 9 场景撞色大卡 + 阵营选择底部弹层（带分身预览）
- [x] 3.4 答题页：场景徽标 + 条纹进度条 + 分身/精灵舞台（答对跳/答错受击）+ 解析 + 自动连跳 + 计算过场
- [x] 3.5 结果页：深紫底 + 称号逐字弹入发光 + 共情指数渐变环 + 分身精灵庆祝 + 分享 sheet + 再来一局
- [x] 3.6 好友页：好友码/邀请提示/好友列表/搜索/按码添加，全部标注演示数据
- [x] 3.7 我的页：角色卡 + 换装间（分身 4 + 精灵 6 双池选择，持久化）+ 测试记录 + 署名/免责说明

## 3.5 皮肤系统

- [x] 3.8 素材入库：Pixel Frog 帧表 ×4 最近邻放大（16 张）+ ShadowPets GIF（18 个）+ docs/CREDITS.md 署名
- [x] 3.9 PixelSprite（裁剪容器+条带 translateX steps 双端一致）+ PetSprite（GIF）组件 + skins.ts 注册表/持久化

## 4. 验证与交付

- [x] 4.1 lint/typecheck/test 全绿；build:h5、build:weapp 成功；H5 预览走查三 tab 全流程
- [ ] 4.2 同步 docs/gdd.md（场景表/内容准则/新玩法流程/皮肤系统）与 docs/prototype.md（贴纸杂志规范）
- [ ] 4.3 Conventional Commits 分批提交 + openspec archive
