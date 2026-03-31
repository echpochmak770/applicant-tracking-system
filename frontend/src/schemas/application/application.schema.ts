import * as z from "zod"

export const createApplicationSchema = z.object({
  firstName: z.string().min(2, "Имя слишком короткое"),
  lastName: z.string().min(2, "Фамилия слишком короткая"),
  email: z.string().email("Неверный формат почты"),
  phone: z.string().optional(),
  resumeFile: z
    .instanceof(File, { message: "Необходимо загрузить резюме" })
    .refine((file) => file.size <= 64 * 1024 * 1024, "Файл не должен превышать 5МБ")
})

export type CreateApplicationFormValues = z.infer<typeof createApplicationSchema>