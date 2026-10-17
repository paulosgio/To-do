import type { ReactNode } from 'react'
import { AnimatedPage } from '@/components/shared/AnimatedPage'
import { AppLogo } from '@/components/shared/AppLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type AuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-10">
      <AnimatedPage className="flex w-full max-w-sm flex-col items-center gap-6">
        <AppLogo />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        <p className="text-sm text-muted-foreground">{footer}</p>
      </AnimatedPage>
    </main>
  )
}
