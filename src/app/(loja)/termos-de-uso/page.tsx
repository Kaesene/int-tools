export default function TermosDeUsoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
        <p className="text-sm text-gray-500 mb-8">Ultima atualizacao: Janeiro de 2025</p>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceitacao dos Termos</h2>
            <p>Ao acessar o site INT Tools, voce concorda com estes Termos de Uso.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Cadastro e Conta</h2>
            <p>Voce e responsavel por manter a confidencialidade de sua senha e todas as atividades em sua conta.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Produtos e Precos</h2>
            <p>Precos estao sujeitos a alteracao. Reservamo-nos o direito de corrigir erros de precificacao.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Propriedade Intelectual</h2>
            <p>Todo conteudo do site e propriedade da INT Tools. Proibido copiar sem autorizacao.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Contato</h2>
            <p>Email: contato@inttools.com.br | Site: www.inttools.com.br</p>
          </section>
        </div>
      </div>
    </div>
  )
}
