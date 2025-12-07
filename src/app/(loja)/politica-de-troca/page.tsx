export default function PoliticaDeTrocaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Politica de Troca e Devolucao</h1>
        <p className="text-sm text-gray-500 mb-8">Conforme Codigo de Defesa do Consumidor (CDC)</p>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Prazo para Troca</h2>
            <p>Voce tem <strong>7 dias corridos</strong> a partir do recebimento do produto para solicitar troca ou devolucao, conforme Art. 49 do CDC.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Condicoes para Troca</h2>
            <p>O produto deve estar:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Na embalagem original</li>
              <li>Sem sinais de uso</li>
              <li>Com todos os acessorios e manuais</li>
              <li>Com nota fiscal</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Como Solicitar</h2>
            <p>Envie email para <strong>contato@inttools.com.br</strong> informando:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Numero do pedido</li>
              <li>Motivo da troca/devolucao</li>
              <li>Fotos do produto (se houver defeito)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Reembolso</h2>
            <p>O reembolso sera processado em ate <strong>10 dias uteis</strong> apos recebermos o produto de volta.</p>
            <p>O valor sera estornado na mesma forma de pagamento utilizada na compra.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Defeito de Fabricacao</h2>
            <p>Produtos com defeito de fabricacao: garantia conforme fabricante (geralmente 90 dias a 1 ano).</p>
            <p>Entre em contato imediatamente para assistencia tecnica ou troca.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Frete para Devolucao</h2>
            <p><strong>Arrependimento:</strong> Frete por conta do cliente.</p>
            <p><strong>Defeito/Erro nosso:</strong> Frete por nossa conta.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
