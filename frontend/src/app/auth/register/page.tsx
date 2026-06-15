import { RegisterForm } from '@/components/shared/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar conta</h1>
      <RegisterForm />
    </div>
  )
}