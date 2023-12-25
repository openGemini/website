// @ts-ignore
import { page } from '@temp/pageData';
import { BlogInfo } from '@/types';

// interface PageData = {}

const pages: { zh: BlogInfo[]; en: BlogInfo[] } = page.blogs;

export const getPageData = () => {
    return pages;
};

export const getTags = (locale: 'zh' | 'en') => {
    const tagMap: Record<string, number> = {};
    const count = pages[locale].length;
    for (let i = 0; i < count; i++) {
        const page = pages[locale][i];
        const tags = page.tag;
        for (let j = 0; j < tags.length; j++) {
            const tagName = tags[j].trim();
            if (tagName === '') {
                continue;
            }
            tagMap[tagName] = tagMap[tagName] ? tagMap[tagName] + 1 : 1;
        }
    }
    const tagInfo = Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1])
        .map((tag) => {
            return { label: `# ${tag[0]}(${tag[1]})`, value: tag[0] };
        });
    return tagInfo;
};
