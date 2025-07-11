export interface User {
  id?: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
  phone?: string;
  address?: string;
}
