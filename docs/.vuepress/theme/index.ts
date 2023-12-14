import { path } from '@vuepress/utils';
import { defaultTheme } from '@vuepress/theme-default';
import { Theme } from '@vuepress/core';

import { searchPlugin } from '@vuepress/plugin-search';
import { tocPlugin } from '@vuepress/plugin-toc';
import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links';
import pagesPlugin from './pagesPlugin';

const websiteTheme = (): Theme => {
    return {
        name: 'vuepress-theme-website',
        extends: defaultTheme(),
        clientConfigFile: path.resolve(__dirname, 'client.ts'),
        async onPrepared(app: any) {
            await app.writeTemp('foo.js', `export const foo = ${JSON.stringify(app.page)}`);
        },
        plugins: [
            tocPlugin,
            activeHeaderLinksPlugin({ offset: 60, headerLinkSelector: 'a.header-anchor' }),
            pagesPlugin,
            searchPlugin({
                locales: {
                    '/': {
                        placeholder: 'Search',
                    },
                    '/zh/': {
                        placeholder: '搜索',
                    },
                },
                isSearchable: (page) => {
                    const { path } = page;
                    return (
                        path.endsWith('.html') &&
                        (page.data.path.startsWith('/blog/') ||
                            page.data.path.startsWith('/zh/blog/'))
                    );
                },
                getExtraFields: (page) => {
                    return [
                        page.frontmatter.abstract as string,
                        ...((page.frontmatter.tags ?? []) as string[]),
                    ];
                },
            }),
        ],
    };
};

export default websiteTheme;
