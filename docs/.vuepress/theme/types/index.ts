interface PageInfo {
    key: string;
    path: string;
    lang: 'zh-CN' | 'en-US';
}
export interface BlogInfo extends PageInfo {
    title: string;
    author: string;
    pubDate: string;
    abstract: string;
    cover: string;
    category: string;
    tag: string[];
    recommend: number;
}

export interface EventInfo extends PageInfo {
    title: string;
    author?: string;
    eventDate: string;
    abstract: string;
    cover: string;
    pinned?: boolean;

    endTime?: number;
}
