export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'INT Tools',
    url: 'https://www.inttools.com.br',
    logo: 'https://www.inttools.com.br/logo.png',
    description: 'Loja especializada em ferramentas profissionais e equipamentos de qualidade. Entrega para todo Brasil.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
    sameAs: [
      // Adicione suas redes sociais aqui quando tiver
      // 'https://www.facebook.com/inttools',
      // 'https://www.instagram.com/inttools',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
