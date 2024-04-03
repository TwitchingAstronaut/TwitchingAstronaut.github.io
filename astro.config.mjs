import { defineConfig } from 'astro/config';
import markdownConfig from './markdown.config'
import mdx from '@astrojs/mdx';
// import astroRemark from "@astrojs/markdown-remark";
export default defineConfig({
    site: 'https://twitchingastronaut.github.io/',
});
//     markdown: markdownConfig,
//     integrations: [
//     mdx({
//       ...markdownConfig,
//       extendPlugins: false,
//     }),
//   ]    
// });



// export default /** @type {import('astro').AstroUserConfig} */ ({
//     renderers: [],
//     buildOptions: {
//         site: 'https://twitchingastronaut.github.io/',
//     },
//     markdownOptions: {
//       render: [
//         astroRemark,
//         {
//           rehypePlugins: [
//             'rehype-slug',
//             ['rehype-autolink-headings', { behavior: 'append' }],
//             ['rehype-toc', { headings: ['h1', 'h2'] }],
//           ],
//         },
//       ],
//     },
//   });