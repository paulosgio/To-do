import { create } from 'zustand'
import type { User } from '@/types'

type AuthStatus = 'loading' | 'authenticated' | 'guest'

type AuthState = {
  user: User | null
  // Só em memória: não persistimos tokens no localStorage para não expô-los a XSS.
  accessToken: string | null
  status: AuthStatus
  setSession: (user: User, accessToken: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  status: 'loading',
  setSession: (user, accessToken) => set({ user, accessToken, status: 'authenticated' }),
  clearSession: () => set({ user: null, accessToken: null, status: 'guest' }),
}))
