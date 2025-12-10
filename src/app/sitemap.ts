import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.inttools.com.br'

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/termos-de-uso`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-troca`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-envio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  try {
    // Produtos dinâmicos
    const products = await prisma.product.findMany({
      where: { active: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/produtos/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...productPages]
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return staticPages
  }
}
