import { fetchMarkdown } from './markdown-fetcher'
import { generateHtml } from './html-generator'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import axios from 'axios'
import dotenv from 'dotenv'
import { generateSitemap } from './sitemap-generator'
dotenv.config()

const BASE_URL = 'https://api.github.com/repos/Effect-TS/website/contents/content/src/content/docs/docs'

interface GithubContent {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url: string | null
}

const fetchGithubContents = async (url: string): Promise<GithubContent[]> => {
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GH_TOKEN && {
        Authorization: `token ${process.env.GH_TOKEN}`
      })
    }
  })
  return response.data
}

const getAllMarkdownUrls = async (baseUrl: string): Promise<string[]> => {
  const contents = await fetchGithubContents(baseUrl)
  const markdownUrls: string[] = []

  for (const content of contents) {
    if (content.type === 'dir') {
      const subContents = await getAllMarkdownUrls(`${baseUrl}/${content.name}`)
      markdownUrls.push(...subContents)
    } else if (content.type === 'file' && 
              (content.name.endsWith('.md') || content.name.endsWith('.mdx')) && 
              content.download_url) {
      markdownUrls.push(content.download_url)
    }
  }

  return markdownUrls
}

const generateDocs = async (): Promise<void> => {
  try {
    console.log('🚀 Starting documentation generation...')
    mkdirSync('dist', { recursive: true })

    const urls = await getAllMarkdownUrls(BASE_URL)
    console.log(`📚 Found ${urls.length} documentation files`)

    console.log('⬇️  Downloading documentation files...')
    const markdownContents = await Promise.all(urls.map(fetchMarkdown))

    const html = generateHtml(markdownContents)
    writeFileSync(path.join('dist', 'index.html'), html)

    // Generate sitemap
    const baseUrl = 'https://charlee-dev.github.io/effect-docs/'
    generateSitemap(baseUrl, urls)

    writeFileSync(path.join('dist', 'robots.txt'), `User-agent: *
Allow: /
Sitemap: https://charlee-dev.github.io/effect-docs/sitemap.xml`)

    console.log('\n✨ Documentation generated successfully!')
    console.log(`📊 Summary:
    - Files processed: ${urls.length}
    - Output size: ${(html.length / 1024).toFixed(2)}KB
    - Output location: ${path.resolve('dist/index.html')}
    - Sitemap generated: ${path.resolve('dist/sitemap.xml')}`)
  } catch (error) {
    console.error('❌ Error generating documentation:', error)
    process.exit(1)
  }
}

generateDocs() 