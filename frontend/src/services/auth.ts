import { api, type SessionResponse } from '@/lib/api'

export type LoginInput = { email: string; password: string }
export type RegisterInput = { name: string; email: string; password: string }

export const authService = {
  async login(input: LoginInput) {
    const { data } = await api.post<SessionResponse>('/auth/login', input)
    return data
  },

  async register(input: RegisterInput) {
    const { data } = await api.post<SessionResponse>('/auth/register', input)
    return data
  },

  async logout() {
    await api.post('/auth/logout')
  },
}
