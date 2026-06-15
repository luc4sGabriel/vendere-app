'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const itemCount = useCartStore(state => state.itemCount)
  const { user, clearAuth, isAuthenticated } = useAuthStore()
  const router = useRouter()

  async function handleLogout() {
    try {
      await authService.logout()
    } finally {
      clearAuth()
      router.push('/')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="text-xl font-bold text-gray-900">
          Vendere
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Produtos
          </Link>

          {isAuthenticated() && user?.role === 'ADMIN' && (
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
              title="Dashboard"
            >
              <LayoutDashboard size={20} />
            </Link>
          )}

          <Link
            href="/carrinho"
            className="relative text-gray-600 hover:text-gray-900"
            title="Carrinho"
          >
            <ShoppingCart size={20} />
            {itemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount()}
              </span>
            )}
          </Link>

          {isAuthenticated() ? (
            <div className="flex items-center gap-3">
              <Link
                href="/pedidos"
                className="text-gray-600 hover:text-gray-900"
                title={user?.name}
              >
                <User size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}