# My personal site

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), hosted for free on GitHub Pages.

## Adding things

Everything you write lives in `src/content/`, one plain-text Markdown file per item:

| Section  | Folder                  | Notes                                                    |
|----------|-------------------------|----------------------------------------------------------|
| Blog     | `src/content/blog/`     | `title`, `date`, optional `summary`, `draft: true`       |
| Writing  | `src/content/writing/`  | Write the piece in the file, or link a PDF with `file:`  |
| Gallery  | `src/content/gallery/`  | Photo goes in `public/gallery/`, then set `image:`       |
| Training | `src/content/training/` | `distance` (number) feeds the totals                     |

Each file opens with a few settings between `---` lines. Copy an existing file and change it; the sample files explain what goes where.

Your name, intro and footer links are in `src/site.config.ts`.

## Publishing

Commit and push to the `main` branch. GitHub builds and publishes the site automatically in about a minute (see the **Actions** tab).

You can also edit files right on github.com: open a file, click the pencil icon, and commit. That publishes too.

## Previewing on your computer (optional)

Install [Node.js](https://nodejs.org) (the LTS version), then in this folder run:

```
npm install
npm run dev
```

and open http://localhost:4321. The preview refreshes as you save files.
