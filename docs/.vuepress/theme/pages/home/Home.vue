<template>
    <div class="opengemini-home">
        <div class="overview">
            <div class="left">
                <h1 class="main-title">openGemini</h1>
                <p>{{ t('overview.content') }}</p>
                <div>
                    <el-button
                        size="large"
                        type="primary"
                        style="margin-right: 2rem"
                        @click="jump(Links.docs)"
                    >
                        {{ t('overview.btn1') }}
                    </el-button>
                    <el-button size="large" type="primary" plain @click="jump(Links.github)">
                        {{ t('overview.btn2') }}
                    </el-button>
                </div>
            </div>
            <div class="right">
                <img src="@/assets/images/pic_1.svg" alt="" style="max-width: 600px" />
            </div>
        </div>
        <!-- carousel -->
        <Carousel />

        <!-- features -->
        <PartContianer class="features" :title="t('title.feature')">
            <div class="container">
                <Feature
                    v-for="feature in features"
                    :feature="feature"
                    :key="feature.featureName"
                />
            </div>
        </PartContianer>
        <!-- application scenarios -->
        <PartContianer class="scenarios-part" :title="t('title.scenarios')">
            <Scenarios />
        </PartContianer>
        <!-- blog -->
        <PartContianer class="scenarios-part" :title="t('navbar.blog')">
            <el-button size="large" type="primary" plain @click="viewMore">
                <span>{{ t('blog.viewMore') }}</span>
                <Icon class="icon-marrowRight" style="margin-left: 4px" />
            </el-button>
            <div class="blogs">
                <Cover v-for="blog in latestBlog" v-enter-animation :key="blog.key" :info="blog" />
            </div>
        </PartContianer>

        <!-- cooperator  -->
        <!-- <PartContianer class="scenarios-part" :title="t('title.cooperator')"> </PartContianer> -->
        <!-- join us -->
        <PartContianer class="scenarios-part" :title="t('title.join')">
            <JoinUs />
        </PartContianer>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePageLang, useRouteLocale } from '@vuepress/client';

import Carousel from './Carousel.vue';
import features from './features';
import { getPageData } from '@/utils/blog';
import Icon from '@/components/Icon.vue';
import PartContianer from './PartContianer.vue';
import Feature from './Feature.vue';
import Scenarios from './Scenarios.vue';
import JoinUs from './JoinUs.vue';
import Cover from '@/components/Cover.vue';
import { Links_en, Links_zh, Language } from '@/types/enum';

const { t, locale } = useI18n();
const router = useRouter();
const lang = usePageLang();
const routeLocale = useRouteLocale();
const pageData = getPageData();

const Links = computed(() => (locale.value === Language.en ? Links_en : Links_zh));

const latestBlog = computed(() => {
    const blog = lang.value === 'zh-CN' ? pageData.zh : pageData.en;

    return blog.slice(0, 4);
});

const viewMore = () => {
    router.push(`${routeLocale.value}blog`);
};

const jump = (url: string) => window.open(url);
</script>

<style lang="less" scoped>
.opengemini-home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.overview {
    display: flex;
    padding: @navbar-height 0;
    align-items: center;
    p {
        color: @font-color-2;
    }
    button {
        width: 150px;
    }
    .left {
        flex: 3;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    .right {
        flex: 2;
    }
}
.features {
    .container {
        display: flex;
        gap: 4rem;
        flex-wrap: wrap;
    }
}
.more-button {
    display: flex;
    align-items: center;
    color: @font-active-color;
    .button {
        border: 1px solid @font-active-color;
        width: 50px;
        height: 50px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &:hover {
        .button {
            background: @font-color-dark;
            color: rgba(0, 0, 0, 0.45);
        }
    }
}

.main-title {
    background: linear-gradient(120deg, @font-active-color, #096dd9 30%, #7509d9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: Arial, Helvetica, sans-serif;
}
.blogs {
    display: flex;
    flex-wrap: wrap;
    gap: 4rem;
    row-gap: 4rem;
}
@media screen and (min-width: 0) {
    .overview {
        .main-title {
            font-size: 4rem;
        }
        p {
            font-size: 1rem;
        }
        .right {
            display: none;
        }
    }
}
@media screen and (min-width: 1024px) {
    .overview {
        .main-title {
            font-size: 5rem;
        }
        p {
            font-size: 1.5rem;
        }
    }
}
@media screen and (min-width: 1200px) {
    .overview {
        .right {
            display: block;
        }
    }
}
</style>
@/utils/blog
