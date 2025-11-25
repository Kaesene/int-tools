import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <p className="text-2xl font-medium text-gray-600 mt-4 mb-8">
          Página não encontrada
        </p>
        <p className="text-gray-500 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
