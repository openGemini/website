<template>
    <div class="opensource-star">
        <h3 class="title">{{ t('opensource_star.title') }}</h3>
        <div class="year" v-for="sInfo in starInfo">
            <h4>{{ sInfo.year }}{{ lang === 'zh' ? '年' : '' }}</h4>
            <div class="members">
                <div class="member" v-for="m in sInfo.members">
                    <img :src="m.img" alt="" :style="{ objectPosition: 'top' }" />
                    <p class="name">{{ lang === 'en' ? m.name_en : m.name }}</p>
                    <p class="intro">{{ lang === 'en' ? m.intro_en : m.intro }}</p>
                </div>
            </div>
            <p>
                <a href="https://mp.weixin.qq.com/s/OBua8YQcdDRkolWkkUpIQg" target="_blank">{{
                    t('opensource_star.link')
                }}</a>
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { usePageLang } from '@vuepress/client';
import { useI18n } from 'vue-i18n';

import { starInfo } from './starInfo';

const pageLang = usePageLang();
const { t } = useI18n();

const lang = computed(() => (pageLang.value === 'zh-CN' ? 'zh' : 'en'));
// const title;
</script>

<style>
html[data-theme='light'] {
    --tc-bg-color: rgb(245, 246, 248);
}
html[data-theme='dark'] {
    --tc-bg-color: #282828;
}
</style>
<style lang="less" scoped>
.opensource-star {
    max-width: 1200px;
    margin: 5rem auto;
    color: @font-color;
    .title {
        text-align: center;
    }
    .members {
        margin: 32px 0;
        font-size: 0.8rem;
        display: flex;
        flex-wrap: wrap;
        gap: 16px 56px;
    }
}
h3,
h4 {
    color: #000;
}
.member {
    width: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
    a {
        color: @font-color;
    }
    img {
        width: 100px;
        min-width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        pointer-events: none;
    }
    p {
        margin: 0;
        padding: 0;
        margin-top: 4px;
    }
}
</style>
