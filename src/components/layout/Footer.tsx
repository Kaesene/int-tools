import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">INT TOOLS</h3>
            <p className="text-sm mb-4">
              Sua loja especializada em ferramentas profissionais e equipamentos de qualidade.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="text-white font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="hover:text-primary-500 transition-colors">
                  Sobre Nos
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-primary-500 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-primary-500 transition-colors">
                  Politica de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/politica-de-troca" className="hover:text-primary-500 transition-colors">
                  Trocas e Devolucoes
                </Link>
              </li>
              <li>
                <Link href="/politica-de-envio" className="hover:text-primary-500 transition-colors">
                  Politica de Envio
                </Link>
              </li>
            </ul>
          </div>

          {/* Minha Conta */}
          <div>
            <h4 className="text-white font-semibold mb-4">Minha Conta</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/minha-conta" className="hover:text-primary-500 transition-colors">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/minha-conta/pedidos" className="hover:text-primary-500 transition-colors">
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link href="/carrinho" className="hover:text-primary-500 transition-colors">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="hover:text-primary-500 transition-colors">
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/produtos" className="hover:text-primary-500 transition-colors">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link href="/categorias/ferramentas-manuais" className="hover:text-primary-500 transition-colors">
                  Ferramentas Manuais
                </Link>
              </li>
              <li>
                <Link href="/categorias/ferramentas-eletricas" className="hover:text-primary-500 transition-colors">
                  Ferramentas Eletricas
                </Link>
              </li>
              <li>
                <Link href="/categorias/equipamentos" className="hover:text-primary-500 transition-colors">
                  Equipamentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiMail size={16} />
                <a href="mailto:contato@inttools.com.br" className="hover:text-primary-500 transition-colors">
                  contato@inttools.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={16} />
                <span>Em breve</span>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  Marilia, SP<br />
                  Brasil
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} INT TOOLS. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
