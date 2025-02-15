import { generateHtml } from './html-generator'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'

const generateDocs = async (): Promise<void> => {
  try {
    console.log('🚀 Starting documentation generation...')
    mkdirSync('dist', { recursive: true })

    const html = await generateHtml()
    writeFileSync(path.join('dist', 'index.html'), html)

    writeFileSync(path.join('dist', 'robots.txt'), `User-agent: *
Allow: /
Sitemap: https://charlee-dev.github.io/effect-docs/sitemap.xml`)

    console.log('\n✨ Documentation generated successfully!')
    console.log(`📊 Summary:
    - Output location: ${path.resolve('dist/index.html')}`)
  } catch (error) {
    console.error('❌ Error generating documentation:', error)
    process.exit(1)
  }
}

generateDocs() 