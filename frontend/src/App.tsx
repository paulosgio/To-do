import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router'
import { SplashScreen } from '@/components/shared/SplashScreen'
import { Toaster } from '@/components/ui/sonner'
import { refreshSession } from '@/lib/api'
import { AppRoutes } from '@/routes/AppRoutes'
import { useAuthStore } from '@/stores/authStore'

export default function App() {
  const status = useAuthStore((state) => state.status)

  // Restaura a sessão ao abrir/recarregar a página usando o cookie do refresh token.
  // O StrictMode roda este efeito duas vezes em dev; refreshSession deduplica.
  useEffect(() => {
    refreshSession().catch(() => useAuthStore.getState().clearSession())
  }, [])

  return (
    // reducedMotion="user": respeita "reduzir movimento" do sistema operacional.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>{status === 'loading' ? <SplashScreen /> : <AppRoutes />}</BrowserRouter>
      <Toaster position="top-center" />
    </MotionConfig>
  )
}
