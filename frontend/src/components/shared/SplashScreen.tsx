import { Loader2 } from 'lucide-react'

export function SplashScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center gap-2 text-muted-foreground" role="status">
      <Loader2 className="size-5 motion-safe:animate-spin" aria-hidden />
      <span className="text-sm">Carregando...</span>
    </div>
  )
}
