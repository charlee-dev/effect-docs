import { writeFileSync } from 'fs'
import path from 'path'

interface UrlEntry {
  url: string
  title: string
}

export const generateSitemap = (baseUrl: string, markdownUrls: string[]): void => {
  const today = new Date().toISOString().split('T')[0]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${markdownUrls.map(url => `
  <url>
    <loc>${baseUrl}#${url.split('/').pop()?.replace('.mdx', '')}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

  writeFileSync(path.join('dist', 'sitemap.xml'), sitemap)
} 