import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Briefcase, Layers, AlertCircle } from "lucide-react";
import { useCreateVacancyMutation } from "@/api/vacancies/model/mutations";

export default function CreateVacancyPage() {
  const navigate = useNavigate();
  
  // Инициализируем сразу двумя стадиями по требованию
  const [stages, setStages] = useState<string[]>(["Скрининг", "Техническое интервью"]);

  const { mutate, isPending } = useCreateVacancyMutation();

  const addStage = () => setStages([...stages, ""]);
  
  const updateStage = (index: number, value: string) => {
    const newStages = [...stages];
    newStages[index] = value;
    setStages(newStages);
  };

  const removeStage = (index: number) => {
    // Валидация: минимум 2 стадии
    if (stages.length <= 2) return;
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    
    // Подготовка данных по твоему CreateVacancyBody
    const payload = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      stagesNames: stages.filter(s => s.trim() !== ""), // Убираем пустые, если пользователь их не заполнил
    };

    console.log("Отправка вакансии:", payload);

    mutate(payload, {
      onSuccess: () => {
        navigate("/vacancies");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
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

        <CardContent className="px-6">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-6">
              
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="title">Название должности</FieldLabel>
                <Input 
                  name="title" 
                  id="title" 
                  placeholder="Напр: Senior Frontend Developer" 
                  required 
                />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel htmlFor="description">Описание вакансии</FieldLabel>
                <textarea 
                  name="description" 
                  id="description" 
                  placeholder="Задачи, требования и условия..." 
                  className="min-h-[120px] resize-none border-1 p-3 rounded-[8px]"
                  required
                />
              </Field>

              {/* Секция стадий */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Layers className="h-4 w-4 text-primary" />
                    <h3>Этапы подбора</h3>
                  </div>
                  {stages.length <= 2 && (
                    <span className="text-[10px] text-orange-500 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Минимум 2 этапа
                    </span>
                  )}
                </div>
                
                <FieldDescription>
                  Добавьте этапы, которые должен пройти кандидат (минимум 2)
                </FieldDescription>

                <div className="space-y-3">
                  {stages.map((stage, index) => (
                    <div key={index} className="flex items-center gap-3 group animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                        {index + 1}
                      </div>
                      <Input
                        value={stage}
                        onChange={(e) => updateStage(index, e.target.value)}
                        placeholder="Название этапа..."
                        className="flex-1 h-10 border-border focus-visible:ring-primary"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStage(index)}
                        disabled={stages.length <= 2}
                        className="text-muted-foreground hover:text-destructive disabled:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStage}
                  className="mt-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 w-full h-10"
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить еще этап
                </Button>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
                <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
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

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}