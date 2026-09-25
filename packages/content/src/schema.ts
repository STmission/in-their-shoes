import { z } from "zod";

/**
 * 题目分类（目标视角）：
 * - `for-female`：女生处境题，由【男生阵营】作答（考察男生对女生的理解）
 * - `for-male`：男生处境题，由【女生阵营】作答（考察女生对男生的理解）
 */
export const targetPerspectiveSchema = z.enum(["for-female", "for-male"]);
export type TargetPerspective = z.infer<typeof targetPerspectiveSchema>;

export const questionSchema = z
  .object({
    id: z.string().min(1),
    targetPerspective: targetPerspectiveSchema,
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

export const questionBankSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "version must be semver"),
  questions: z.array(questionSchema).min(1),
});

export type QuestionBank = z.infer<typeof questionBankSchema>;

/** 加载并校验题库；数据不合法立即抛错（fail-fast，不静默降级）。 */
export function loadQuestionBank(raw: unknown): QuestionBank {
  return questionBankSchema.parse(raw);
}
