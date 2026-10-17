import axios from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor.'
    }
    return error.response.data?.message ?? fallback
  }
  return fallback
}
