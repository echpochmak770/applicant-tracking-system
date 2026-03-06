import * as z from 'zod';

// Схема для email
const EmailSchema = z
  .string()
  .min(1, { message: 'Email обязателен' })
  .email('Некорректный email');

// Схема для имени
const FirstNameSchema = z
  .string()
  .min(1, { message: 'Имя обязательно' })
  .max(50, { message: 'Имя не должно превышать 50 символов' })
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, {
    message: 'Имя может содержать только буквы, пробелы и дефисы',
  })
  .transform((val) => val.trim());

// Схема для фамилии
const LastNameSchema = z
  .string()
  .max(50, { message: 'Фамилия не должна превышать 50 символов' })
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, {
    message: 'Фамилия может содержать только буквы, пробелы и дефисы',
  })
  .transform((val) => val.trim());

// Схема для пароля
const PasswordSchema = z
  .string()
  .min(1, { message: 'Пароль обязателен' })
  .regex(/^(?=.*[A-ZА-Я])(?=.*[a-zа-я])(?=.*\d)(?=.*[!?*.]).{8,}$/, {
    message: 'Пароль должен содержать минимум 8 символов: заглавную букву, строчную букву, цифру и специальный символ (!?*.)',
  });

// Схема для пароля
const PasswordLoginSchema = z
  .string()
  .min(1, { message: 'Пароль обязателен' })

// Схема для телефона (необязательное поле)
const SimpleOptionalPhoneSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine((val) => {
    if (!val || val.trim() === '') return true;
    const digits = val.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }, { 
    message: 'Введите корректный международный номер (от 7 до 15 цифр)' 
  });

// Схема для формы входа
export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordLoginSchema,
});

// Схема для формы регистрации
export const RegisterSchema = z.object({
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
  email: EmailSchema,
  phone: SimpleOptionalPhoneSchema,
  password: PasswordSchema,
});

// Схема для формы восстановления пароля
export const ForgotSchema = z.object({
  email: EmailSchema,
});

// Типы на основе схем
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type ForgotSchemaType = z.infer<typeof ForgotSchema>;