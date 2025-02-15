import { marked } from 'marked'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'

interface Section {
  title: string
  id: string
  content: string
  url: string
}

const generatePage = (section: Section, baseUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Effect-TS Documentation - ${section.title}. Part of the comprehensive guide for the Effect-TS library.">
    <meta name="robots" content="index, follow">
    <meta name="google-site-verification" content="TiD4HzIt_Zbv-VGlV7pQ1hNCCdFDS69LX5ESaj9PnMI" />
    <meta name="keywords" content="Effect-TS, TypeScript, Functional Programming, ${section.title}">
    <link rel="canonical" href="${baseUrl}${section.url}" />
    <title>${section.title} - Effect-TS Documentation</title>
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
      "articleSection": ${JSON.stringify([section.title])},
      "datePublished": "${new Date().toISOString().split('T')[0]}",
      "dateModified": "${new Date().toISOString().split('T')[0]}"
    }
    </script>
</head>
<body>
    <nav>
        <h2><a href="index.html">Effect-TS Documentation</a></h2>
    </nav>
    <article>
        ${section.content}
    </article>
</body>
</html>`

export const generateHtml = async (): Promise<string> => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Effect-TS Documentation - Comprehensive guide for the Effect-TS library">
    <meta name="robots" content="index, follow">
    <meta name="google-site-verification" content="TiD4HzIt_Zbv-VGlV7pQ1hNCCdFDS69LX5ESaj9PnMI" />
    <meta name="keywords" content="Effect-TS, TypeScript, Functional Programming, Documentation">
    <link rel="canonical" href="https://charlee-dev.github.io/effect-docs/" />
    <title>Effect-TS Documentation</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
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
        #loading {
            text-align: center;
            padding: 2rem;
        }
        #error {
            color: #cf222e;
            padding: 1rem;
            display: none;
        }
    </style>
</head>
<body>
    <div id="loading">Loading documentation...</div>
    <div id="error"></div>
    <div id="content"></div>

    <script>
    const API_URL = 'https://api.github.com/repos/Effect-TS/website/contents/content/src/content/docs/docs';
    
    async function fetchContent(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        return data;
    }

    async function fetchAndRenderDocs() {
        try {
            const content = await fetchContent(API_URL);
            const docs = content.filter(item => 
                item.type === 'file' && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))
            );

            const markdownPromises = docs.map(async doc => {
                const response = await fetch(doc.download_url);
                const text = await response.text();
                return { title: doc.name, content: marked(text) };
            });

            const renderedDocs = await Promise.all(markdownPromises);
            
            document.getElementById('loading').style.display = 'none';
            const contentDiv = document.getElementById('content');
            
            renderedDocs.forEach(doc => {
                const section = document.createElement('section');
                section.innerHTML = doc.content;
                contentDiv.appendChild(section);
            });
        } catch (error) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'block';
            document.getElementById('error').textContent = 
                'Error loading documentation. Please try again later.';
            console.error('Error:', error);
        }
    }

    fetchAndRenderDocs();
    </script>
</body>
</html>`
} 