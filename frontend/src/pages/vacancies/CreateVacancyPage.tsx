import { useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vacancySchema,
  type VacancyFormValues,
} from "@/schemas/vacancies/vacancies.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Briefcase,
  Layers,
  AlertCircle,
} from "lucide-react";
import { useCreateVacancyMutation } from "@/api/vacancies/model/mutations";
import { getErrorMessage } from "@/utils/errorsGetter";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CreateVacancyPage() {
  const navigate = useNavigate();
  const {
    mutate,
    isPending,
    error,
    reset: resetMutation,
  } = useCreateVacancyMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      title: "",
      description: "",
      stages: [{ name: "Скрининг" }, { name: "Техническое интервью" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stages",
  });

  const onSubmit = (data: VacancyFormValues) => {
    const payload = {
      title: data.title,
      description: data.description,
      stagesNames: data.stages.map((s) => s.name),
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Вакансия создана!");
        navigate("/vacancies");
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-3 text-muted-foreground hover:text-primary h-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к списку
      </Button>

      <Card className="border-border shadow-md bg-card">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Briefcase className="h-6 w-6 text-primary" />
            Создание новой вакансии
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pt-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => {
              if (error) resetMutation();
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Название должности</FieldLabel>
                <Input
                  {...register("title")}
                  id="title"
                  placeholder="Напр: Senior Frontend Developer"
                  className={cn(
                    errors.title && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                <div className="h-4 text-xs text-red-500">
                  {errors.title?.message}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Описание вакансии</FieldLabel>
                <textarea
                  {...register("description")}
                  id="description"
                  placeholder="Задачи, требования и условия..."
                  className={cn(
                    "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    errors.description &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                <div className="h-5 text-xs text-red-500">
                  {errors.description?.message}
                </div>
              </Field>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Layers className="h-4 w-4 text-primary" />
                    <h3>Этапы подбора</h3>
                  </div>
                  {fields.length <= 2 && (
                    <span className="text-[10px] text-orange-500 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Минимум 2 этапа
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {fields.map((field, index) => (
                    <div key={field.id} className="group">
                      <div className="flex items-center gap-3">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                          {index + 1}
                        </div>
                        <Input
                          {...register(`stages.${index}.name` as const)}
                          placeholder="Название этапа..."
                          className={cn(
                            "flex-1 h-10",
                            errors.stages?.[index]?.name &&
                              "border-red-500 focus-visible:ring-red-500",
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 2}
                          className="text-muted-foreground hover:text-destructive disabled:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="h-5 ml-11 text-[11px] text-red-500 mt-0.5">
                        {errors.stages?.[index]?.name?.message}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "" })}
                  className="border-dashed border-primary/40 text-primary hover:bg-primary/5 w-full h-10"
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить еще этап
                </Button>
              </div>

              <div className="pt-6 border-t border-border/50">
                <div className="h-6 mb-2 text-center text-sm text-red-500 font-medium">
                  {error && getErrorMessage(error)}
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="min-w-[180px] bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    {isPending ? "Сохранение..." : "Создать вакансию"}
                  </Button>
                </div>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
