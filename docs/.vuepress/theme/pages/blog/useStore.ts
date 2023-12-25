import { toRefs, computed, reactive } from 'vue';
import { getPageData } from '@/utils/blog';
import { usePageLang } from '@vuepress/client';
import { BlogInfo } from '@/types';

const ADD_COUNT = 5;

const pageData = getPageData();

const store = reactive({
    curCategory: 'all',
    curTag: 'all',
    showCount: ADD_COUNT,
    listScroll: 0,
});

const onCategoryChange = (value: string) => {
    store.curCategory = value;
};

const onTagChange = (value: string) => {
    store.curTag = value;
};

const addShowCount = () => {
    store.showCount += ADD_COUNT;
};

const setListScroll = (scroll: number) => {
    store.listScroll = scroll;
};

const useStore = () => {
    const lang = usePageLang();
    const locale = computed(() => {
        return lang.value === 'zh-CN' ? 'zh' : 'en';
    });
    const totalFilterBlogs = computed(() => {
        let filterData = locale.value === 'zh' ? pageData.zh : pageData.en;
        //  filter category
        if (store.curCategory !== 'all') {
            filterData = filterData.filter((page) => {
                return page.category === store.curCategory;
            });
        }
        // filter tags
        if (store.curTag !== 'all') {
            filterData = filterData.filter((page) => {
                return page.tag.includes(store.curTag);
            });
        }
        return filterData;
    });
    const filterBlogs = computed(() => {
        return totalFilterBlogs.value.slice(0, store.showCount);
    });
    const pageCount = computed(() => {
        return locale.value === 'zh' ? pageData.zh.length : pageData.en.length;
    });
    const recommend = computed(() => {
        return pageData[locale.value]
            .filter((item: BlogInfo) => item.recommend)
            .sort((a, b) => b.recommend - a.recommend)
            .slice(0, 5);
    });
    return {
        ...toRefs(store),
        pageCount,
        onCategoryChange,
        onTagChange,
        filterBlogs,
        totalFilterBlogs,
        addShowCount,
        setListScroll,
        locale,
        recommend,
    };
};

export default useStore;
