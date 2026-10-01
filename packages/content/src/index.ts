import rawBank from "./questions.json";
import {
  loadQuestionBank,
  type CategoryId,
  type Question,
  type QuestionBank,
  type TargetPerspective,
} from "./schema";

export * from "./schema";

/** 内置题库（构建期随包分发，加载即经 schema 校验）。 */
export const bank: QuestionBank = loadQuestionBank(rawBank);

/** Fisher-Yates 洗牌（可注入 rng 便于测试）。 */
function shuffled<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 按目标视角抽题：随机、单局不重复、可排除上局题目；
 * 传 category 时限该场景专场抽题；题量不足时返回该范围全部题目而非报错。
 */
export function drawQuestions(
  source: QuestionBank,
  target: TargetPerspective,
  count: number,
  excludeIds: string[] = [],
  rng: () => number = Math.random,
  category?: CategoryId,
): Question[] {
  const pool = source.questions.filter(
    (q) => q.targetPerspective === target && (!category || q.category === category),
  );
  const fresh = pool.filter((q) => !excludeIds.includes(q.id));
  const usable = fresh.length >= count ? fresh : pool;
  return shuffled(usable, rng).slice(0, count);
}
