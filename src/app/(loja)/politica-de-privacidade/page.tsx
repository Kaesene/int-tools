export default function PoliticaDePrivacidadePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Politica de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">Ultima atualizacao: Janeiro de 2025 | Conforme LGPD (Lei 13.709/2018)</p>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Dados Coletados</h2>
            <p>Coletamos: nome, email, CPF, telefone, endereco e dados de pagamento para processar pedidos.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Uso dos Dados</h2>
            <p>Usamos seus dados para: processar pedidos, enviar atualizacoes, melhorar nossos servicos e cumprir obrigacoes legais.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Compartilhamento</h2>
            <p>Compartilhamos dados apenas com: processadores de pagamento (Mercado Pago), transportadoras (Correios, Loggi) e quando exigido por lei.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Seguranca</h2>
            <p>Utilizamos criptografia SSL e armazenamento seguro. Dados de cartao sao processados via Mercado Pago (PCI-DSS compliant).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Seus Direitos (LGPD)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar exclusao de dados</li>
              <li>Revogar consentimento</li>
              <li>Portabilidade de dados</li>
            </ul>
            <p className="mt-3">Para exercer seus direitos, envie email para: contato@inttools.com.br</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>Usamos cookies para melhorar a experiencia. Voce pode desativa-los nas configuracoes do navegador.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Retencao de Dados</h2>
            <p>Mantemos seus dados pelo tempo necessario para cumprir obrigacoes legais e fiscais (5 anos conforme legislacao brasileira).</p>
          </section>
        </div>
      </div>
    </div>
  )
}
