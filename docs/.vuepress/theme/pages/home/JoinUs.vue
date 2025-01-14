<template>
    <div class="join-us">
        <div class="community">
            <h3>{{ t('joinUs.title') }}</h3>
            <p>{{ t('joinUs.content') }}</p>
            <div class="links">
                <span class="link" @click="jump(Links.github)">
                    <img v-if="isDark == isDarkTheme" src="@/assets/images/github-white.svg" alt=""/>
                    <img v-else src="@/assets/images/github.svg" alt=""/>
                    <span>GitHub</span>
                </span>
                <template v-if="locale === Language.en">
                    <span class="link" @click="jump(Links.twitter)">
                        <img src="@/assets/images/twitter.svg" alt="" />
                        <span>Twitter</span>
                    </span>
                    <span class="link" @click="jump(Links.slack)">
                        <img src="@/assets/images/slack.svg" alt="" style="width: 24px" />
                        <span>Slack</span>
                    </span>
                </template>
                <template v-else>
                    <WeChatQR>
                        <span class="link">
                            <img src="@/assets/images/wechat.svg" alt="" />
                            <span>公众号</span>
                        </span>
                    </WeChatQR>
                    <span class="link" @click="jump(Links.zhihu)">
                        <img src="@/assets/images/zhihu.svg" alt="" />
                        <span>知乎</span>
                    </span>
                    <span class="link" @click="jump(Links.bilibili)">
                        <img src="@/assets/images/bilibili.svg" alt="" />
                        <span>Bilibili</span>
                    </span>
                </template>
            </div>
        </div>
        <div class="docs">
            <h3>{{ t('joinUs.title2') }}</h3>
            <p>{{ t('joinUs.content2') }}</p>
            <div>
                <el-button type="primary" @click="jump('community/contribution', false)">{{
                    t('joinUs.btn')
                }}</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useJump } from '@/utils';
import { Language, Links_en, Links_zh } from '@/types/enum';
import WeChatQR from '@/components/WeChatQR.vue';
import { isDark, isDarkTheme } from "@/components/composables";

const { t, locale } = useI18n();
const { jump } = useJump();

const Links = computed(() => (locale.value === Language.en ? Links_en : Links_zh));
</script>

<style lang="less" scoped>
.join-us {
    width: 100%;
    display: flex;
    height: 205px;
    gap: 2rem;
    p {
        margin: 1.5rem 0;
    }
    h3 {
        text-align: center;
    }
}
.community {
    flex: 1;
    max-width: 600px;
    box-shadow: @box-shadow;
    padding: 1.5rem;
    box-sizing: border-box;
    :deep(.iconfont) {
        font-size: 28px;
    }

    .links {
        display: flex;
        gap: 1rem;
        .link {
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            > img {
                width: 28px;
            }
            &:hover {
                opacity: 0.7;
            }
        }
    }
}
.docs {
    flex: 1;
    height: 100%;
    box-shadow: @box-shadow;
    padding: 1.5rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    // border: 2px solid @font-active-color;
    background: url('@/assets/images/background.png');
}
</style>
