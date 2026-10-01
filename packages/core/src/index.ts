import {
  bank as defaultBank,
  drawQuestions,
  type CategoryId,
  type Question,
  type QuestionBank,
  type SceneCategory,
  type TargetPerspective,
} from "@game/content";

/** 玩家阵营：选定后分发对向视角题目。 */
export type Side = "male" | "female";

/** side → 对向视角题分类（男生答 for-female，女生答 for-male）。 */
export function targetFor(side: Side): TargetPerspective {
  return side === "male" ? "for-female" : "for-male";
}

export type Phase = "idle" | "answering" | "revealed" | "finished";

export interface SubmitResult {
  correct: boolean;
  gained: number;
  streak: number;
  question: Question;
}

export const BASE_SCORE = 100;
export const STREAK_STEP = 10;
export const STREAK_CAP = 50;

/** 连对加成：第 n 连对额外 +10×(n-1)，单题封顶 +50。 */
export function streakBonus(streakAfterHit: number): number {
  return Math.min(STREAK_STEP * (streakAfterHit - 1), STREAK_CAP);
}

/** 满分：全部答对且连对加成拉满，用于计算共情指数。 */
export function maxScore(questionCount: number): number {
  let total = 0;
  for (let i = 1; i <= questionCount; i++) total += BASE_SCORE + streakBonus(i);
  return total;
}

export interface RankTier {
  minIndex: number;
  titleByMale: string;
  titleByFemale: string;
}

/** 评级表（阈值从高到低匹配，称号均为正向幽默向）。 */
export const RANK_TIERS: RankTier[] = [
  { minIndex: 90, titleByMale: "读心大师", titleByFemale: "读心大师" },
  { minIndex: 70, titleByMale: "懂王本王", titleByFemale: "知心姐姐" },
  { minIndex: 50, titleByMale: "潜力股暖男", titleByFemale: "默契养成中" },
  { minIndex: 30, titleByMale: "钢铁直男·进化中", titleByFemale: "直女·观察期" },
  { minIndex: 0, titleByMale: "火星来客", titleByFemale: "金星访客" },
];

export function rankFor(empathyIndex: number, side: Side): string {
  const tier =
    RANK_TIERS.find((t) => empathyIndex >= t.minIndex) ?? RANK_TIERS[RANK_TIERS.length - 1];
  return side === "male" ? tier.titleByMale : tier.titleByFemale;
}

export interface StartOptions {
  side: Side;
  /** 场景专场 id；不传 = 随机全场景 */
  category?: CategoryId;
  count?: number;
  bank?: QuestionBank;
  /** 排除题 id（"再来一局"不重复用上局题） */
  excludeIds?: string[];
  rng?: () => number;
}

/** 对局会话：状态机 idle → answering → revealed →(next)→ answering|finished */
export class GameSession {
  readonly side: Side;
  readonly category: CategoryId | null;
  readonly questions: Question[];
  readonly maxScore: number;
  phase: Phase = "idle";
  index = 0;
  score = 0;
  correctCount = 0;
  streak = 0;
  /** 本局题 id 列表，供"再来一局"排除复用。 */
  readonly questionIds: string[];

  constructor(side: Side, questions: Question[], category: CategoryId | null = null) {
    this.side = side;
    this.category = category;
    this.questions = questions;
    this.maxScore = maxScore(questions.length);
    this.questionIds = questions.map((q) => q.id);
  }

  static start(opts: StartOptions): GameSession {
    const { side, category, count = 8, bank = defaultBank, excludeIds = [], rng } = opts;
    const questions = drawQuestions(
      bank,
      targetFor(side),
      count,
      excludeIds,
      rng,
      category ?? undefined,
    );
    const s = new GameSession(side, questions, category ?? null);
    s.phase = "answering";
    return s;
  }

  /** 当前场景元数据（null = 随机全场景）。 */
  sceneOf(bank: QuestionBank = defaultBank): SceneCategory | null {
    if (!this.category) return null;
    return bank.categories.find((c) => c.id === this.category) ?? null;
  }

  get current(): Question | undefined {
    return this.questions[this.index];
  }

  get empathyIndex(): number {
    return this.maxScore === 0 ? 0 : Math.round((this.score / this.maxScore) * 100);
  }

  submit(answerIndex: number): SubmitResult {
    if (this.phase !== "answering" || !this.current) {
      throw new Error(`cannot submit in phase "${this.phase}"`);
    }
    const q = this.current;
    const correct = answerIndex === q.answerIndex;
    let gained = 0;
    if (correct) {
      this.streak += 1;
      this.correctCount += 1;
      gained = BASE_SCORE + streakBonus(this.streak);
      this.score += gained;
    } else {
      this.streak = 0;
    }
    this.phase = "revealed";
    return { correct, gained, streak: this.streak, question: q };
  }

  next(): Phase {
    if (this.phase !== "revealed") {
      throw new Error(`cannot advance in phase "${this.phase}"`);
    }
    if (this.index >= this.questions.length - 1) {
      this.phase = "finished";
    } else {
      this.index += 1;
      this.phase = "answering";
    }
    return this.phase;
  }

  get rank(): string {
    return rankFor(this.empathyIndex, this.side);
  }
}
