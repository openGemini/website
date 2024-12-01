<template>
    <div class="scenarios">
        <el-carousel :height="bannerHeight + 'px'" :interval="10000">
            <el-carousel-item
                class="carousel"
                v-for="scenarios in scenariosInfo"
                :key="scenarios.name"
            >
                <div class="container">
                    <div class="text">
                        <h3>{{ scenarios.title }}</h3>
                        <p>
                            {{ scenarios.content }}
                        </p>
                    </div>
                    <div class="image">
                        <img :src="scenarios.img" alt="" />
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { messages, locale } = useI18n();

const scenariosInfo = computed<any>(() => messages.value[locale.value].scenarios);

const bannerHeight = ref<number>();

onMounted(() => {
    bannerHeight.value = (window.innerWidth * 450) / 1250 + 200;
    window.addEventListener('resize', () => {
        bannerHeight.value = (window.innerWidth * 450) / 1250 + 200;
    });
});
</script>

<style lang="less" scoped>
.scenarios {
    align-self: flex-start;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-shadow: @box-shadow;
}
.carousel {
    padding: 2rem;
    box-sizing: border-box;
}
.container {
    display: flex;
    flex-direction: column;
}
.text {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1rem;
    margin-bottom: 1rem;
    h3 {
        text-align: center;
    }
}
.image {
    flex: 1;
    > img {
        width: 100%;
    }
}
</style>
