'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const [error, setError] = useState('')
  const router = useRouter()
  const setAuth = useAuthStore(state => state.setAuth)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: FormData) {
    try {
      setError('')
      const result = await authService.login(data.email, data.password)
      setAuth(result.user, result.accessToken, result.refreshToken)
      router.push('/')
    } catch {
      setError('Email ou senha incorretos')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} size="lg">
        Entrar
      </Button>

      <p className="text-sm text-center text-gray-500">
        Não tem conta?{' '}
        <Link href="/auth/register" className="text-gray-900 font-medium hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  )
}