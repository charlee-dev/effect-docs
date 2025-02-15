import { marked } from 'marked'

export const generateHtml = (markdownContents: string[]): string => {
  const combinedMarkdown = markdownContents.join('\n\n---\n\n')
  const content = marked(combinedMarkdown)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Effect-TS Documentation - Comprehensive guide for the Effect-TS library">
        <meta name="robots" content="index, follow">
        <meta name="google-site-verification" content="TiD4HzIt_Zbv-VGlV7pQ1hNCCdFDS69LX5ESaj9PnMI" />
        <link rel="canonical" href="https://charlee-dev.github.io/effect-docs/" />
        <title>Effect-TS Documentation</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
                color: #1a1a1a;
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
          "description": "Comprehensive guide for the Effect-TS library",
          "author": {
            "@type": "Organization",
            "name": "Effect-TS"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Effect-TS"
          },
          "url": "https://charlee-dev.github.io/effect-docs/",
          "inLanguage": "en"
        }
        </script>
    </head>
    <body>
        ${content}
    </body>
    </html>
  `
} 