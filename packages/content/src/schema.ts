import { z } from "zod";

/**
 * 题目分类（目标视角）：
 * - `for-female`：女生处境题，由【男生阵营】作答（考察男生对女生的理解）
 * - `for-male`：男生处境题，由【女生阵营】作答（考察女生对男生的理解）
 */
export const targetPerspectiveSchema = z.enum(["for-female", "for-male"]);
export type TargetPerspective = z.infer<typeof targetPerspectiveSchema>;

/** 场景分类 id（专场玩法按此维度抽题）。 */
export const categoryIdSchema = z.enum([
  "chat",
  "date",
  "emotion",
  "money",
  "life",
  "social",
  "private",
  "screen",
  "future",
  "score",
  "needs",
  "fight",
]);
export type CategoryId = z.infer<typeof categoryIdSchema>;

/** 场景分类元数据：展示于首页专场选择器与对局页徽标。 */
export const sceneCategorySchema = z.object({
  id: categoryIdSchema,
  name: z.string().min(1),
  emoji: z.string().min(1),
  description: z.string().min(1),
});
export type SceneCategory = z.infer<typeof sceneCategorySchema>;

export const questionSchema = z
  .object({
    id: z.string().min(1),
    targetPerspective: targetPerspectiveSchema,
    category: categoryIdSchema,
    scenario: z.string().min(4),
    options: z.array(z.string().min(1)).min(2).max(4),
    answerIndex: z.number().int().nonnegative(),
    explanation: z.string().min(4),
    funFact: z.string().optional(),
  })
  .refine((q) => q.answerIndex < q.options.length, {
    message: "answerIndex out of options range",
  });

export type Question = z.infer<typeof questionSchema>;

export const questionBankSchema = z
  .object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/, "version must be semver"),
    categories: z.array(sceneCategorySchema).min(1),
    questions: z.array(questionSchema).min(1),
  })
  .superRefine((bank, ctx) => {
    const ids = new Set(bank.categories.map((c) => c.id));
    bank.questions.forEach((q, i) => {
      if (!ids.has(q.category)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `question "${q.id}" has unknown category "${q.category}"`,
          path: ["questions", i, "category"],
        });
      }
    });
  });

export type QuestionBank = z.infer<typeof questionBankSchema>;

/** 加载并校验题库；数据不合法立即抛错（fail-fast，不静默降级）。 */
export function loadQuestionBank(raw: unknown): QuestionBank {
  return questionBankSchema.parse(raw);
}
