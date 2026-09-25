import { describe, expect, it } from "vitest";
import { bank, type QuestionBank } from "@game/content";
import { GameSession, maxScore, rankFor, streakBonus, targetFor } from "../src/index";

const bank2: QuestionBank = {
  version: "0.0.1",
  questions: Array.from({ length: 8 }, (_, i) => ({
    id: `f-${i}`,
    targetPerspective: "for-female" as const,
    scenario: `场景${i}`,
    options: ["甲", "乙", "丙", "丁"],
    answerIndex: 0,
    explanation: "解析",
  })),
};

function startMale() {
  return GameSession.start("male", 8, bank2, [], () => 0.5);
}

// spec: game-session / 阵营选择与开局
describe("阵营选择与开局", () => {
  it("男生阵营分发 for-female 题", () => {
    expect(targetFor("male")).toBe("for-female");
    const s = GameSession.start("male", 8, bank);
    expect(s.phase).toBe("answering");
    expect(s.questions.every((q) => q.targetPerspective === "for-female")).toBe(true);
  });

  it("女生阵营分发 for-male 题", () => {
    expect(targetFor("female")).toBe("for-male");
    const s = GameSession.start("female", 8, bank);
    expect(s.questions.every((q) => q.targetPerspective === "for-male")).toBe(true);
  });
});

// spec: game-session / 作答与即时反馈
describe("作答与即时反馈", () => {
  it("答对：得分、phase 转 revealed、可带解析进入下一题", () => {
    const s = startMale();
    const r = s.submit(0);
    expect(r.correct).toBe(true);
    expect(r.gained).toBe(100);
    expect(s.phase).toBe("revealed");
    expect(r.question.explanation.length).toBeGreaterThan(0);
    s.next();
    expect(s.phase).toBe("answering");
  });

  it("答错：不得分、phase 转 revealed、解析照常展示", () => {
    const s = startMale();
    const r = s.submit(1);
    expect(r.correct).toBe(false);
    expect(r.gained).toBe(0);
    expect(s.phase).toBe("revealed");
  });

  it("revealed 阶段禁止重复作答", () => {
    const s = startMale();
    s.submit(0);
    expect(() => s.submit(0)).toThrow();
  });
});

// spec: game-session / 共情指数计分
describe("共情指数计分", () => {
  it("连对加成：第 3 连对得 100+20", () => {
    const s = startMale();
    s.submit(0);
    s.next();
    s.submit(0);
    s.next();
    const r = s.submit(0);
    expect(r.gained).toBe(120);
    expect(r.streak).toBe(3);
  });

  it("连对加成封顶 +50", () => {
    expect(streakBonus(1)).toBe(0);
    expect(streakBonus(6)).toBe(50);
    expect(streakBonus(99)).toBe(50);
  });

  it("答错后连对清零，下题仅得 100", () => {
    const s = startMale();
    s.submit(0);
    s.next();
    s.submit(1);
    s.next();
    const r = s.submit(0);
    expect(r.streak).toBe(1);
    expect(r.gained).toBe(100);
  });

  it("全对时共情指数为 100", () => {
    const s = startMale();
    for (let i = 0; i < 8; i++) {
      s.submit(0);
      s.next();
    }
    expect(s.phase).toBe("finished");
    expect(s.score).toBe(maxScore(8));
    expect(s.empathyIndex).toBe(100);
  });
});

// spec: game-session / 结算与评级称号
describe("结算与评级", () => {
  it("≥90% 得最高档称号", () => {
    expect(rankFor(90, "male")).toBe("读心大师");
    expect(rankFor(95, "female")).toBe("读心大师");
  });

  it("各区间称号正向且按阵营区分", () => {
    expect(rankFor(75, "male")).toBe("懂王本王");
    expect(rankFor(75, "female")).toBe("知心姐姐");
    expect(rankFor(10, "male")).toBe("火星来客");
    expect(rankFor(10, "female")).toBe("金星访客");
  });

  it("再来一局排除上局题目（题库余量允许时）", () => {
    const s1 = GameSession.start("male", 4, bank);
    const s2 = GameSession.start("male", 4, bank, s1.questionIds);
    const prev = new Set(s1.questionIds);
    expect(s2.questions).toHaveLength(4);
    expect(s2.questions.every((q) => !prev.has(q.id))).toBe(true);
  });
});
