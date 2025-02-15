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
      "@type": "WebSite",
      "name": "Effect-TS Documentation",
      "description": "Complete guide for functional programming in TypeScript using Effect-TS",
      "url": "https://charlee-dev.github.io/effect-docs/",
      "potentialAction": {
        "@type": "ReadAction",
        "target": "https://charlee-dev.github.io/effect-docs/"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Effect-TS Documentation",
      "description": "Complete guide for functional programming in TypeScript using Effect-TS",
      "keywords": "Effect-TS, TypeScript, Functional Programming, Error Handling, Concurrency",
      "articleBody": "Comprehensive documentation for Effect-TS, covering error handling, concurrency, resource management, and more.",
      "datePublished": "${new Date().toISOString()}",
      "dateModified": "${new Date().toISOString()}"
    }
    </script>
</head>
<body>
    <div class="container">
        <div id="loading">Loading documentation...</div>
        <div id="error"></div>
        <div id="content"></div>
    </div>

    <script>
    const API_URL = 'https://api.github.com/repos/Effect-TS/website/contents/content/src/content/docs/docs';
    const GH_TOKEN = process.env.GH_TOKEN || '';

    async function fetchContent(url) {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        if (GH_TOKEN) {
            headers['Authorization'] = \`token \${GH_TOKEN}\`;
        }
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data;
    }

    async function getAllMarkdownUrls(baseUrl) {
        const content = await fetchContent(baseUrl);
        let urls = [];

        for (const item of content) {
            if (item.type === 'dir') {
                const subUrls = await getAllMarkdownUrls(item.url);
                urls = urls.concat(subUrls);
            } else if (item.type === 'file' && 
                     (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
                urls.push({
                    name: item.name,
                    path: item.path,
                    download_url: item.download_url
                });
            }
        }

        return urls;
    }

    async function fetchAndRenderDocs() {
        try {
            const loadingEl = document.getElementById('loading');
            loadingEl.textContent = 'Discovering documentation files...';

            const files = await getAllMarkdownUrls(API_URL);
            loadingEl.textContent = \`Loading \${files.length} documentation files...\`;

            const markdownPromises = files.map(async file => {
                const response = await fetch(file.download_url);
                const text = await response.text();
                
                // Simplify the ID creation to just use the filename without extension
                const id = file.name
                    .replace(/\.(md|mdx)$/, '')
                    .replace(/[^a-zA-Z0-9-]/g, '-')
                    .toLowerCase();
                
                return { 
                    title: file.name.replace(/\.(md|mdx)$/, ''),
                    path: file.path,
                    id,
                    content: window.marked.parse(text)
                };
            });

            const renderedDocs = await Promise.all(markdownPromises);
            renderedDocs.sort((a, b) => a.path.localeCompare(b.path));
            
            loadingEl.style.display = 'none';
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = '';
            contentDiv.className = 'container'; // Add the container class here
            
            // Create navigation
            const nav = document.createElement('nav');
            nav.innerHTML = '<h2>Documentation</h2><ul>' + 
                renderedDocs.map(doc => 
                    \`<li><a href="#\${doc.id}">\${doc.title}</a></li>\`
                ).join('') + '</ul>';
            
            // Create main content
            const main = document.createElement('main');
            renderedDocs.forEach(doc => {
                const section = document.createElement('section');
                section.id = doc.id;
                section.className = 'section';
                section.innerHTML = doc.content;
                main.appendChild(section);
            });

            contentDiv.appendChild(nav);
            contentDiv.appendChild(main);

            if (window.location.hash) {
                const hash = window.location.hash.substring(1); // Remove the # symbol
                const element = document.getElementById(hash);
                if (element) element.scrollIntoView();
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('loading').style.display = 'none';
            const errorEl = document.getElementById('error');
            errorEl.style.display = 'block';
            errorEl.innerHTML = \`
                <h2>Error loading documentation</h2>
                <p>There was a problem loading the documentation. Details:</p>
                <pre>\${error.message}</pre>
                <p>Please try again later or check the console for more details.</p>
            \`;
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchAndRenderDocs);
    } else {
        fetchAndRenderDocs();
    }
    </script>
</body>
</html>`

export const generateHtml = async (ghToken: string = ''): Promise<string> => {
  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Effect-TS Documentation - Complete guide for functional programming in TypeScript. Learn about error handling, concurrency, resource management, and more.">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="google-site-verification" content="TiD4HzIt_Zbv-VGlV7pQ1hNCCdFDS69LX5ESaj9PnMI" />
    <meta name="keywords" content="Effect-TS, TypeScript, Functional Programming, Error Handling, Concurrency, Resource Management, Effect System">
    <meta property="og:title" content="Effect-TS Documentation">
    <meta property="og:description" content="Complete guide for functional programming in TypeScript using Effect-TS">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://charlee-dev.github.io/effect-docs/">
    <link rel="canonical" href="https://charlee-dev.github.io/effect-docs/" />
    <title>Effect-TS Documentation - Complete TypeScript Functional Programming Guide</title>
    <script src="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js"></script>
    <style>
        :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --text-primary: #1a1a1a;
            --text-secondary: #6e7681;
            --border-color: #eaeaea;
            --link-color: #0366d6;
            --code-bg: #f6f8fa;
            --scrollbar-thumb: #d1d5db;
            --scrollbar-track: #f1f1f1;
        }

        .dark {
            --bg-primary: #0d1117;
            --bg-secondary: #161b22;
            --text-primary: #c9d1d9;
            --text-secondary: #8b949e;
            --border-color: #30363d;
            --link-color: #58a6ff;
            --code-bg: #1f2428;
            --scrollbar-thumb: #484f58;
            --scrollbar-track: #24292e;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: var(--bg-primary);
            color: var(--text-primary);
        }

        .container {
            display: grid;
            grid-template-columns: 300px 1fr;
            min-height: 100vh;
            max-width: 1400px;
            margin: 0 auto;
        }

        nav {
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
            padding: 20px;
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
        }

        nav::-webkit-scrollbar {
            width: 8px;
        }

        nav::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
        }

        nav::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        nav h2 {
            margin-top: 0;
            color: var(--text-primary);
        }

        nav ul {
            list-style: none;
            padding: 0;
        }

        nav li {
            margin: 8px 0;
        }

        nav a {
            color: var(--link-color);
            text-decoration: none;
            display: block;
            padding: 5px 0;
        }

        nav a:hover {
            text-decoration: underline;
        }

        main {
            padding: 40px;
            max-width: 800px;
        }

        .section {
            margin: 40px 0;
            scroll-margin-top: 20px;
        }

        pre {
            background-color: var(--code-bg);
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
        }

        code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            font-size: 0.9em;
            color: var(--text-primary);
        }

        h1, h2, h3, h4 {
            margin-top: 2em;
            margin-bottom: 1em;
            color: var(--text-primary);
        }

        img {
            max-width: 100%;
            height: auto;
        }

        #loading {
            text-align: center;
            padding: 2rem;
            grid-column: 1 / -1;
            color: var(--text-primary);
        }

        #error {
            color: #f85149;
            padding: 1rem;
            display: none;
            grid-column: 1 / -1;
        }

        .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            color: var(--text-primary);
            cursor: pointer;
            z-index: 1000;
        }

        .theme-toggle:hover {
            background: var(--border-color);
        }

        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
            }
            nav {
                position: relative;
                height: auto;
                border-right: none;
                border-bottom: 1px solid var(--border-color);
            }
            main {
                padding: 20px;
            }
            .theme-toggle {
                top: 10px;
                right: 10px;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>Effect-TS Documentation</h1>
        <p>Complete guide for functional programming in TypeScript</p>
    </header>
    <button class="theme-toggle" onclick="toggleTheme()">Toggle Theme</button>
    <div class="container">
        <div id="loading">Loading documentation...</div>
        <div id="error"></div>
        <div id="content">
            <article class="initial-content">
                <h1>Effect-TS Documentation</h1>
                <p>Welcome to the comprehensive guide for Effect-TS - a fully-fledged functional programming framework for TypeScript.</p>
                
                <h2>Key Topics</h2>
                <ul>
                    <li>Error Management</li>
                    <li>Concurrency</li>
                    <li>Resource Management</li>
                    <li>State Management</li>
                    <li>Testing</li>
                </ul>

                <noscript>
                    <p>This documentation requires JavaScript to be enabled. Please enable JavaScript to view the full documentation.</p>
                    <p>Alternatively, you can view the documentation directly on GitHub at: 
                       <a href="https://github.com/Effect-TS/website/tree/main/content/src/content/docs/docs">Effect-TS Docs on GitHub</a>
                    </p>
                </noscript>
            </article>
        </div>
    </div>

    <script>
    // Theme toggle functionality
    function toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    const API_URL = 'https://api.github.com/repos/Effect-TS/website/contents/content/src/content/docs/docs';
    const GH_TOKEN = '${ghToken.replace(/'/g, "\\'")}';  // Escape single quotes

    async function fetchContent(url) {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        if (GH_TOKEN) {
            headers['Authorization'] = \`token \${GH_TOKEN}\`;
        }
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data;
    }

    async function getAllMarkdownUrls(baseUrl) {
        const content = await fetchContent(baseUrl);
        let urls = [];

        for (const item of content) {
            if (item.type === 'dir') {
                const subUrls = await getAllMarkdownUrls(item.url);
                urls = urls.concat(subUrls);
            } else if (item.type === 'file' && 
                     (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
                urls.push({
                    name: item.name,
                    path: item.path,
                    download_url: item.download_url
                });
            }
        }

        return urls;
    }

    async function fetchAndRenderDocs() {
        try {
            const loadingEl = document.getElementById('loading');
            loadingEl.textContent = 'Discovering documentation files...';

            const files = await getAllMarkdownUrls(API_URL);
            loadingEl.textContent = \`Loading \${files.length} documentation files...\`;

            const markdownPromises = files.map(async file => {
                const response = await fetch(file.download_url);
                const text = await response.text();
                
                // Simplify the ID creation to just use the filename without extension
                const id = file.name
                    .replace(/\.(md|mdx)$/, '')
                    .replace(/[^a-zA-Z0-9-]/g, '-')
                    .toLowerCase();
                
                return { 
                    title: file.name.replace(/\.(md|mdx)$/, ''),
                    path: file.path,
                    id,
                    content: window.marked.parse(text)
                };
            });

            const renderedDocs = await Promise.all(markdownPromises);
            renderedDocs.sort((a, b) => a.path.localeCompare(b.path));
            
            loadingEl.style.display = 'none';
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = '';
            contentDiv.className = 'container'; // Add the container class here
            
            // Create navigation
            const nav = document.createElement('nav');
            nav.innerHTML = '<h2>Documentation</h2><ul>' + 
                renderedDocs.map(doc => 
                    \`<li><a href="#\${doc.id}">\${doc.title}</a></li>\`
                ).join('') + '</ul>';
            
            // Create main content
            const main = document.createElement('main');
            renderedDocs.forEach(doc => {
                const section = document.createElement('section');
                section.id = doc.id;
                section.className = 'section';
                section.innerHTML = doc.content;
                main.appendChild(section);
            });

            contentDiv.appendChild(nav);
            contentDiv.appendChild(main);

            if (window.location.hash) {
                const hash = window.location.hash.substring(1); // Remove the # symbol
                const element = document.getElementById(hash);
                if (element) element.scrollIntoView();
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('loading').style.display = 'none';
            const errorEl = document.getElementById('error');
            errorEl.style.display = 'block';
            errorEl.innerHTML = \`
                <h2>Error loading documentation</h2>
                <p>There was a problem loading the documentation. Details:</p>
                <pre>\${error.message}</pre>
                <p>Please try again later or check the console for more details.</p>
            \`;
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchAndRenderDocs);
    } else {
        fetchAndRenderDocs();
    }
    </script>
</body>
</html>`
} 