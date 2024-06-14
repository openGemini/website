<template>
    <el-menu :mode="mode" ref="menu" :default-active="curPage" :ellipsis="false" @select="onSelect">
        <el-menu-item index="docs">{{ t('navbar.docs') }}</el-menu-item>
        <el-menu-item index="blog">{{ t('navbar.blog') }}</el-menu-item>
        <el-menu-item index="download">{{ t('navbar.download') }}</el-menu-item>
        <el-sub-menu index="community" :teleported="false">
            <template #title>{{ t('navbar.community') }}</template>
            <el-menu-item index="events">{{ t('community.events') }}</el-menu-item>
            <el-menu-item index="committer">{{ t('community.committer') }}</el-menu-item>
            <el-menu-item index="contribution">{{ t('footer.contribution') }}</el-menu-item>
            <el-menu-item index="opensource_star">{{
                t('community.opensource_star')
            }}</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
withDefaults(
    defineProps<{
        mode?: 'horizontal' | 'vertical';
        onSelect: (path: string, fullPath: string[]) => void;
    }>(),
    {
        mode: 'vertical',
    }
);

const { t } = useI18n();
const router = useRouter();

const curPage = computed(() => {
    return router.currentRoute.value.name;
});
</script>

<style lang="less">
.el-menu--vertival {
    .el-menu-item,
    .el-sub-menu__title {
        height: 40px;
        line-height: 40px;
    }
}
.popper {
    width: 100%;
}
</style>
