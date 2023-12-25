import { defineUserConfig, viteBundler } from 'vuepress';
import { path } from '@vuepress/utils';

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
    theme: websiteTheme,
});
