<template>
    <div class="pinned-container">
        <span class="pinned-title" @click="jump">{{ event.title }}</span>
        <Timer :endTime="event.endTime!" :activeEventIndex="activeEventIndex" />
        <Icon class="icon-mguanbi1" @click="close" />
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { EventInfo } from '@/types';

import Icon from './Icon.vue';
import Timer from './Timer.vue';

const props = defineProps<{
    event: EventInfo;
    activeEventIndex: number;
    close: () => void;
}>();

const router = useRouter();

const jump = () => {
    router.push(props.event.path);
};
</script>

<style lang="less" scoped></style>
