import { marked } from 'marked'

interface Section {
  title: string
  id: string
  content: string
}

export const generateHtml = async (markdownContents: string[]): Promise<string> => {
  const sections: Section[] = await Promise.all(markdownContents.map(async (content, index) => ({
    title: content.split('\n')[0].replace('#', '').trim(),
    id: `section-${index}`,
    content: await marked(content)
  })))

  const toc = sections.map(section => 
    `<li><a href="#${section.id}">${section.title}</a></li>`
  ).join('\n')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Effect-TS Documentation - Comprehensive guide for the Effect-TS library. Learn about error handling, concurrency, resource management, and more.">
        <meta name="robots" content="index, follow">
        <meta name="google-site-verification" content="TiD4HzIt_Zbv-VGlV7pQ1hNCCdFDS69LX5ESaj9PnMI" />
        <meta name="keywords" content="Effect-TS, TypeScript, Functional Programming, Error Handling, Concurrency, Resource Management">
        <link rel="canonical" href="https://charlee-dev.github.io/effect-docs/" />
        <title>Effect-TS Documentation - Complete Guide</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
                color: #1a1a1a;
            }
            nav {
                position: sticky;
                top: 20px;
                max-height: calc(100vh - 40px);
                overflow-y: auto;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            nav ul {
                list-style: none;
                padding: 0;
            }
            nav li {
                margin: 8px 0;
            }
            .section {
                margin: 40px 0;
                scroll-margin-top: 20px;
            }
            pre {
                background-color: #f6f8fa;
                padding: 16px;
                border-radius: 6px;
                overflow-x: auto;
            }
            code {
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
                font-size: 0.9em;
            }
            h1, h2, h3, h4 {
                margin-top: 2em;
                margin-bottom: 1em;
            }
            hr {
                margin: 3em 0;
                border: none;
                border-top: 1px solid #eaeaea;
            }
            a {
                color: #0366d6;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            img {
                max-width: 100%;
                height: auto;
            }
        </style>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "Effect-TS Documentation",
          "description": "Comprehensive guide for the Effect-TS library. Learn about error handling, concurrency, resource management, and more.",
          "author": {
            "@type": "Organization",
            "name": "Effect-TS"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Effect-TS"
          },
          "url": "https://charlee-dev.github.io/effect-docs/",
          "inLanguage": "en",
          "articleSection": ${JSON.stringify(sections.map(s => s.title))},
          "datePublished": "${new Date().toISOString().split('T')[0]}",
          "dateModified": "${new Date().toISOString().split('T')[0]}"
        }
        </script>
    </head>
    <body>
        <nav>
            <h2>Table of Contents</h2>
            <ul>
                ${toc}
            </ul>
        </nav>
        ${sections.map(section => `
            <section id="${section.id}" class="section">
                ${section.content}
            </section>
        `).join('\n')}
    </body>
    </html>
  `
} 