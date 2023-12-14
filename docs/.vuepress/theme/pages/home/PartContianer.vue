<template>
    <div class="part">
        <h1>{{ title }}</h1>
        <hr />
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
defineProps<{ title: string }>();
</script>

<style lang="less" scoped>
h1 {
    color: @font-color-2;
}
hr {
    width: 80px;
    border: 1px solid @font-active-color;
    margin-bottom: 1.5rem;
}
.part {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    width: 100%;
}
</style>
