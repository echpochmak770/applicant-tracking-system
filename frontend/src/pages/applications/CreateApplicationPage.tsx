import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateApplicationFormValues,
  createApplicationSchema,
} from "@/schemas/application/application.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus, Upload, FileText, Phone } from "lucide-react";
import { IMaskInput } from "react-imask";
import { useCreateApplicationMutation } from "@/api/applications/model/mutations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CreateApplicationPage() {
  const navigate = useNavigate();
  const { vacancyId } = useParams();
  const {
    mutate,
    isPending,
    error,
    reset: resetMutation,
  } = useCreateApplicationMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateApplicationFormValues>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
  });

  const resume = watch("resumeFile");

  const onSubmit = (data: CreateApplicationFormValues) => {
    if (!vacancyId) return;

    const payload = new FormData();
    payload.append("VacancyId", vacancyId);
    payload.append("FirstName", data.firstName);
    payload.append("LastName", data.lastName);
    payload.append("Email", data.email);
    if (data.phone) payload.append("Phone", data.phone);
    payload.append("ResumeFile", data.resumeFile);

    mutate(payload, {
      onSuccess: () => {
        toast.success("Отклик создан!");
        navigate(`/vacancies/${vacancyId}/applications`);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-10">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-3 text-muted-foreground hover:text-primary h-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к откликам
      </Button>

      <Card className="border-border shadow-md bg-card">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <UserPlus className="h-6 w-6 text-primary" /> Новый отклик
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => {
              if (error) resetMutation();
            }}
          >
            <FieldGroup className="gap-2">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Имя</FieldLabel>
                  <Input
                    {...register("firstName")}
                    placeholder="Иван"
                    className={cn(errors.firstName && "border-red-500")}
                  />
                  <div className="h-5 text-[11px] text-red-500 mt-0.5">
                    {errors.firstName?.message}
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Фамилия</FieldLabel>
                  <Input
                    {...register("lastName")}
                    placeholder="Иванов"
                    className={cn(errors.lastName && "border-red-500")}
                  />
                  <div className="h-5 text-[11px] text-red-500 mt-0.5">
                    {errors.lastName?.message}
                  </div>
                </Field>
              </div>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  className={cn(errors.email && "border-red-500")}
                />
                <div className="h-5 text-[11px] text-red-500 mt-0.5">
                  {errors.email?.message}
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium">
                  Телефон (необязательно)
                </FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        mask="+000000000000000"
                        definitions={{ "0": /[0-9]/ }}
                        value={field.value}
                        onAccept={(val) => field.onChange(String(val))}
                        className={cn(
                          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors pl-10 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
                          errors.phone && "border-red-500",
                        )}
                        placeholder="+1 234 567 89 00"
                      />
                    )}
                  />
                </div>
                <div className="h-5 text-[11px] text-red-500 mt-0.5">
                  {errors.phone?.message}
                </div>
              </Field>

              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-primary" /> Резюме
                </div>
                <FieldDescription>
                  Загрузите файл резюме (PDF, DOC до 5МБ)
                </FieldDescription>

                <label
                  className={cn(
                    "flex items-center justify-between border border-dashed rounded-lg p-4 cursor-pointer hover:bg-primary/5 transition",
                    errors.resumeFile
                      ? "border-red-500 bg-red-50/10"
                      : "border-primary/40",
                  )}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Upload className="h-4 w-4 text-primary" />
                    {resume ? (resume as File).name : "Выбрать файл"}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        setValue("resumeFile", file, { shouldValidate: true });
                    }}
                  />
                </label>
                <div className="h-5 text-[11px] text-red-500">
                  {errors.resumeFile?.message}
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                {error && (
                  <div className="mb-4 text-sm text-red-500 text-center font-medium">
                    Ошибка сервера: Попробуйте позже
                  </div>
                )}
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
                    {isPending ? "Создание..." : "Создать отклик"}
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
