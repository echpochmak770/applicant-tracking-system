import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Briefcase, Layers, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  updateVacancySchema,
  type UpdateVacancyFormValues,
} from "@/schemas/vacancies/vacancies.schema";
import { type VacancyStatus } from "@/store/useVacanciesStore";
import { useVacancyQuery } from "@/api/vacancies/model/queries";
import { useVacancyStagesQuery } from "@/api/stage/model/queries";
import { useUpdateVacancyMutation } from "@/api/vacancies/model/mutations";
import { toast } from "sonner";

export const VACANCY_STATUSES: VacancyStatus[] = [
  "Draft",
  "Paused",
  "Open",
  "Closed",
];

export default function UpdateVacancyPage() {
  const { vacancyId } = useParams<{ vacancyId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useVacancyQuery(vacancyId!);
  const { data: apiStages } = useVacancyStagesQuery(vacancyId!);
  const stages = apiStages?.filter((stage) => stage.name !== "Оффер");
  const { mutate: update } = useUpdateVacancyMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateVacancyFormValues>({
    resolver: zodResolver(updateVacancySchema),
    values: {
      title: data?.title || "",
      description: data?.description || "",
      status: data?.status || "",
    },
  });

  const currentStatus = watch("status");

  const onSubmit = (data: UpdateVacancyFormValues) => {
    update(
      {
        id: vacancyId!,
        body: data,
      },
      {
        onSuccess: () => {
          toast.success("Вакансия обновлена!");
          navigate("/vacancies");
        },
      },
    );
  };

  const currentStages = stages || [];

  if (!data || isLoading || !stages) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-3 text-muted-foreground hover:text-primary h-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
      </Button>

      <Card className="border-border shadow-md bg-card">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Briefcase className="h-6 w-6 text-primary" />
            Редактирование вакансии
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pt-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Название должности</FieldLabel>
                <Input
                  {...register("title")}
                  className={cn(errors.title && "border-red-500")}
                />
                <div className="h-4 text-xs text-red-500">
                  {errors.title?.message}
                </div>
              </Field>

              <Field>
                <FieldLabel>Статус вакансии</FieldLabel>
                <Select
                  value={currentStatus}
                  onValueChange={(status) => {
                    setValue("status", status, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger
                    className={cn(errors.status && "border-red-500")}
                  >
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    {VACANCY_STATUSES.map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="h-4 text-xs text-red-500">
                  {errors.status?.message}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Описание вакансии</FieldLabel>
                <textarea
                  {...register("description")}
                  className={cn(
                    "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    errors.description && "border-red-500",
                  )}
                />
                <div className="h-5 text-xs text-red-500">
                  {errors.description?.message}
                </div>
              </Field>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <h3>Этапы подбора</h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                    <Lock className="h-3 w-3" /> Только для чтения
                  </span>
                </div>

                <div className="grid gap-2">
                  {currentStages.map((stage: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30"
                    >
                      <div className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-[10px] font-bold border border-border">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {stage.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
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
                    className="min-w-[180px] bg-primary text-primary-foreground"
                  >
                    Сохранить изменения
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
