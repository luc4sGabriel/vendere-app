// import Link from 'next/link'

// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
//       <h1 className="text-5xl font-bold text-gray-900">
//         Bem-vindo à Vendere
//       </h1>
//       <p className="text-gray-500 text-lg max-w-md">
//         Encontre os melhores produtos com os melhores preços.
//       </p>
//       <Link
//         href="/products"
//         className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg"
//       >
//         Ver produtos
//       </Link>
//     </div>
//   )
// }

import Link from 'next/link'
import { ArrowRight, ShoppingBag, Shield, Truck } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <section className="flex flex-col items-center text-center gap-6 py-20">
        <span className="text-sm font-medium text-gray-500 border border-gray-200 rounded-full px-4 py-1">
          Novo por aqui? Crie sua conta grátis
        </span>
        <h1 className="text-6xl font-bold text-gray-900 leading-tight max-w-2xl">
          Compre com <span className="underline decoration-4 underline-offset-4">simplicidade</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-md">
          Os melhores produtos com os melhores preços. Direto ao ponto.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Ver produtos
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors font-medium text-gray-700"
          >
            Criar conta
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: ShoppingBag, title: 'Catálogo completo', desc: 'Centenas de produtos em diversas categorias' },
          { icon: Shield, title: 'Compra segura', desc: 'Seus dados protegidos em todas as etapas' },
          { icon: Truck, title: 'Entrega rápida', desc: 'Receba no conforto da sua casa' }
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Icon size={20} className="text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}