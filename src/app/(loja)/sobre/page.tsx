export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sobre a INT Tools</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Quem Somos</h2>
            <p>
              A <strong>INT Tools</strong> e uma empresa especializada na comercializacao de ferramentas e equipamentos de alta qualidade.
              Nosso compromisso e fornecer produtos confiaveis e duraveispara profissionais e entusiastas.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Nossa Missao</h2>
            <p>
              Oferecer as melhores solucoes em ferramentas e equipamentos, combinando qualidade, preco justo e excelente atendimento ao cliente.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Nossos Valores</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Qualidade:</strong> Produtos testados e certificados</li>
              <li><strong>Confianca:</strong> Transparencia em todas as relacoes</li>
              <li><strong>Compromisso:</strong> Entrega rapida e suporte dedicado</li>
              <li><strong>Inovacao:</strong> Sempre buscando as melhores solucoes</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Por Que Escolher a INT Tools?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Catalogo completo de ferramentas profissionais</li>
              <li>Precos competitivos</li>
              <li>Envio rapido para todo Brasil</li>
              <li>Suporte ao cliente dedicado</li>
              <li>Garantia em todos os produtos</li>
              <li>Pagamento seguro via Mercado Pago</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Fale Conosco</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> contato@inttools.com.br</p>
              <p><strong>Site:</strong> www.inttools.com.br</p>
              <p className="mt-3">Horario de atendimento: Segunda a Sexta, 9h as 18h</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
