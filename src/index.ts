import { fetchMarkdown } from './markdown-fetcher'
import { generateHtml } from './html-generator'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const BASE_URL = 'https://api.github.com/repos/Effect-TS/website/contents/content/src/content/docs/docs'

interface GithubContent {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url: string | null
}

const fetchGithubContents = async (url: string): Promise<GithubContent[]> => {
  console.log(`Fetching contents from: ${url}`)
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      })
    }
  })
  console.log(`Found ${response.data.length} items`)
  return response.data
}

const getAllMarkdownUrls = async (baseUrl: string): Promise<string[]> => {
  const contents = await fetchGithubContents(baseUrl)
  const markdownUrls: string[] = []

  for (const content of contents) {
    if (content.type === 'dir') {
      console.log(`Found directory: ${content.name}`)
      const subContents = await getAllMarkdownUrls(`${baseUrl}/${content.name}`)
      markdownUrls.push(...subContents)
    } else if (content.type === 'file' && 
              (content.name.endsWith('.md') || content.name.endsWith('.mdx')) && 
              content.download_url) {
      console.log(`Found markdown file: ${content.path}`)
      markdownUrls.push(content.download_url)
    }
  }

  return markdownUrls
}

const generateDocs = async (): Promise<void> => {
  try {
    console.log('Starting documentation generation...')
    console.log('Creating dist directory...')
    mkdirSync('dist', { recursive: true })

    console.log('Fetching markdown URLs...')
    const urls = await getAllMarkdownUrls(BASE_URL)
    console.log(`Found ${urls.length} markdown files`)

    console.log('Fetching markdown content...')
    const markdownContents = await Promise.all(
      urls.map(async (url, index) => {
        console.log(`Fetching content ${index + 1}/${urls.length}: ${url}`)
        return fetchMarkdown(url)
      })
    )

    console.log('Generating HTML...')
    const html = generateHtml(markdownContents)

    console.log('Writing output file...')
    writeFileSync(path.join('dist', 'index.html'), html)
    console.log('Documentation generated successfully!')
    console.log(`Generated HTML file size: ${(html.length / 1024).toFixed(2)}KB`)
  } catch (error) {
    console.error('Error generating documentation:', error)
    process.exit(1)
  }
}

generateDocs() 