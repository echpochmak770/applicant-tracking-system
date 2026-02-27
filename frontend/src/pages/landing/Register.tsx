import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, LockKeyhole, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";

export default function RegisterPage() {
const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("auth_token", "true");
      navigate("/vacancies");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border-border shadow-xl bg-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Регистрация
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Создайте профиль компании, чтобы публиковать вакансии
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleRegister}>
            <FieldGroup>
              
              <Field>
                <FieldLabel htmlFor="name" className="text-foreground/90 font-medium">
                  Имя или название компании
                </FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    placeholder="Иван Иванов" 
                    className="pl-10 border-border focus-visible:ring-primary"
                    required
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="text-foreground/90 font-medium">
                  Электронная почта
                </FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="hr@agency.com" 
                    className="pl-10 border-border focus-visible:ring-primary"
                    required
                  />
                </div>
              </Field>

            <Field className="space-y-1">
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPass ? "text" : "password"} 
                    className="h-9 pl-10 pr-10" 
                    placeholder="Пароль"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary"
                  >
                    {showPass ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <FieldGroup className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-primary text-primary-foreground text-lg shadow-md hover:opacity-90 transition-opacity"
                >
                  Создать аккаунт
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Уже есть аккаунт?{" "}
                  <button 
                    type="button"
                    className="text-primary font-semibold hover:underline"
                    onClick={() => navigate("/auth")}
                  >
                    Войти
                  </button>
                </p>
              </FieldGroup>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}