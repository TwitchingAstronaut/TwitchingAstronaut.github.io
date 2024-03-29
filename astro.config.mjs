import { defineConfig } from 'astro/config';
import astroRemark from "@astrojs/markdown-remark";
// export default defineConfig({
//     site: 'https://twitchingastronaut.github.io/',
//     markdownOptions: {
//         render: [
//             astroRemark,
//             {
//                 rehypePlugins: [
//                     "rehype-slug",
//                     [
//                         "rehype-autolink-headings",
//                         { behavior: "append"},
//                     ],
//                     [
//                         "rehype-toc",
//                         { headings: ["h1", "h2"] }
//                     ]
//                 ],
//             },],}
// });

export default /** @type {import('astro').AstroUserConfig} */ ({
    renderers: [],
    buildOptions: {
        site: 'https://twitchingastronaut.github.io/',
    },
    markdownOptions: {
      render: [
        astroRemark,
        {
          rehypePlugins: [
            'rehype-slug',
            ['rehype-autolink-headings', { behavior: 'append' }],
            ['rehype-toc', { headings: ['h1', 'h2'] }],
          ],
        },
      ],
    },
  });