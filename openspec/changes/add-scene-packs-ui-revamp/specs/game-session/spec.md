## MODIFIED Requirements

### Requirement: 阵营选择与开局

玩家 SHALL 在开局前选择自己的阵营（男生/女生），系统 MUST 为其分发对向视角的题目，即男生答 `for-female` 题、女生答 `for-male` 题。玩家 SHALL 同时选择测试范围：随机全场景（默认）或某一场景专场；专场对局内所有题目 MUST 属于同一场景。

#### Scenario: 男生阵营开局

- **WHEN** 玩家选择"我是男生"并开始游戏
- **THEN** 系统 MUST 生成一局由 `for-female` 题目构成的对局

#### Scenario: 女生阵营开局

- **WHEN** 玩家选择"我是女生"并开始游戏
- **THEN** 系统 MUST 生成一局由 `for-male` 题目构成的对局

#### Scenario: 场景专场开局

- **WHEN** 玩家选择"情绪时刻"专场并开始游戏
- **THEN** 对局内所有题目 MUST 为对向视角且 category 为 `emotion`
