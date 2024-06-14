<template>
    <div class="member">
        <img :src="info.img" alt="" :style="{ objectPosition: info.imgPosition || 'top' }" />
        <p class="name">{{ lang === 'en' ? info.enName : info.name }}</p>
        <div class="links">
            <a :href="`mailto:${info.email}`">
                <Icon class="icon-myouxiang" style="font-size: 24px; margin-right: 8px" />
            </a>
            <a :href="info.github" target="_blank">
                <Icon class="icon-mgithub" style="font-size: 24px" />
            </a>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/Icon.vue';
import { TCMember } from './TCData';
defineProps<{
    info: TCMember;
    lang: 'zh' | 'en';
}>();
</script>

<style lang="less" scoped>
.member {
    width: 100px;

    display: flex;
    flex-direction: column;
    align-items: center;
    a {
        color: @font-color;
    }
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
}
.links {
    margin-top: 8px;
}
</style>
