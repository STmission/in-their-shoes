import { describe, expect, it } from "vitest";
import {
  bank,
  drawQuestions,
  loadQuestionBank,
  questionSchema,
  type QuestionBank,
} from "../src/index";

// spec: question-bank / 题目数据模型
describe("题目数据模型", () => {
  it("内置题库通过 schema 校验", () => {
    expect(() => loadQuestionBank(bank)).not.toThrow();
  });

  it("缺字段的题库被拒绝", () => {
    expect(() => loadQuestionBank({ version: "1.0.0" })).toThrow();
    expect(() =>
      questionSchema.parse({ id: "x", targetPerspective: "for-male", scenario: "abc" }),
    ).toThrow();
  });

  it("answerIndex 越界的题目被拒绝", () => {
    const q = bank.questions[0];
    expect(() => questionSchema.parse({ ...q, answerIndex: 99 })).toThrow();
  });

  // spec: 双向题目均衡
  it("for-male 与 for-female 各不少于 10 题", () => {
    const f = bank.questions.filter((q) => q.targetPerspective === "for-female").length;
    const m = bank.questions.filter((q) => q.targetPerspective === "for-male").length;
    expect(f).toBeGreaterThanOrEqual(10);
    expect(m).toBeGreaterThanOrEqual(10);
  });
});

// spec: question-bank / 按局抽题
describe("按局抽题", () => {
  const smallBank: QuestionBank = {
    version: "0.0.1",
    questions: [
      {
        id: "a",
        targetPerspective: "for-female",
        scenario: "s",
        options: ["x", "y"],
        answerIndex: 0,
        explanation: "e",
      },
      {
        id: "b",
        targetPerspective: "for-female",
        scenario: "s",
        options: ["x", "y"],
        answerIndex: 0,
        explanation: "e",
      },
      {
        id: "c",
        targetPerspective: "for-female",
        scenario: "s",
        options: ["x", "y"],
        answerIndex: 0,
        explanation: "e",
      },
      {
        id: "d",
        targetPerspective: "for-male",
        scenario: "s",
        options: ["x", "y"],
        answerIndex: 0,
        explanation: "e",
      },
    ],
  };

  it("只抽取对向视角题目且不重复", () => {
    const drawn = drawQuestions(bank, "for-female", 8);
    expect(drawn).toHaveLength(8);
    expect(drawn.every((q) => q.targetPerspective === "for-female")).toBe(true);
    expect(new Set(drawn.map((q) => q.id)).size).toBe(8);
  });

  it("题量不足时返回该分类全部题目", () => {
    const drawn = drawQuestions(smallBank, "for-male", 8);
    expect(drawn).toHaveLength(1);
    expect(drawn[0].id).toBe("d");
  });

  it("再来一局排除上局题目（题库允许范围内）", () => {
    const exclude = ["a", "b", "c"];
    const drawn = drawQuestions(smallBank, "for-female", 1, exclude);
    // a/b/c 均被排除后只剩 0 道新鲜题，回退到全量池，但允许范围外的优先：此处验证不回空
    expect(drawn).toHaveLength(1);

    // 排除 4 题后 for-female 还剩 8 道新鲜题，满足题量，应全部避开已答题
    const excludeIds = bank.questions.slice(0, 4).map((q) => q.id);
    const drawn2 = drawQuestions(bank, "for-female", 8, excludeIds);
    expect(drawn2).toHaveLength(8);
    const excluded = new Set(excludeIds);
    expect(drawn2.every((q) => !excluded.has(q.id))).toBe(true);
  });
});
