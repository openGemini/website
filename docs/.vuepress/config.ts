import { defineUserConfig, viteBundler, App } from 'vuepress';
import { path } from '@vuepress/utils';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import websiteTheme from './theme';

export default defineUserConfig({
    base: '/',
    locales: {
        '/': {
            lang: 'en-US',
            title: 'openGemini',
            description: 'openGemini website',
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'openGemini',
            description: 'openGemini',
        },
    },
    title: 'openGemini',
    description: 'openGemini website',

    head: [['link', { rel: 'icon', href: '/images/logo.png' }]],
    bundler: viteBundler({
        viteOptions: {
            plugins: [
                AutoImport({
                    resolvers: [ElementPlusResolver()],
                }),
                Components({
                    resolvers: [ElementPlusResolver()],
                }),
            ],
            resolve: {
                alias: {
                    // ...fileInThemeRoot,
                    '@': path.resolve(__dirname, './theme'),
                },
            },
            css: {
                preprocessorOptions: {
                    less: {
                        modifyVars: {
                            hack: `true; @import (reference) "${path.resolve(
                                __dirname,
                                './theme/assets/styles/variable.less'
                            )}";`,
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    }),
    plugins: [
        // tocPlugin,
        // activeHeaderLinksPlugin({ offset: 60, headerLinkSelector: 'a.header-anchor' }),
        // pagesPlugin,
        // searchPlugin({
        //     locales: {
        //         '/': {
        //             placeholder: 'Search',
        //         },
        //         '/zh/': {
        //             placeholder: '搜索',
        //         },
        //     },
        //     isSearchable: (page) => {
        //         const { path } = page;
        //         return (
        //             path.endsWith('.html') &&
        //             (page.data.path.startsWith('/blog/') || page.data.path.startsWith('/zh/blog/'))
        //         );
        //     },
        //     getExtraFields: (page) => {
        //         return [
        //             page.frontmatter.abstract as string,
        //             ...((page.frontmatter.tags ?? []) as string[]),
        //         ];
        //     },
        // }),
    ],
    theme: websiteTheme,
});
