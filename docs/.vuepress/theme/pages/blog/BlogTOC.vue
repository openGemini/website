<template>
    <div class="blog-toc">
        <Toc
            :options="{
                containerTag: 'nav',
                containerClass: 'vuepress-toc',
                listClass: 'vuepress-toc-list',
                itemClass: 'vuepress-toc-item',
                linkTag: 'RouterLink',
                linkClass: 'vuepress-toc-link',
                linkActiveClass: 'active',
                linkChildrenActiveClass: 'active',
            }"
        />
    </div>
</template>

<script lang="ts" setup>
import { PageHeader } from '@vuepress/client';
defineProps<{
    headers: PageHeader[];
}>();
</script>

<style lang="less" scoped>
.blog-toc {
    display: none;
    position: sticky;
    top: calc(@navbar-height * 2);
    font-size: 0.8rem;
    color: @font-color;

    :deep(.vuepress-toc) {
        border-left: 2px solid #eaecef;
        position: absolute;
        inset-inline-start: calc(100% + 4rem);
        width: 15rem;
        max-height: 400px;
        overflow: scroll;
        ul {
            list-style: none;
        }
        .vuepress-toc-list {
            padding-inline-start: 20px;
        }
        a {
            color: @font-color;
            line-height: 1.5rem;
            &:hover {
                color: @font-active-color;
            }
        }
        .active {
            color: @font-active-color;
            font-weight: bold;
            display: inline-block;
        }
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background-color: #eaecef;
        }
    }
}
@media screen and (min-width: 700px) {
    .blog-toc {
        display: block;
    }
}
</style>
