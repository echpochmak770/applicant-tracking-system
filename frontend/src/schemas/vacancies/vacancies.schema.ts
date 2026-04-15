import * as z from "zod";

export const vacancySchema = z.object({
  title: z.string().min(3, "Название должно быть не менее 3 символов"),
  description: z.string().min(10, "Описание должно быть более информативным"),
  stages: z
    .array(
      z.object({
        name: z.string().min(1, "Название этапа не может быть пустым"),
      }),
    )
    .min(2, "Минимум 2 этапа"),
});

export const updateVacancySchema = z.object({
  title: z.string().min(2, "Название слишком короткое"),
  description: z.string().min(10, "Описание должно быть содержательным"),
  status: z.string({ error: "Выберите статус" }),
});

export type VacancyFormValues = z.infer<typeof vacancySchema>;
export type UpdateVacancyFormValues = z.output<typeof updateVacancySchema>;
