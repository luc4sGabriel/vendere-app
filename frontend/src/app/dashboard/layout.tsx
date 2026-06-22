import Link from 'next/link'
import { LayoutDashboard, Package, Tag, ShoppingBag } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <aside className="w-56 flex-shrink-0">
        <nav className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col gap-1 sticky top-24">
          {[
            { href: '/dashboard', icon: LayoutDashboard, label: 'Visão geral' },
            { href: '/dashboard/products', icon: Package, label: 'Produtos' },
            { href: '/dashboard/categories', icon: Tag, label: 'Categorias' },
            { href: '/dashboard/orders', icon: ShoppingBag, label: 'Pedidos' }
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}