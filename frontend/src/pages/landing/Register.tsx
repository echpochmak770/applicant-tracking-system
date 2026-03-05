import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { IMaskInput } from 'react-imask';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, LockKeyhole, User, Eye, EyeOff, Phone } from "lucide-react";
import { useNavigate } from "react-router";
import { RegisterSchema, type RegisterSchemaType } from "@/schemas/auth/auth.schema";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const isButtonDisabled = isSubmitted && !isValid;

  const handleRegister = (data: RegisterSchemaType) => {
    if (isLoading) return;
    console.log('Данные формы:', data);

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
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Регистрация
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Создайте профиль компании, чтобы публиковать вакансии
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(handleRegister)} noValidate className="space-y-3">
              
            {/* Поле Имя */}
            <div>
              <FieldLabel htmlFor="name" className="text-foreground/90 font-medium text-sm">
                Имя <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  {...register('name')}
                  id="name"
                  placeholder="Иван" 
                  className={`pl-10 border-border focus-visible:ring-primary h-9 ${
                    errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
              </div>
              <div className="h-5 text-xs text-red-500 mt-0.5">
                {errors.name ? errors.name.message : ''}
              </div>
            </div>

            {/* Поле Фамилия */}
            <div>
              <FieldLabel htmlFor="surname" className="text-foreground/90 font-medium text-sm">
                Фамилия
              </FieldLabel>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  {...register('surname')}
                  id="surname"
                  placeholder="Иванов" 
                  className={`pl-10 border-border focus-visible:ring-primary h-9 ${
                    errors.surname ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  aria-invalid={errors.surname ? 'true' : 'false'}
                />
              </div>
              <div className="h-5 text-xs text-red-500 mt-0.5">
                {errors.surname ? errors.surname.message : ''}
              </div>
            </div>

            {/* Поле Email */}
            <div>
              <FieldLabel htmlFor="email" className="text-foreground/90 font-medium text-sm">
                Электронная почта <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="hr@agency.com" 
                  className={`pl-10 border-border focus-visible:ring-primary h-9 ${
                    errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              <div className="h-5 text-xs text-red-500 mt-0.5">
                {errors.email ? errors.email.message : ''}
              </div>
            </div>

            <div className="space-y-1">
              <FieldLabel htmlFor="phone" className="text-foreground/90 font-medium text-sm">
                Телефон <span className="text-muted-foreground text-xs">(необязательно)</span>
              </FieldLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: { onChange, value, onBlur, ref } }) => (
                    <IMaskInput
                      // Маска позволяет ввести "+" и до 15 цифр (максимум по стандарту)
                      mask="+000000000000000"
                      definitions={{
                        '0': /[0-9]/,
                      }}
                      lazy={true} // Маска (плюс) появится только при фокусе или вводе
                      value={value || ''}
                      unmask={false} // Сохраняем "+" в react-hook-form для соответствия схеме
                      onAccept={(val) => onChange(val)}
                      onBlur={onBlur}
                      inputRef={ref}
                      className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-10",
                        errors.phone && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder="+1 234 567 89 00"
                      id="phone"
                      type="tel"
                    />
                  )}
                />
              </div>
              <p className="h-5 text-[11px] text-red-500 mt-0.5 ml-1">
                {errors.phone?.message}
              </p>
            </div>

            {/* Поле Пароль */}
            <div>
              <FieldLabel htmlFor="password" className="text-foreground/90 font-medium text-sm">
                Пароль <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative mt-1">
                <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  {...register('password')}
                  id="password" 
                  type={showPass ? "text" : "password"} 
                  className={`pl-10 pr-10 h-9 ${
                    errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-border'
                  }`} 
                  placeholder="Пароль"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary"
                  tabIndex={-1}
                >
                  {showPass ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div className="h-5 text-xs text-red-500 mt-0.5">
                {errors.password ? errors.password.message : ''}
              </div>
            </div>

            {/* Кнопка отправки */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-10 bg-primary text-primary-foreground shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isButtonDisabled || isLoading}
              >
                {isLoading ? 'Создание...' : 'Создать аккаунт'}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground mt-3">
                Уже есть аккаунт?{" "}
                <button 
                  type="button"
                  className="text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  onClick={() => navigate("/auth")}
                >
                  Войти
                </button>
              </p>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}