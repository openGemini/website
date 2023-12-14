<template>
    <div class="opengemini-events">
        <div v-if="notStartEvents.length" class="not-start">
            <h3>即将开始</h3>
            <Cover
                v-for="event in notStartEvents"
                class="event-item"
                showImg
                pageType="events"
                :key="event.key"
                :info="event"
            />
        </div>
        <h3>所有活动</h3>
        <div class="event-list">
            <Cover
                v-for="event in filterEvents"
                class="event-item"
                showImg
                pageType="events"
                :key="event.key"
                :info="event"
            />
            <div v-if="filterEvents.length < totalFilterEvents.length" class="viewMore">
                <el-button @click="addShowCount">{{ t('blog.viewMore') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// import Events from './Events.vue';
import Cover from '@/components/Cover.vue';
import useStore from './useStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { filterEvents, notStartEvents, totalFilterEvents, addShowCount } = useStore();
</script>

<style lang="less" scoped>
.opengemini-events {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;

    h3 {
        margin-bottom: 2rem;
    }
    .event-item {
        margin-bottom: 2rem;
    }
    .viewMore {
        display: flex;
        justify-content: center;
    }
}
</style>
