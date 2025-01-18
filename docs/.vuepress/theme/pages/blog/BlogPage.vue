<template>
    <div class="opengemini-blog">
        <BlogNav />
        <div class="blog-list">
            <Cover v-for="blog in filterBlogs" showImg :key="blog.key" :info="blog" />
            <div v-if="filterBlogs.length < totalFilterBlogs.length" class="viewMore">
                <el-button @click="loadMore">{{ t('blog.viewMore') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import useStore from './useStore';
import BlogNav from './BlogNav.vue';
import Cover from '@/components/Cover.vue';

const { totalFilterBlogs, filterBlogs, listScroll, addShowCount, setListScroll } = useStore();
const { t } = useI18n();

const loadMore = () => addShowCount();

onBeforeRouteLeave((to) => {
    if (typeof window !== 'undefined') {
        if (to.fullPath.startsWith('/blog/') && to.fullPath.endsWith('.html')) {
            setListScroll(document.documentElement.scrollTop);
        } else {
            setListScroll(0);
        }
    }
});
onMounted(() => {
    if (typeof window !== 'undefined') {
        setTimeout(() => {
            document.documentElement.scrollTop = listScroll.value;
        }, 0);
    }
});
</script>

<style lang="less" scoped>
.opengemini-blog {
    max-width: 1200px;
    margin: 0 auto;
    padding: 15px;
    display: flex;
    @media screen and (min-width: 1200px) {
      padding: 40px;
    }
}

.blog-list {
    box-sizing: border-box;
    @media screen and (min-width: 1200px) {
      max-width: 900px;
      padding-left: 2rem;
      .cover {
        height: auto;
      }
    }
    :deep(.cover) {
        margin-bottom: 2rem;
    }
}
.viewMore {
    display: flex;
    justify-content: center;
}
@media screen and (max-width: 1024px) {
    .opengemini-blog {
        flex-direction: column;
    }
}
</style>
