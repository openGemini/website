<template>
    <div
        :class="{ 'feature-card': true, hasLink: f.link }"
        v-enter-animation
        @click="onClick(f.link)"
    >
        <Icon :class="[feature.icon, 'feature-icon']"></Icon>
        <h3>{{ f.title }}</h3>
        <p>{{ f.content }}</p>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Icon from '@/components/Icon.vue';

type Feature = {
    title: string;
    content: string;
    link: string;
};

const { locale, messages } = useI18n();
const featureInfo = computed<Record<string, Feature>>(
    () => messages.value[locale.value].features as Record<string, Feature>
);

const props = defineProps<{
    feature: {
        icon: string;
        featureName: string;
    };
}>();

const f = computed<Feature>(() => featureInfo.value[props.feature.featureName]);

const onClick = (link: string) => {
    if (link) {
        window.open(link);
    }
};
</script>

<style lang="less" scoped>
.feature-card {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    border-radius: 20px;
    box-shadow: @box-shadow;
    padding: 2rem;
    min-width: 200px;
    gap: 1rem;

    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;

    img {
        width: max-content;
    }
    p {
        text-align: center;
    }
    .feature-icon {
        font-size: 48px;
        color: #409eff;
        cursor: initial;
    }
}
.hasLink {
    cursor: pointer;
    &:hover {
        opacity: 0.7;
    }
    .feature-icon {
        cursor: pointer;
    }
}
</style>
