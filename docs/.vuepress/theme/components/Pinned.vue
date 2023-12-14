<template>
    <div class="pinned">
        <PinnedContainer
            :event="event[activeEventIndex]"
            :activeEventIndex="activeEventIndex"
            :close="close"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import { EventInfo } from '@/types';
import PinnedContainer from './PinnedContainer.vue';

const props = defineProps<{
    event: EventInfo[];
    close: () => void;
}>();

const INTERVAL = 5 * 1000;
let eventTimer: number;
const activeEventIndex = ref(0);

const updateEvent = () => {
    window.clearTimeout(eventTimer);
    eventTimer = window.setTimeout(() => {
        activeEventIndex.value++;
        if (activeEventIndex.value >= props.event.length) {
            activeEventIndex.value = 0;
        }
        updateEvent();
    }, INTERVAL);
};

watch(
    () => props.event,
    () => {
        activeEventIndex.value = 0;
        updateEvent();
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.pinned {
    height: @navbar-height;
    position: sticky;
    top: 0;
    color: #fff;

    background: linear-gradient(
        to right,
        #fff 0%,
        @font-active-color 15%,
        @font-active-color 85%,
        #fff 100%
    );
    .pinned-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        height: 100%;
        .pinned-title {
            cursor: pointer;
            line-height: 1.5rem;
            &:hover {
                text-decoration: underline;
                text-underline-position: under;
            }
        }
        :deep(.iconfont) {
            &:hover {
                color: @font-color;
            }
        }
    }
}
</style>
