<template>
    <div class="event-content">
        <div class="exit">
            <span @click="goBack">
                <Icon class="icon-mfanhui" />
                <span>返回列表</span>
            </span>
        </div>
        <h1 class="title">{{ metaData.title }}</h1>
        <Content />
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { usePageFrontmatter } from '@vuepress/client';
import useStore from './useStore';
import Icon from '@/components/Icon.vue';

const router = useRouter();
const { locale } = useStore();
const metaData = usePageFrontmatter();

const goBack = () => router.push(`${locale.value === 'zh' ? '/zh' : ''}/community/events`);
</script>

<style lang="less" scoped>
.event-content {
    max-width: 900px;
    margin: 5rem auto;
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
    .title {
        margin-bottom: 3rem;
        text-align: center;
    }
    :deep(img) {
        max-width: 100%;
    }
}
</style>
