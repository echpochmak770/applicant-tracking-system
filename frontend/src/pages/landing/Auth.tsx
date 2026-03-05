import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("auth_token", "true");
      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border shadow-lg bg-card text-foreground">
        <CardHeader className="space-y-1 pb-4 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Вход</CardTitle>
          <CardDescription className="text-sm">Введите данные для доступа</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth}>
            <FieldGroup className="gap-3">
              <Field className="space-y-1">
                <FieldLabel htmlFor="email">Почта</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="hr@agency.com" className="h-9 pl-10" required />
                </div>
              </Field>

              <Field className="space-y-1">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password text-sm">Пароль</FieldLabel>
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    placeholder="Пароль"
                    type={showPassword ? "text" : "password"} 
                    className="h-9 pl-10 pr-10" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4" /> }
                  </button>
                </div>
              </Field>

                <FieldGroup className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-primary text-primary-foreground text-lg shadow-md hover:opacity-90 transition-opacity"
                >
                  Войти
                </Button>
                
                <div className="relative w-full py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-card px-2 text-muted-foreground">или</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full border-primary text-primary hover:bg-primary/5"
                  onClick={() => navigate("/register")}
                >
                  Создать новый аккаунт
                </Button>
              </FieldGroup>
              
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}