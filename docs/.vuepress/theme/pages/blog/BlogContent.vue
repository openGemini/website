<template>
    <div class="blog-content-container">
        <div class="blog-content">
            <div class="exit" @click="goBack">
                <span>
                    <Icon class="icon-mfanhui" />
                    <span>返回列表</span>
                </span>
            </div>
            <h1 class="blog-title">{{ metaData.title }}</h1>

            <div class="blog-meta">
                <div class="date">
                    <Icon class="icon-mrili" />
                    {{ metaData.pubDate }}
                </div>
                <span>|</span>
                <div class="date">{{ metaData.author }}</div>
            </div>
            <div class="blog-tags">
                <el-tag v-for="tag in tags" :key="tag" round type="danger"># {{ tag }}</el-tag>
            </div>
            <BlogTOC :headers="pageData.headers" />
            <blockquote>
                <p>{{ metaData.abstract }}</p>
            </blockquote>
            <Content />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { usePageFrontmatter, usePageData } from '@vuepress/client';
import useStore from './useStore';
import Icon from '@/components/Icon.vue';
import BlogTOC from './BlogTOC.vue';

const metaData = usePageFrontmatter();
const pageData = usePageData();
const router = useRouter();
const { setListScroll, locale } = useStore();

const tags = computed(() => {
    return (metaData.value.tag as string)
        .split(',')
        .filter((tag) => tag !== '')
        .map((tag) => tag.trim());
});
const goBack = () => router.push(`${locale.value === 'zh' ? '/zh' : ''}/blog`);

onBeforeRouteLeave((to) => {
    if (to.fullPath !== '/blog') {
        setListScroll(0);
    }
});
</script>

<style lang="less">
.blog-content-container {
    max-width: 1200px;
    margin: 5rem auto;
    display: flex;
    color: @font-color;
}
.blog-content {
    width: 100%;
    max-width: calc(1200px - 100px - 10rem);
    box-sizing: border-box;
    position: relative;
    padding: 0 15px;
    @media screen and (min-width: 1200px) {
      padding: 0;
    }
    > h1 {
        text-align: center;
    }
    h1,
    h2,
    h3,
    h4,
    h5 {
        margin-top: calc(0.5rem - @navbar-height);
        padding-top: calc(1rem + @navbar-height);
        &:hover {
            a.header-anchor {
                opacity: 1;
            }
        }
    }
    img {
        max-width: 100%;
    }

    a.header-anchor {
        opacity: 0;
        float: left;
        font-size: 0.85em;
        margin-left: -0.87em;
        padding-right: 0.13em;
        margin-top: 0.125em;
        user-select: none;
        color: @font-active-color;
    }
    .exit {
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
        > span {
            cursor: pointer;
            &:hover {
                color: @font-active-color;
            }
        }
    }
    .blog-tags {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    .blog-meta {
        display: flex;
        justify-content: center;
        gap: 1rem;
        color: #474762;
        .icon-mrili {
            color: #474762;
            cursor: auto;
        }
    }
    .blog-title {
        margin-bottom: 3rem;
    }
}
@media screen and (max-width: 1200px) {
    .blog-content-nav {
        display: none;
    }
}
</style>
