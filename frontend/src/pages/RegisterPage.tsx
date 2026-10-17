import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { FormAlert } from '@/components/shared/FormAlert'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthLayout } from '@/layouts/AuthLayout'
import { getErrorMessage } from '@/lib/errors'
import { authService } from '@/services/auth'
import { useAuthStore } from '@/stores/authStore'

// Espelha registerSchema do backend, mais a confirmação de senha (só no cliente).
const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'O nome deve ter ao menos 2 caracteres').max(80, 'Nome muito longo'),
    email: z.string().trim().min(1, 'Informe o e-mail').pipe(z.email('E-mail inválido')),
    password: z
      .string()
      .min(8, 'A senha deve ter ao menos 8 caracteres')
      .max(72, 'A senha deve ter no máximo 72 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  async function onSubmit({ name, email, password }: RegisterValues) {
    try {
      const session = await authService.register({ name, email, password })
      setSession(session.user, session.accessToken)
      navigate('/', { replace: true })
    } catch (error) {
      setError('root', { message: getErrorMessage(error) })
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      description="Leva menos de um minuto."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <FormAlert message={errors.root?.message} />

        <FormField id="name" label="Nome" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            autoFocus
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
            {...register('name')}
          />
        </FormField>

        <FormField id="email" label="E-mail" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
            {...register('email')}
          />
        </FormField>

        <FormField id="password" label="Senha" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
            {...register('password')}
          />
        </FormField>

        <FormField id="confirmPassword" label="Confirmar senha" error={errors.confirmPassword?.message}>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby="confirmPassword-error"
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
    </AuthLayout>
  )
}
