# effect-docs

A documentation viewer for Effect-TS, created entirely through AI pair programming. This project serves as a wrapper around the Effect-TS documentation to enhance its indexability by Cursor and other search engines.

## About

This project was developed through AI pair programming using Cursor's Composer. It demonstrates how AI can be used to create functional applications while solving specific problems - in this case, making Effect-TS documentation more searchable.

### Features
- Dynamic documentation fetching from Effect-TS repository
- Single-page application with client-side rendering
- Dark/light theme support
- Search engine optimized structure
- Automatic deployment to GitHub Pages
- Mobile-responsive design

> It took less then 2h to build the whole project.

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:

```bash
npm install
```

3. Create a GitHub token:
   - Go to GitHub.com → Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Select `public_repo` scope
   - Copy the generated token

4. Create `.envrc` file:

```bash
GH_TOKEN=your_GH_TOKEN_here
```

## Usage

1. Update the `BASE_URL` in `src/index.ts` to point to your documentation repository

2. Run the generator:

```bash
npm run build
```

3. The generated documentation will be available in `dist/index.html`

## GitHub Pages Deployment

The project includes a GitHub Actions workflow that automatically:
- Builds the documentation
- Deploys to GitHub Pages

To enable:
1. Go to your repository settings
2. Navigate to Pages section
3. Set the source to "GitHub Actions"

## Development

- `src/index.ts` - Main application logic
- `src/markdown-fetcher.ts` - Handles markdown file fetching
- `src/html-generator.ts` - Converts markdown to HTML

## AI Development Process

This project was created through AI pair programming, demonstrating how AI can be used to:
1. Generate initial project structure
2. Implement core functionality
3. Handle edge cases and errors
4. Add SEO optimizations
5. Implement responsive design
6. Create deployment workflows

The entire development process, including code reviews and improvements, was guided by AI, making this a showcase of modern AI-assisted development practices.

## License

MIT
