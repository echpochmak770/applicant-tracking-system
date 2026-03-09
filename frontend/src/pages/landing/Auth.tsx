import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { LoginSchema, type LoginSchemaType } from "@/schemas/auth/auth.schema";
import { useLoginMutation } from "@/api/auth/model/mutations";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const isButtonDisabled = isSubmitted && !isValid;

  const handleAuth = (data: LoginSchemaType) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border shadow-lg bg-card">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-xl font-bold">Вход</CardTitle>
          <CardDescription className="text-xs">Введите данные для доступа</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(handleAuth)} noValidate className="space-y-2">
              
            {/* Email */}
            <div>
              <FieldLabel htmlFor="email" className="text-xs font-medium">
                Почта <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative mt-0.5">
                <Mail className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  {...register('email')}
                  id="email" 
                  type="email" 
                  placeholder="hr@agency.com" 
                  className={`h-8 pl-8 text-sm ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
              </div>
              <div className="h-4 text-[12px] text-red-500">
                {errors.email ? errors.email.message : ''}
              </div>
            </div>

            {/* Пароль */}
            <div>
              <FieldLabel htmlFor="password" className="text-xs font-medium">
                Пароль <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative mt-0.5">
                <LockKeyhole className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  {...register('password')}
                  id="password" 
                  placeholder="Пароль"
                  type={showPassword ? "text" : "password"} 
                  className={`h-8 pl-8 pr-8 text-sm ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="h-4 text-[12px] text-red-500">
                {errors.password ? errors.password.message : ''}
              </div>
            </div>

            <div className="pt-1">
              <Button        
                className="w-full h-8 text-sm"
                size="sm" 
                type="submit" 
                disabled={isButtonDisabled || isPending}>
                {isPending ? 'Вход...' : 'Войти'}
              </Button>
              
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[8px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground">или</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                type="button" 
                className="w-full h-8 text-sm"
                size="sm"
                onClick={() => navigate("/register")}
              >
                Создать аккаунт
              </Button>
            </div>
              
          </form>
        </CardContent>
      </Card>
    </div>
  );
}