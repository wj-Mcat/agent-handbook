import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import giscusHighlightsPlugin from './plugins/giscusHighlights';

const config: Config = {
  title: '《Agent Handbook》',
  tagline: 'Agent Is All You Need',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://wj-mcat.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/agent-handbook',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'wj-Mcat', // Usually your GitHub org/user name.
  projectName: 'agent handbook', // Usually your repo name.
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      giscusHighlightsPlugin,
      {
        owner: 'wj-Mcat',
        repo: 'agent-handbook',
        category: 'General',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'llms',
        path: 'llms',
        routeBasePath: 'llms',
        sidebarPath: './sidebarsLlms.ts',
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'paper-reading',
        path: 'paper-reading',
        routeBasePath: 'paper-reading',
        sidebarPath: './sidebarsPaperReading.ts',
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'weekly-paper',
        path: 'weekly-paper',
        routeBasePath: 'weekly-paper',
        sidebarPath: './sidebarsWeeklyPaper.ts',
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Agent HandBook',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          docsPluginId: 'default',
          position: 'left',
          label: 'Agent',
        },
        {
          type: 'docSidebar',
          sidebarId: 'llmsSidebar',
          docsPluginId: 'llms',
          position: 'left',
          label: 'LLMs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'paperReadingSidebar',
          docsPluginId: 'paper-reading',
          position: 'left',
          label: 'Paper Reading',
        },
        {
          type: 'docSidebar',
          sidebarId: 'weeklyPaperSidebar',
          docsPluginId: 'weekly-paper',
          position: 'left',
          label: 'Weekly Paper',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/wj-Mcat/agent-handbook',
          label: 'Github',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
