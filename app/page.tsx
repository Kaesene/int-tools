export default function Home() {
  // Produtos virão do banco de dados - por enquanto vazio
  const products = [];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Simples e Clean */}
      <section className="bg-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            INT Tools
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Ferramentas e Tecnologia Importada
          </p>
          <p className="text-gray-400">
            Em breve, novos produtos disponíveis
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Produtos
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg">
                Nenhum produto cadastrado ainda
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Use o painel administrativo para adicionar produtos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Produtos aparecerão aqui quando cadastrados */}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
