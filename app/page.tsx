import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

// Mock de produtos (depois virá do banco de dados)
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Parafusadeira Elétrica Profissional 20V',
    slug: 'parafusadeira-eletrica-profissional-20v',
    description: 'Parafusadeira potente de 20V com bateria de lítio, ideal para uso profissional e doméstico.',
    shortDescription: 'Parafusadeira potente de 20V com bateria de lítio',
    price: 399.90,
    comparePrice: 599.90,
    images: ['/products/parafusadeira.jpg'],
    category: 'Ferramentas Elétricas',
    brand: 'INT Tools',
    sku: 'PAR-20V-001',
    stock: 15,
    rating: 4.8,
    reviewCount: 127,
    tags: ['elétrica', 'bateria', 'profissional'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Kit Chaves Precisão 32 Peças',
    slug: 'kit-chaves-precisao-32-pecas',
    description: 'Kit completo com 32 chaves de precisão para eletrônicos, relógios e pequenos reparos.',
    shortDescription: 'Kit completo com 32 chaves de precisão',
    price: 89.90,
    comparePrice: 149.90,
    images: ['/products/kit-chaves.jpg'],
    category: 'Ferramentas Manuais',
    brand: 'INT Tools',
    sku: 'KIT-PREC-32',
    stock: 3,
    rating: 4.6,
    reviewCount: 89,
    tags: ['precisão', 'kit', 'eletrônicos'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Multímetro Digital Profissional',
    slug: 'multimetro-digital-profissional',
    description: 'Multímetro digital com display LCD, ideal para medições de tensão, corrente e resistência.',
    shortDescription: 'Multímetro digital com display LCD',
    price: 149.90,
    images: ['/products/multimetro.jpg'],
    category: 'Equipamentos',
    brand: 'INT Tools',
    sku: 'MULT-DIG-001',
    stock: 25,
    rating: 4.9,
    reviewCount: 201,
    tags: ['medição', 'digital', 'profissional'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Pistola de Cola Quente Profissional',
    slug: 'pistola-cola-quente-profissional',
    description: 'Pistola de cola quente de alta potência, ideal para artesanato e pequenos reparos.',
    shortDescription: 'Pistola de cola quente de alta potência',
    price: 79.90,
    comparePrice: 129.90,
    images: ['/products/pistola-cola.jpg'],
    category: 'Ferramentas Elétricas',
    brand: 'INT Tools',
    sku: 'PIST-COLA-001',
    stock: 12,
    rating: 4.5,
    reviewCount: 64,
    tags: ['cola', 'artesanato', 'elétrica'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[var(--gray-900)] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-block bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
                🔥 Lançamento: Novos Produtos Importados
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Ferramentas e Tecnologia
                <span className="block text-[var(--secondary)]">de Alta Qualidade</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Importamos as melhores ferramentas profissionais e gadgets tech para você.
                Qualidade garantida, entrega rápida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/produtos">
                  <Button size="lg" variant="secondary" className="text-lg shadow-xl hover:shadow-2xl">
                    Ver Produtos
                  </Button>
                </Link>
                <Link href="/categorias">
                  <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white hover:bg-white hover:text-[var(--primary)]">
                    Explorar Categorias
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold text-[var(--secondary)]">500+</div>
                  <div className="text-sm text-gray-300">Produtos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--secondary)]">10k+</div>
                  <div className="text-sm text-gray-300">Clientes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--secondary)]">4.9★</div>
                  <div className="text-sm text-gray-300">Avaliação</div>
                </div>
              </div>
            </div>

            {/* Image/Illustration */}
            <div className="relative hidden md:block">
              <div className="relative z-10">
                <div className="absolute inset-0 bg-[var(--secondary)] blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="aspect-square bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] rounded-2xl flex items-center justify-center text-6xl">
                    🛠️
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--success)] rounded-full flex items-center justify-center">✓</div>
                        <div className="text-sm">Frete Grátis acima de R$ 299</div>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--success)] rounded-full flex items-center justify-center">✓</div>
                        <div className="text-sm">Garantia de 1 Ano</div>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--success)] rounded-full flex items-center justify-center">✓</div>
                        <div className="text-sm">Produtos Originais</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              Explore por Categoria
            </h2>
            <p className="text-lg text-[var(--gray-600)] max-w-2xl mx-auto">
              Encontre exatamente o que você precisa
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Ferramentas Manuais', icon: '🔧', color: 'from-blue-500 to-blue-600' },
              { name: 'Ferramentas Elétricas', icon: '⚡', color: 'from-orange-500 to-orange-600' },
              { name: 'Gadgets Tech', icon: '📱', color: 'from-purple-500 to-purple-600' },
              { name: 'Equipamentos', icon: '🏗️', color: 'from-green-500 to-green-600' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/categorias/${category.name.toLowerCase().replace(' ', '-')}`}
                className="group"
              >
                <div className="bg-gradient-to-br {category.color} rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="text-white font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[var(--gray-50)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
                Produtos em Destaque
              </h2>
              <p className="text-lg text-[var(--gray-600)]">
                Os mais vendidos da semana
              </p>
            </div>
            <Link href="/produtos" className="hidden md:block">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/produtos">
              <Button variant="outline" fullWidth>Ver Todos os Produtos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: '🚚',
                title: 'Frete Grátis',
                description: 'Acima de R$ 299 para todo Brasil'
              },
              {
                icon: '🔒',
                title: 'Compra Segura',
                description: 'Ambiente 100% protegido'
              },
              {
                icon: '↩️',
                title: 'Troca Grátis',
                description: 'Até 30 dias para trocar'
              },
              {
                icon: '💬',
                title: 'Suporte 24/7',
                description: 'Atendimento sempre disponível'
              },
            ].map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[var(--gray-600)]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para equipar seu projeto?
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Cadastre-se agora e ganhe 10% de desconto na primeira compra!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-gray-100">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/produtos">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary)]">
                Explorar Produtos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
