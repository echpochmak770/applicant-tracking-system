import { useState } from "react"
import { useNavigate, useParams } from "react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import {
  ArrowLeft,
  UserPlus,
  Upload,
  FileText,
  Phone
} from "lucide-react"

import { IMaskInput } from "react-imask"

import { useCreateApplicationMutation } from "@/api/applications/model/mutations"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function CreateApplicationPage() {
  const navigate = useNavigate()
  const { vacancyId } = useParams()

  const { mutate, isPending } = useCreateApplicationMutation()

  const [resume, setResume] = useState<File | null>(null)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setResume(file)
  }

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!vacancyId) {
    console.error("VacancyId is missing")
    return
  }

  const payload = new FormData()

  payload.append("VacancyId", vacancyId)
  payload.append("FirstName", form.firstName)
  payload.append("LastName", form.lastName)
  payload.append("Email", form.email)

  if (form.phone) {
    payload.append("Phone", form.phone)
  }

  if (!resume) {
    return
  }
  
  payload.append("ResumeFile", resume)

  mutate(payload, {
    onSuccess: () => {
      toast('Отклик создан!')
      navigate(`/vacancies/${vacancyId}/applications`)
    },
    onError: (error) => {
      console.error("Error creating application:", error)
    }
  })
}

  return (
    <div className="max-w-2xl mx-auto px-4">

      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-3 text-muted-foreground hover:text-primary h-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к откликам
      </Button>

      <Card className="border-border shadow-md bg-card">

        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <UserPlus className="h-6 w-6 text-primary" />
            Новый отклик
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6">

          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-6">

              <Field className="space-y-1.5">
                <FieldLabel>Имя</FieldLabel>
                <Input
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Иван"
                  required
                />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel>Фамилия</FieldLabel>
                <Input
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Иванов"
                  required
                />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </Field>

              <div className="space-y-1">
                <FieldLabel className="text-foreground/90 font-medium text-sm">
                  Телефон <span className="text-muted-foreground text-xs">(необязательно)</span>
                </FieldLabel>

                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />

                  <IMaskInput
                    mask="+000000000000000"
                    definitions={{ '0': /[0-9]/ }}
                    lazy
                    value={form.phone}
                    onAccept={(val) => handleChange("phone", String(val))}
                    className={cn(
                      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-10"
                    )}
                    placeholder="+1 234 567 89 00"
                    type="tel"
                  />
                </div>
              </div>

              {/* Resume upload */}

              <div className="space-y-3 pt-4 border-t border-border/50">

                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  Резюме
                </div>

                <FieldDescription>
                  Загрузите файл резюме кандидата
                </FieldDescription>

                <label className="flex items-center justify-between border border-dashed border-primary/40 rounded-lg p-4 cursor-pointer hover:bg-primary/5 transition">

                  <div className="flex items-center gap-2 text-sm">
                    <Upload className="h-4 w-4 text-primary" />
                    {resume ? resume.name : "Выбрать файл"}
                  </div>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                </label>

              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border/50">

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

            </FieldGroup>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}