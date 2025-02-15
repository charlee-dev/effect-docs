import { writeFileSync } from 'fs'
import path from 'path'

export const generateSitemap = (baseUrl: string, urls: string[]): void => {
  const today = new Date().toISOString().split('T')[0]
  const pages = urls.map(url => url.split('/').pop()?.replace('.mdx', '.html'))
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

  writeFileSync(path.join('dist', 'sitemap.xml'), sitemap)
} 