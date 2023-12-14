<template>
    <div class="select-list">
        <el-button
            v-for="item in selectOptions"
            :key="item.value"
            :class="{ active: value === item.value }"
            @click="onSelect(item.value)"
        >
            {{ item.label }}
        </el-button>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    selectOptions: {
        label: string;
        value: string;
    }[];
    value: string;
}>();

const onSelect = (value: string) => {
    emit('onChange', value);
};

const emit = defineEmits<{
    (e: 'onChange', value: string): void;
}>();
</script>

<style lang="less" scoped>
.select-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    row-gap: 0.5rem;
    .active {
        background: @font-active-color;
        color: @font-color-dark;
    }
}
</style>
