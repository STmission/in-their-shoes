## Purpose

题库是游戏的核心内容资产：以"场景 + 选项 + 参考答案 + 解析 + 平权小贴士"的结构承载换位思考玩法，并按目标视角分类、可版本化、可校验，供双端离线使用。

## ADDED Requirements

### Requirement: 题目数据模型

每道题目 SHALL 包含：唯一 id、目标视角分类（`for-male` / `for-female`，即"男生答 / 女生答"）、场景描述、2-4 个选项、参考答案下标、解析文案，以及可选的平权小贴士（funFact）。题库 SHALL 携带语义化版本号。

#### Scenario: 题目结构完整

- **WHEN** 题库被加载或校验
- **THEN** 每道题必须具备 id、targetPerspective、scenario、options、answerIndex、explanation 字段，缺失任一字段的题库 MUST 被拒绝并报错

#### Scenario: 双向题目均衡

- **WHEN** 校验内置题库
- **THEN** `for-male` 与 `for-female` 两个方向的题目数量 MUST 均不少于 10 道，保证双向体验对等

### Requirement: 题目内容基调

题目场景 MUST 使用幽默但不贬低任一方的表述，解析 MUST 以促进理解为目的，禁止强化负面刻板印象作为"正确答案"。

#### Scenario: 解析促进理解

- **WHEN** 玩家答完任意题目
- **THEN** 系统 MUST 展示该题解析文案，且解析中说明"这只是一类常见现象而非所有人的标签"或等效的温和提醒

### Requirement: 按局抽题

开局时系统 SHALL 从题库中为当前玩家阵营的对向视角随机抽取指定数量的题目，单局内题目 MUST 不重复。

#### Scenario: 抽取对向视角题

- **WHEN** 玩家选择"男生阵营"开始一局 N 题的游戏
- **THEN** 系统 MUST 从 `for-female` 分类中随机抽取 N 道互不相同的题目组成对局

#### Scenario: 题量不足兜底

- **WHEN** 请求抽取的题量超过该分类可用题数
- **THEN** 系统 MUST 返回该分类全部题目而非报错
