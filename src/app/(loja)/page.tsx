import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiTool, FiShield, FiTruck, FiAward } from 'react-icons/fi'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ferramentas Profissionais para Seu Projeto
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Qualidade, durabilidade e os melhores preços do mercado
            </p>
            <div className="flex gap-4">
              <Link href="/produtos">
                <Button size="lg" variant="secondary">
                  Ver Produtos
                </Button>
              </Link>
              <Link href="/sobre">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTool className="text-primary-500" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Qualidade Garantida</h3>
              <p className="text-gray-600 text-sm">Produtos de marcas confiáveis</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-primary-500" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Compra Segura</h3>
              <p className="text-gray-600 text-sm">Pagamento protegido</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="text-primary-500" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Entrega Rápida</h3>
              <p className="text-gray-600 text-sm">Para todo o Brasil</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-primary-500" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Melhor Custo-Benefício</h3>
              <p className="text-gray-600 text-sm">Preços competitivos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'Ferramentas Manuais',
              'Ferramentas Elétricas',
              'Ferramentas de Jardim',
              'Equipamentos de Segurança',
              'Acessórios',
              'Medição e Nivelamento'
            ].map((category) => (
              <div
                key={category}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3"></div>
                <h3 className="font-medium text-sm">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Crie sua conta e aproveite ofertas exclusivas em ferramentas profissionais
          </p>
          <Link href="/login?mode=register">
            <Button size="lg" variant="primary">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
