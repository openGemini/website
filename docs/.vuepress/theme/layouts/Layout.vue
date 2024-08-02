<template>
    <div :class="{ opengemini: true, 'font-style-en': locale === Language.en }">
        <Header />
        <div class="content">
            <Home v-if="pageData.frontmatter.home" />
            <BlogPage v-else-if="pageData.frontmatter.blogPage" />
            <BlogContent v-else-if="pageData.frontmatter.blog" />
            <EventPage v-else-if="pageData.frontmatter.eventPage" />
            <EventContent v-else-if="pageData.frontmatter.events" />
            <TCPage v-else-if="pageData.frontmatter.committer" />
            <OpenSourceStar v-else-if="pageData.frontmatter.opensource_star" />
            <Docs v-else />
        </div>
        <CNCFFooter />
    </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePageData } from '@vuepress/client';
import { useRoute } from 'vue-router';

import { Language } from '@/types/enum';
import Header from '@/components/Header.vue';
import CNCFFooter from '@/components/CNCFFooter.vue';
import Home from '@/pages/home/Home.vue';
import BlogPage from '@/pages/blog/BlogPage.vue';
import BlogContent from '@/pages/blog/BlogContent.vue';
import EventPage from '@/pages/community/events/EventPage.vue';
import EventContent from '@/pages/community/events/EventContent.vue';
import TCPage from '@/pages/community/committer/TCPage.vue';
import Docs from '@/pages/Docs.vue';
import OpenSourceStar from '@/pages/opensourcestar/OpenSourceStar.vue';

const { locale } = useI18n();
const pageData = usePageData();
const route = useRoute();
watch(
    () => route.path,
    (curRoute) => {
        const curLocale = curRoute.includes('/zh/') ? 'zh' : 'en';
        if (curLocale !== locale.value) {
            locale.value = curLocale;
        }
    },
    {
        immediate: true,
    }
);
</script>

<style lang="less" scoped>
.opengemini {
    min-height: 100%;
}
.content {
    min-height: calc(100% - @navbar-height - @footbar-height);
    box-sizing: border-box;
}
</style>
