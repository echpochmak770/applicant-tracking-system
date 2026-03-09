export interface RegisterDto {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export type RegisterResponse = {
    accessToken: string,
    expiresAt: string
}

export type LoginResponse = {
    message: string,
    statusCode?: number
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: 'Recruiter' | 'Admin'; 
}