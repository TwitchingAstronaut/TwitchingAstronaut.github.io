import { defineConfig } from 'astro/config';
import remarkMermaid from 'astro-diagram/remark-mermaid';
// https://astro.build/config
export default defineConfig({
    site: 'https://twitchingastronaut.github.io/',
    markdown: {remarkPlugins: [remarkMermaid,]},
});

