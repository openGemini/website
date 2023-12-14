import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getEventData } from '@/utils/events';

const eventData = getEventData();

const ADD_COUNT = 5;
const showCount = ref(ADD_COUNT);

const addShowCount = () => {
    showCount.value += ADD_COUNT;
};

const pinnedEvents = ref([]);
const useStore = () => {
    const route = useRoute();
    const curTime = new Date().getTime();
    const locale = computed(() => {
        return route.fullPath.includes('/zh') ? 'zh' : 'en';
    });
    const totalFilterEvents = computed(() => {
        return locale.value === 'zh' ? eventData.zh : eventData.en;
    });
    const filterEvents = computed(() => {
        return totalFilterEvents.value.slice(0, showCount.value);
    });
    const notStartEvents = computed(() => {
        return filterEvents.value.filter((event) => new Date(event.eventDate).getTime() > curTime);
    });

    watch(
        () => notStartEvents,
        () => {
            const filterEvents = notStartEvents.value
                .filter((event) => event.pinned)
                .sort((a, b) => {
                    return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
                });
            pinnedEvents.value = [
                ...filterEvents.map((item) => {
                    return { ...item, endTime: new Date(item.eventDate).getTime() };
                }),
            ];
        },
        { immediate: true }
    );

    const removeEvent = (index: number) => {
        const events = [...pinnedEvents.value];
        events.splice(index, 1);
        pinnedEvents.value = events;
    };

    return {
        locale,
        filterEvents,
        totalFilterEvents,
        notStartEvents,
        pinnedEvents,
        addShowCount,
        removeEvent,
    };
};

export default useStore;
