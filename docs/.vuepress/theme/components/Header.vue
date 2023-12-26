<template>
    <div class="opengemini-navigator">
        <ClientOnly>
            <Pinned v-if="showPinned" :event="pinnedEvents" :close="close" />
            <div class="container">
                <!-- screen width > 700 -->
                <div class="nav_bar">
                    <div class="logo" @click="handleSelect('/', [])">
                        <img src="../assets/images/logo.svg" alt="" width="28" height="28" />
                        <h3>openGemini</h3>
                    </div>
                    <NavBar mode="horizontal" @select="handleSelect" />
                </div>
                <!-- screen width < 700 -->
                <div class="navbar-menu">
                    <el-dropdown ref="dropdown" trigger="click" popper-class="popper">
                        <Icon class="icon-mcaidan" />
                        <template #dropdown>
                            <NavBar @select="menuSelect" />
                        </template>
                    </el-dropdown>
                    <div class="logo" @click="handleSelect('/', [])">
                        <img src="../assets/images/logo.svg" alt="" width="28" height="28" />
                    </div>
                </div>

                <div style="display: flex">
                    <el-dropdown :teleported="false" @command="languageChange">
                        <Icon class="icon-mlanguage" style="font-size: 20px" />
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item
                                    :command="Language.en"
                                    :class="{ active: locale === Language.en }"
                                >
                                    English
                                </el-dropdown-item>
                                <el-dropdown-item
                                    :command="Language.zh"
                                    :class="{ active: locale === Language.zh }"
                                >
                                    中文
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <Icon
                        class="icon-mgithub"
                        style="font-size: 20px; margin-left: 16px"
                        @click="jumpToGit"
                    />
                </div>
            </div>
        </ClientOnly>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useRouteLocale } from '@vuepress/client';

import { Language, Links_en, Links_zh } from '../types/enum';
import useStore from '@/pages/community/events/useStore';
import NavBar from './NavBar.vue';
import Icon from './Icon.vue';
import Pinned from './Pinned.vue';

const { locale } = useI18n();
const router = useRouter();
const routeLocale = useRouteLocale();
const route = useRoute();
const { pinnedEvents } = useStore();
const dropdown = ref();
const display = ref(true);

const Links = computed(() => (locale.value === Language.en ? Links_en : Links_zh));

const showPinned = computed(() => {
    return pinnedEvents.value.length && display.value;
});

const menuSelect = (path: string, fullPath: string[]) => {
    handleSelect(path, fullPath);
    dropdown.value.handleClose();
};
const handleSelect = (path: string, fullPath: string[]) => {
    switch (path) {
        case 'docs':
            window.open(Links.value.docs);
            break;
        case 'download':
            window.open(Links.value.release);
            break;
        default:
            const routePath = `${routeLocale.value}${fullPath.join('/')}`;
            router.push(routePath);
            break;
    }
};

const languageChange = (command: string) => {
    if (command === locale.value) {
        return;
    }
    if (command === Language.en) {
        // zh -> en
        router.push(route.fullPath.replace('/zh/', '/'));
    } else {
        // en -> zh
        router.push(`/zh${route.fullPath}`);
    }
};

const jumpToGit = () => {
    window.open(Links.value.github);
};

const close = () => (display.value = false);
</script>

<style lang="less" scoped>
.opengemini-navigator {
    box-shadow: @box-shadow;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 9;

    .container {
        height: @navbar-height;
        max-width: 1200px;
        padding: 0 40px;
        margin: 0 auto;

        display: flex;
        justify-content: space-between;
        align-items: center;

        :deep(.active) {
            color: @font-active-color;
        }
    }
}

.nav_bar {
    display: flex;
    align-items: center;
}
.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    margin-right: 1em;
}
.navbar-menu {
    display: none;
}

@media screen and (max-width: 700px) {
    .nav_bar {
        display: none;
    }
    .navbar-menu {
        display: block;
        display: flex;
        align-items: center;
        .logo {
            margin-left: 1rem;
        }
    }
}
</style>
