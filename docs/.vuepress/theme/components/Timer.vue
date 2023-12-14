<template>
    <div class="timer">
        <div class="time-block">{{ fillZero(formatTime.d) }}</div>
        <span>{{ t('time.d') }}</span>
        <div class="time-block">{{ fillZero(formatTime.h) }}</div>
        <span>{{ t('time.h') }}</span>
        <div class="time-block">{{ fillZero(formatTime.m) }}</div>
        <span>{{ t('time.m') }}</span>
        <div class="time-block">{{ fillZero(formatTime.s) }}</div>
        <span>{{ t('time.s') }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useStore from '@/pages/community/events/useStore';

const props = defineProps<{
    activeEventIndex: number;
    endTime: number;
}>();

const { t } = useI18n();
const { removeEvent } = useStore();

let timer: number;
const formatTime = ref({ d: 0, h: 0, m: 0, s: 0 });

const updateTime = (step = 1000) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
        let time = props.endTime - Date.now();
        if (time <= 0) {
            removeEvent(props.activeEventIndex);
            return;
        }
        time = Math.floor(time / 1000);
        formatTime.value = timeFormatter(time);
        checkTime();
        updateTime();
    }, step);
};

const timeFormatter = (time: number) => {
    let t = { d: 0, h: 0, m: 0, s: 0 };
    if (time <= 0) {
        return t;
    }
    const s = time % 60;
    time = (time - s) / 60;
    t.s = s;
    if (time === 0) {
        return t;
    }
    const m = time % 60;
    time = (time - m) / 60;
    t.m = m;
    if (time === 0) {
        return t;
    }
    const h = time % 24;
    time = (time - h) / 24;
    t.h = h;
    t.d = time;
    return t;
};

const fillZero = (time: number) => time.toString().padStart(2, '0');

const checkTime = () => {
    const { d, h, m, s } = formatTime.value;
    if (d === 0 && h === 0 && m === 0 && s === 0) {
        removeEvent(props.activeEventIndex);
    }
};

watch(
    () => props.endTime,
    () => updateTime(0),
    { immediate: true }
);

// onMounted(() => {
//     updateTime(0);
// });
</script>

<style lang="less" scoped>
.timer {
    display: flex;
    gap: 0.5rem;
    color: @font-color;
    align-items: center;
    span {
        font-size: 0.8rem;
    }
    .time-block {
        height: 2rem;
        width: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 4px;
    }
}
</style>
