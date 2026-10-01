## ADDED Requirements

### Requirement: 场景分类

题库 SHALL 定义场景分类元数据：每个场景具备唯一 id、中文名、emoji 与一句话描述。内置场景 MUST 覆盖：chat（聊天密语）、date（约会现场）、emotion（情绪时刻）、money（消费观念）、life（生活日常）、social（社交习惯）、private（暧昧心事）、screen（荧幕情感）、future（未来蓝图）九类。

#### Scenario: 场景元数据完整

- **WHEN** 加载题库场景列表
- **THEN** 每个场景 MUST 提供 id、name、emoji、description 字段

#### Scenario: 双向各场景题量均衡

- **WHEN** 校验内置题库
- **THEN** 每个场景下 `for-male` 与 `for-female` 题目 MUST 各不少于 4 道，保证任一专场双端皆可成局

### Requirement: 开放与现实议题的内容边界

private/screen/future 三类题目 SHALL 允许暧昧期信号解读、隐私边界话题、知名影视作品引用与房车/孩子/工作/生活质量/娱乐方式等现实议题；同时 MUST 保持优雅不露骨，影视题以"现象解读"为目的而非考剧情，隐私题聚焦行为信号而非私密细节。

#### Scenario: 暧昧题保持信号解读尺度

- **WHEN** 审校 private 场景题目
- **THEN** 题目 MUST 围绕可观察行为信号（回复节奏、肢体默许、社交圈引入等），禁止露骨性描述与价值审判

#### Scenario: 影视题以现象为目的

- **WHEN** 审校 screen 场景题目
- **THEN** 参考答案 MUST 指向现实中的普遍心理解读，而非剧情细节记忆

## MODIFIED Requirements

### Requirement: 题目数据模型

每道题目 SHALL 包含：唯一 id、目标视角分类（`for-male` / `for-female`，即"男生答 / 女生答"）、所属场景分类 `category`（取值 MUST 为题库场景元数据之一）、场景描述、2-4 个选项、参考答案下标、解析文案，以及可选的平权小贴士（funFact）。题库 SHALL 携带语义化版本号。

#### Scenario: 题目结构完整

- **WHEN** 题库被加载或校验
- **THEN** 每道题必须具备 id、targetPerspective、category、scenario、options、answerIndex、explanation 字段，缺失任一字段的题库 MUST 被拒绝并报错

#### Scenario: 双向题目均衡

- **WHEN** 校验内置题库
- **THEN** `for-male` 与 `for-female` 两个方向的题目数量 MUST 均不少于 10 道，保证双向体验对等

#### Scenario: category 合法

- **WHEN** 某题的 category 不在题库场景元数据中
- **THEN** 校验 MUST 拒绝该题库并报错

### Requirement: 按局抽题

开局时系统 SHALL 从题库中为当前玩家阵营的对向视角随机抽取指定数量的题目，单局内题目 MUST 不重复。当玩家选定场景专场时，抽题 MUST 仅在该场景内进行；"随机全场景" MUST 不限场景。

#### Scenario: 抽取对向视角题

- **WHEN** 玩家选择"男生阵营"开始一局 N 题的游戏
- **THEN** 系统 MUST 从 `for-female` 分类中随机抽取 N 道互不相同的题目组成对局

#### Scenario: 场景专场抽题

- **WHEN** 玩家选择"约会现场"专场开始一局 N 题的游戏
- **THEN** 系统 MUST 仅从 category 为 `date` 且符合对向视角的题目中抽取

#### Scenario: 题量不足兜底

- **WHEN** 请求抽取的题量超过该范围可用题数
- **THEN** 系统 MUST 返回该范围全部题目而非报错
