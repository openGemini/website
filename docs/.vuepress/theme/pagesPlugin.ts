import { PluginObject, App, Page } from 'vuepress';

const pagesPlugin = (): PluginObject => {
    const name = 'vuepress-plugin-pages';
    const multiple = true;
    const onPrepared: PluginObject['onPrepared'] = (app: App) => {
        let zhBlogs: any[] = [],
            enBlogs: any[] = [],
            zhEvents: any[] = [],
            enEvents: any[] = [];
        app.pages.forEach((page) => {
            const { path } = page.data;
            if (path.endsWith('.html')) {
                if (path.startsWith('/blog/')) {
                    enBlogs.push(page);
                } else if (path.startsWith('/zh/blog/')) {
                    zhBlogs.push(page);
                } else if (path.startsWith('/community/events/')) {
                    enEvents.push(page);
                } else if (path.startsWith('/zh/community/events/')) {
                    zhEvents.push(page);
                }
            }
        });
        zhBlogs = resolveBlogPage(zhBlogs);
        enBlogs = resolveBlogPage(enBlogs);
        zhEvents = resolveEventPage(zhEvents);
        enEvents = resolveEventPage(enEvents);

        app.writeTemp(
            'pageData.js',
            `export const page = ${JSON.stringify({
                blogs: { zh: zhBlogs, en: enBlogs },
                events: { zh: zhEvents, en: enEvents },
            })}`
        );
    };
    return {
        name,
        multiple,
        onPrepared,
    };
};

const sortRules = (field: string = 'pubDate') => {
    return (a: any, b: any) => {
        if (!a[field] || !b[field]) {
            return 0;
        }
        return new Date(b[field]).getTime() - new Date(a[field]).getTime();
    };
};

const resolveBlogPage = (blogs: Page[]) => {
    return blogs
        .map((page) => {
            let tag: string[] = [];
            if (page.data.frontmatter.tag) {
                tag = (page.data.frontmatter.tag as string)
                    .split(',')
                    .filter((name) => name !== '')
                    .map((tagName) => tagName.trim());
            }

            return {
                ...page.data.frontmatter,
                tag,
                key: page.data.key,
                path: page.path,
                lang: page.lang,
            };
        })
        .sort(sortRules());
};

const resolveEventPage = (events: Page[]) => {
    return events
        .map((page) => {
            return {
                ...page.data.frontmatter,
                key: page.data.key,
                path: page.path,
            };
        })
        .sort(sortRules('eventDate'));
};

export default pagesPlugin;
