import { describe, expect, it } from "vitest";
import {
  bank,
  drawQuestions,
  loadQuestionBank,
  questionSchema,
  type QuestionBank,
} from "../src/index";

const FIXTURE: QuestionBank = {
  version: "0.0.1",
  categories: [
    { id: "chat", name: "聊天密语", emoji: "💬", description: "d" },
    { id: "date", name: "约会现场", emoji: "💘", description: "d" },
  ],
  questions: [
    {
      id: "a",
      targetPerspective: "for-female",
      category: "chat",
      scenario: "s",
      options: ["x", "y"],
      answerIndex: 0,
      explanation: "e",
    },
    {
      id: "b",
      targetPerspective: "for-female",
      category: "chat",
      scenario: "s",
      options: ["x", "y"],
      answerIndex: 0,
      explanation: "e",
    },
    {
      id: "c",
      targetPerspective: "for-female",
      category: "date",
      scenario: "s",
      options: ["x", "y"],
      answerIndex: 0,
      explanation: "e",
    },
    {
      id: "d",
      targetPerspective: "for-male",
      category: "chat",
      scenario: "s",
      options: ["x", "y"],
      answerIndex: 0,
      explanation: "e",
    },
  ],
};

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

  it("category 不在场景元数据中的题库被拒绝", () => {
    const bad = { ...FIXTURE, questions: [{ ...FIXTURE.questions[0], category: "nope" }] };
    expect(() => loadQuestionBank(bad)).toThrow();
  });

  // spec: 双向题目均衡
  it("for-male 与 for-female 各不少于 10 题", () => {
    const f = bank.questions.filter((q) => q.targetPerspective === "for-female").length;
    const m = bank.questions.filter((q) => q.targetPerspective === "for-male").length;
    expect(f).toBeGreaterThanOrEqual(10);
    expect(m).toBeGreaterThanOrEqual(10);
  });
});

// spec: question-bank / 场景分类
describe("场景分类", () => {
  it("内置 12 大场景且元数据完整", () => {
    expect(bank.categories).toHaveLength(12);
    for (const c of bank.categories) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.emoji).toBeTruthy();
      expect(c.description).toBeTruthy();
    }
  });

  it("每个场景双向各不少于 4 题", () => {
    for (const c of bank.categories) {
      for (const t of ["for-male", "for-female"] as const) {
        const n = bank.questions.filter(
          (q) => q.category === c.id && q.targetPerspective === t,
        ).length;
        expect(n, `${c.id}/${t}`).toBeGreaterThanOrEqual(4);
      }
    }
  });
});

// spec: question-bank / 按局抽题
describe("按局抽题", () => {
  it("只抽取对向视角题目且不重复", () => {
    const drawn = drawQuestions(bank, "for-female", 8);
    expect(drawn).toHaveLength(8);
    expect(drawn.every((q) => q.targetPerspective === "for-female")).toBe(true);
    expect(new Set(drawn.map((q) => q.id)).size).toBe(8);
  });

  it("场景专场只抽该场景题", () => {
    const drawn = drawQuestions(bank, "for-female", 4, [], Math.random, "chat");
    expect(drawn.length).toBeGreaterThan(0);
    expect(drawn.every((q) => q.category === "chat")).toBe(true);

    const fx = drawQuestions(FIXTURE, "for-female", 2, [], Math.random, "date");
    expect(fx).toHaveLength(1);
    expect(fx[0].id).toBe("c");
  });

  it("题量不足时返回该范围全部题目", () => {
    const drawn = drawQuestions(FIXTURE, "for-male", 8);
    expect(drawn).toHaveLength(1);
    expect(drawn[0].id).toBe("d");
  });

  it("再来一局排除上局题目（题库允许范围内）", () => {
    // a/b/c 排除后 for-female 剩 0 道新鲜题，回退全量池仍返回 1 道
    const drawn = drawQuestions(FIXTURE, "for-female", 1, ["a", "b", "c"]);
    expect(drawn).toHaveLength(1);

    // 排除 4 题后 for-female 还剩 32 道新鲜题，满足题量，应全部避开已答题
    const excludeIds = bank.questions.slice(0, 4).map((q) => q.id);
    const drawn2 = drawQuestions(bank, "for-female", 8, excludeIds);
    expect(drawn2).toHaveLength(8);
    const excluded = new Set(excludeIds);
    expect(drawn2.every((q) => !excluded.has(q.id))).toBe(true);
  });
});
