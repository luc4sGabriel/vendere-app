import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <h1 className="text-5xl font-bold text-gray-900">
        Bem-vindo à Vendere
      </h1>
      <p className="text-gray-500 text-lg max-w-md">
        Encontre os melhores produtos com os melhores preços.
      </p>
      <Link
        href="/products"
        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg"
      >
        Ver produtos
      </Link>
    </div>
  )
}