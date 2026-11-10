import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each folder in src/content/ is one section of the site.
// The fields below are what you can put at the top of each file (between the --- lines).

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.string().default('Essay'), // e.g. Essay, Paper, Report, Story
    summary: z.string().optional(),
    // Optional: a PDF or other file in public/writing/, e.g. "/writing/my-paper.pdf".
    // If set, the card links straight to the file instead of a page.
    file: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    artist: z.string().optional(),
    // Where you saw it, e.g. "Art Institute of Chicago"
    seenAt: z.string().optional(),
    date: z.coerce.date().optional(),
    // A photo in public/gallery/, e.g. "/gallery/starry-night.jpg"
    image: z.string().optional(),
  }),
});

const training = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/training' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.string().default('Run'), // e.g. Easy, Long run, Workout, Race
    distance: z.number().optional(), // in the unit set in site.config.ts
    time: z.string().optional(), // e.g. "1:42:10"
    summary: z.string().optional(),
  }),
});

export const collections = { blog, writing, gallery, training };
