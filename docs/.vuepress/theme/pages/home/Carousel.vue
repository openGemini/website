<template>
    <div class="carousel-part">
        <el-carousel :height="bannerHeight + 'px'" :interval="5000">
            <el-carousel-item
                class="carousel"
                v-for="carousel in carouselInfo"
                :key="carousel.img"
                @click="jump(carousel.url)"
            >
                <div class="container">
                    <img :src="carousel.img" alt="" />
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useRouteLocale } from '@vuepress/client';

const { locale } = useI18n();
const routeLocale = useRouteLocale();
const router = useRouter();

const bannerHeight = ref<number>();

const carouselInfo = computed(() => {
    if (locale.value == 'zh') {
        return [
            { img: '/images/carousel/carousel1_zh.png', url: 'community/opensource_star' },
            { img: '/images/carousel/carousel2_zh.png', url: 'community/coConstruction.html' },
            { img: '/images/carousel/carousel3_zh.png', url: 'community/talentCultivation.html' },
            { img: '/images/carousel/carousel4_zh.png', url: 'community/events/20240917.html' },
        ];
    }
    return [
        { img: '/images/carousel/carousel1_en.png', url: 'community/opensource_star' },
        { img: '/images/carousel/carousel2_en.png', url: 'community/coConstruction.html' },
        { img: '/images/carousel/carousel3_en.png', url: 'community/talentCultivation.html' },
        { img: '/images/carousel/carousel4_en.png', url: 'community/events/20240917.html' },
    ];
});

const jump = (path: string) => {
    router.push(`${routeLocale.value}${path}`);
};
onMounted(() => {
    const w = Math.min(1450, window.innerWidth);
    bannerHeight.value = (w * 640) / 1200;
    window.addEventListener('resize', () => {
        const w = Math.min(1450, window.innerWidth);
        bannerHeight.value = (w * 640) / 1200;
    });
});
</script>

<style lang="less" scoped>
.carousel-part {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}
.carousel {
    width: 100%;
}

.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    cursor: pointer;
}
</style>
