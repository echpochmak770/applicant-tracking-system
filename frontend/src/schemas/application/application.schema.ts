import * as z from "zod";

export const createApplicationSchema = z.object({
  firstName: z.string().min(2, "Имя слишком короткое"),
  lastName: z.string().min(2, "Фамилия слишком короткая"),
  email: z.string().email("Неверный формат почты"),
  phone: z.string().optional(),
  resumeFile: z
    .union([z.instanceof(File), z.instanceof(Blob)], {
      message: "Необходимо загрузить резюме",
    })
    .refine(
      (file) => file.size <= 64 * 1024 * 1024,
      "Файл не должен превышать 64МБ",
    ),
});

export type CreateApplicationFormValues = z.infer<
  typeof createApplicationSchema
>;
