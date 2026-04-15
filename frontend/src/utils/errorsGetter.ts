export const getErrorMessage = (error: unknown): string => {
  // Если ошибка - это строка
  if (typeof error === 'string') {
    return mapEnglishToRussian(error);
  }
  
  // Для axios ошибок
  if (error && typeof error === 'object') {
    // Обработка разных форматов ответа от бэка
    if ('response' in error) {
      const axiosError = error as { 
        response?: { 
          data?: { 
            message?: string;
            error?: string;
            errors?: Record<string, string[]>;
          } 
        } 
      };
      
      // Если есть ошибки валидации по полям
      if (axiosError.response?.data?.errors) {
        const firstError = Object.values(axiosError.response.data.errors)[0]?.[0];
        if (firstError) {
          return mapEnglishToRussian(firstError);
        }
      }
      
      // Если есть message
      if (axiosError.response?.data?.message) {
        return mapEnglishToRussian(axiosError.response.data.message);
      }
      
      // Если есть error
      if (axiosError.response?.data?.error) {
        return mapEnglishToRussian(axiosError.response.data.error);
      }
    }
    
    // Для стандартных Error объектов
    if ('message' in error && typeof error.message === 'string') {
      return mapEnglishToRussian(error.message);
    }
  }
  
  return 'Произошла неизвестная ошибка';
};

// Функция маппинга английских сообщений на русские
const mapEnglishToRussian = (message: string): string => {
  const errorMap: Record<string, string> = {
    // Auth errors
    'Invalid email or password': 'Неверный email или пароль',
    'User not found': 'Пользователь не найден',
    'Email already exists': 'Пользователь с таким email уже существует',
    'Password is too weak': 'Слишком слабый пароль',
    'Invalid token': 'Недействительный токен',
    'Token expired': 'Срок действия токена истек',
    'Unauthorized': 'Неавторизованный доступ',
    'Forbidden': 'Доступ запрещен',
    
    // Validation errors
    'Email is required': 'Email обязателен',
    'Invalid email format': 'Неверный формат email',
    'Password is required': 'Пароль обязателен',
    'Password must be at least 6 characters': 'Пароль должен содержать минимум 6 символов',
    'Passwords do not match': 'Пароли не совпадают',
    
    // Vacancy errors
    'Vacancy not found': 'Вакансия не найдена',
    'You are not the creator of this vacancy': 'Вы не являетесь создателем этой вакансии',
    
    // Application errors
    'Application not found': 'Заявка не найдена',
    'Candidate already applied to this vacancy': 'Кандидат уже откликался на эту вакансию',
    
    // Server errors
    'Internal server error': 'Внутренняя ошибка сервера',
    'Service unavailable': 'Сервис временно недоступен',
    'Database error': 'Ошибка базы данных',
  };

  // Проверяем точное совпадение
  if (errorMap[message]) {
    return errorMap[message];
  }

  // Проверяем частичное совпадение (если сообщение содержит ключевые слова)
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('email') && lowerMessage.includes('exist')) {
    return 'Пользователь с таким email уже существует';
  }
  if (lowerMessage.includes('email') && lowerMessage.includes('required')) {
    return 'Email обязателен';
  }
  if (lowerMessage.includes('password') && lowerMessage.includes('required')) {
    return 'Пароль обязателен';
  }
  if (lowerMessage.includes('password') && lowerMessage.includes('min')) {
    return 'Пароль должен содержать минимум 6 символов';
  }
  if (lowerMessage.includes('not found')) {
    return 'Запись не найдена';
  }
  if (lowerMessage.includes('permission') || lowerMessage.includes('access')) {
    return 'Недостаточно прав для выполнения операции';
  }

  // Если ничего не нашли, возвращаем оригинал с пометкой (или можно заглушку)
  console.warn('Unmapped error message:', message);
  return message; // или можно вернуть 'Произошла ошибка'
};