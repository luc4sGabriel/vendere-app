import { LoginForm } from "@/components/shared/LoginForm";


export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Entrar</h1>
      <LoginForm />
    </div>
  )
}