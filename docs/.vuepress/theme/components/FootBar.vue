<template>
    <footer>
        <div class="container">
            <div class="left">
                <div class="logo">
                    <img src="@/assets/images/logo.svg" alt="" />
                    <h2>openGemini</h2>
                </div>
                <div class="links">
                    <a :href="Links.github" target="_blank"><Icon class="icon-mgithub" /></a>
                    <template v-if="locale === Language.en">
                        <a :href="Links.twitter" target="_blank"><Icon class="icon-mtwitter" /></a>
                        <a :href="Links.slack" target="_blank"><Icon class="icon-mslack" /></a>
                    </template>
                    <template v-else>
                        <WeChatQR>
                            <Icon class="icon-mweixin" />
                        </WeChatQR>
                        <a :href="Links.zhihu" target="_blank"><Icon class="icon-mzhihu" /></a>
                        <a :href="Links.bilibili" target="_blank">
                            <Icon class="icon-mbilibili" />
                        </a>
                    </template>
                </div>
                <div class="email">E-mail : community.ts@opengemini.org</div>
                <div class="statement">
                    <span @click="jump('statement/privacy_statement', false)">
                        {{ t('footer.privacy') }}
                    </span>
                    <span @click="jump('statement/legal_statement', false)">
                        {{ t('footer.legal') }}
                    </span>
                </div>
            </div>
            <div class="right">
                <div class="column">
                    <h4>{{ t('footer.resources') }}</h4>
                    <div @click="jump(Links.docs)">{{ t('navbar.docs') }}</div>
                    <div @click="jump('download', false)">{{ t('navbar.download') }}</div>
                    <div @click="jump('blog', false)">{{ t('navbar.blog') }}</div>
                    <div @click="jump(Links.docker)">{{ t('footer.docker') }}</div>
                </div>
                <div class="column">
                    <h4>{{ t('footer.developer') }}</h4>
                    <div @click="jump(Links.github)">Github</div>
                    <div @click="jump(Links.contribution)">{{ t('footer.contribution') }}</div>
                    <div @click="jump(Links.introduction)">{{ t('footer.introduction') }}</div>
                </div>
                <div class="column">
                    <h4>{{ t('footer.support') }}</h4>
                    <div @click="jump('community/events', false)">{{ t('community.events') }}</div>
                </div>
            </div>
        </div>
        <div class="copy-right">Copyright @2023 OpenGemini-All Rights Reserved.</div>
    </footer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useRouteLocale } from '@vuepress/client';

import Icon from '@/components/Icon.vue';
import WeChatQR from '@/components/WeChatQR.vue';
import { Language, Links } from '@/types/enum';

const { t, locale } = useI18n();
const router = useRouter();
const routeLocale = useRouteLocale();
const jump = (path: string, isOut = true) => {
    if (isOut) {
        window.open(path);
        return;
    }
    router.push(`${routeLocale.value}${path}`);
};
</script>

<style lang="less" scoped>
footer {
    padding: 5rem 40px 2rem;
    background: #030303;
    color: @font-color-dark;
    min-height: @footbar-height;
    box-sizing: border-box;
    .container {
        margin: 0 auto;
        max-width: 1200px;
    }
    .left {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .logo {
        display: flex;
        align-items: center;
        & > img {
            width: 3rem;
            margin-right: 1rem;
        }
    }
    .links {
        display: flex;
        gap: 1rem;
        a {
            color: @font-color-dark;
            :deep(.iconfont) {
                font-size: 1.2rem;
            }
        }
    }
    .email {
        color: @font-color-dark-2;
    }

    .statement {
        display: flex;
        gap: 1rem;
        color: @font-color-dark-2;
        span {
            cursor: pointer;
            &:hover {
                color: @font-active-color;
            }
        }
    }
    .copy-right {
        color: @font-color-dark-2;
        margin-top: 2rem;
        text-align: center;
        font-size: 0.8rem;
    }

    .column {
        margin-right: 5rem;
        margin-top: 2rem;
        h4 {
            margin-bottom: 1rem;
        }
        div {
            color: @font-color-dark-2;
            margin-bottom: 0.5rem;
            cursor: pointer;
            &:hover {
                color: @font-active-color;
            }
        }
    }
}
@media screen and (min-width: 700px) {
    footer {
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        .right {
            display: flex;
        }
        .column {
            margin-right: 10rem;
        }
    }
}
</style>
