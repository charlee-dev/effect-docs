# effect-docs

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
bash
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

## License

MIT
