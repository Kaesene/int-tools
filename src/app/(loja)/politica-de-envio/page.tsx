export default function PoliticaDeEnvioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Politica de Envio</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Modalidades de Envio</h2>
            <p>Trabalhamos com as seguintes transportadoras:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>PAC (Correios):</strong> Economico, prazo de 7-15 dias uteis</li>
              <li><strong>SEDEX (Correios):</strong> Expresso, prazo de 3-7 dias uteis</li>
              <li><strong>Loggi Express:</strong> Entrega rapida em grandes cidades (1-3 dias uteis)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Calculo do Frete</h2>
            <p>O frete e calculado automaticamente no checkout baseado em:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>CEP de destino</li>
              <li>Peso e dimensoes dos produtos</li>
              <li>Modalidade escolhida</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Prazo de Processamento</h2>
            <p>Apos confirmacao do pagamento, processamos o pedido em ate <strong>2 dias uteis</strong>.</p>
            <p>O prazo de entrega comeca a contar APOS o envio.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Rastreamento</h2>
            <p>Voce recebera um email com o codigo de rastreamento assim que o pedido for despachado.</p>
            <p>Acompanhe a entrega no site dos Correios ou transportadora.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Envio para Todo Brasil</h2>
            <p>Entregamos em todo territorio nacional.</p>
            <p>Para regioes remotas, o prazo pode ser estendido.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Problemas na Entrega</h2>
            <p>Se houver problemas (extravio, avaria), entre em contato imediatamente:</p>
            <p><strong>Email:</strong> contato@inttools.com.br</p>
            <p>Resolveremos com a transportadora o mais rapido possivel.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
