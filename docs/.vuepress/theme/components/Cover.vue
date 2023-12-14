<template>
    <div :class="{ cover: true, showImg: showImg }">
        <div class="cover-info" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
            <h3 class="cover-title">{{ info.title }}</h3>
            <p class="author" v-if="pageType === 'blog'">
                By {{ info.author }} / {{ (info as BlogInfo).pubDate }}
            </p>
            <p class="abstract">{{ info.abstract }}</p>
            <p v-if="pageType === 'events'" class="date">
                {{ new Date((info as EventInfo).eventDate).toUTCString() }}
            </p>
            <div class="more" v-if="hover" @click="viewMore(info.path)">
                <div class="more-button">
                    <div class="button">{{ t('blog.more') }}</div>
                    <Icon class="icon-mgengduo" style="font-size: 2rem" />
                </div>
            </div>
        </div>
        <div class="cover-image" v-if="showImg">
            <img :src="info.cover" alt="" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Icon from '@/components/Icon.vue';
import type { BlogInfo, EventInfo } from '@/types';

withDefaults(
    defineProps<{
        info: BlogInfo | EventInfo;
        showImg?: boolean;
        pageType?: 'blog' | 'events';
    }>(),
    {
        showImg: false,
        pageType: 'blog',
    }
);

const { t } = useI18n();
const router = useRouter();
const hover = ref(false);

const onMouseEnter = () => (hover.value = true);

const onMouseLeave = () => (hover.value = false);

const viewMore = (path: string) => router.push(path);
</script>

<style lang="less" scoped>
.cover {
    flex: 1;
    height: 160px;
    display: flex;
    min-width: 400px;
    max-width: 600px;
    cursor: pointer;
    box-shadow: @box-shadow;
    border-radius: 20px;
    padding: 2rem;
    overflow: hidden;
    position: relative;
}
.cover-info {
    color: @font-color-2;
    width: 100%;
    .author {
        font-size: 0.8rem;
        margin-top: 1rem;
    }
    .date {
        font-size: 0.8rem;
        margin-top: 1rem;
    }
    .abstract {
        margin-top: 1.5rem;
        line-height: 1.5rem;
        .multi-line-ellipsis(3);
    }

    .cover-title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .more {
        display: flex;
        padding: 2rem;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.45);
        justify-content: flex-end;
        align-items: center;
        color: @font-color-dark;

        .more-button {
            display: flex;
            align-items: center;

            animation: ease-in 0.5s;
            .icon-mgengduo {
                color: @font-color-dark;
            }
            .button {
                border: 1px solid @font-color-dark;
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
    }
    @keyframes ease-in {
        0% {
            opacity: 0.5;
            transform: translateX(-20px);
        }
        100% {
            opacity: 1;
            transform: translateX(0px);
        }
    }
}
.showImg {
    min-width: unset;
    max-width: unset;
    .cover-info {
        width: calc(100% - 300px);
    }
    .cover-image {
        width: 300px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}

@media screen and (max-width: 1200px) {
    .showImg {
        .cover-info {
            width: 100%;
        }
    }

    .cover-image {
        display: none;
    }
}
</style>
