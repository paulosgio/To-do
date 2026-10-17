import axios, { type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api'

export type SessionResponse = { user: User; accessToken: string }

export const api = axios.create({ baseURL, withCredentials: true })

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<SessionResponse> | null = null

/**
 * Troca o refresh token (cookie httpOnly) por um novo access token.
 *
 * - Na mesma aba: chamadas simultâneas compartilham a mesma promise, então
 *   N requisições com 401 geram um único refresh.
 * - Entre abas: o Web Locks API serializa os refreshes. Sem isso, duas abas
 *   enviariam o mesmo refresh token e o servidor entenderia como reuso,
 *   encerrando todas as sessões.
 */
export function refreshSession(): Promise<SessionResponse> {
  refreshPromise ??= runExclusive('auth-refresh', async () => {
    // axios "puro" para não passar pelos interceptors desta instância.
    const { data } = await axios.post<SessionResponse>(`${baseURL}/auth/refresh`, null, {
      withCredentials: true,
    })
    useAuthStore.getState().setSession(data.user, data.accessToken)
    return data
  }).finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

function runExclusive<T>(name: string, task: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && 'locks' in navigator) {
    return navigator.locks.request(name, task)
  }
  return task()
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// Nestas rotas um 401 é a resposta final (ex.: senha errada), não um token expirado.
const NO_REFRESH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      throw error
    }

    const original = error.config as RetriableConfig
    if (original._retry || NO_REFRESH_ENDPOINTS.some((url) => original.url?.endsWith(url))) {
      throw error
    }
    original._retry = true

    // Se outra requisição já renovou o token enquanto esta estava em voo,
    // basta repetir com o token atual, sem gastar mais um refresh.
    const sentToken = original.headers.Authorization
    const currentToken = useAuthStore.getState().accessToken
    if (currentToken && sentToken !== `Bearer ${currentToken}`) {
      original.headers.Authorization = `Bearer ${currentToken}`
      return api(original)
    }

    try {
      const { accessToken } = await refreshSession()
      original.headers.Authorization = `Bearer ${accessToken}`
      return api(original)
    } catch (refreshError) {
      if (useAuthStore.getState().status === 'authenticated') {
        toast.error('Sua sessão expirou. Faça login novamente.')
      }
      useAuthStore.getState().clearSession()
      throw refreshError
    }
  },
)
