import { api } from './api'

export interface LoginResponse {
  access_token: string
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  localStorage.setItem('token', data.access_token)
  return data.access_token
}
