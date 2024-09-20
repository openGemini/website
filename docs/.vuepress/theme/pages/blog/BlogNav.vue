<template>
    <div class="blog-nav">
        <SearchBox ref="searchBox" />
        <div class="category-list">
            <div class="title">{{ t('blog.category') }}</div>
            <Select
                :select-options="categoryList"
                :value="curCategory"
                @onChange="onCategoryChange"
            />
        </div>
        <div class="recommend">
            <div class="title">{{ t('blog.recommended') }}</div>
            <el-link
                v-for="blog in recommend"
                :key="blog.key"
                type="primary"
                @click="toBlog(blog.path)"
            >
                {{ blog.title }}
            </el-link>
        </div>
        <div class="tags">
            <div class="title">{{ t('blog.hot') }}</div>
            <Select :select-options="tagInfo" :value="curTag" @onChange="onTagChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getTags } from '@/utils/blog';
import useStore from './useStore';
import { BlogCategory } from '@/types/enum';
import Select from '@/components/Select.vue';

const { t } = useI18n();

const categoryList = computed(() => {
    return [
        { label: t('category.all'), value: 'all' },
        { label: t('category.technical'), value: BlogCategory.technical },
        { label: t('category.developerStory'), value: BlogCategory.developerStory },
        { label: t('category.casePractice'), value: BlogCategory.casePractice },
        { label: t('category.community'), value: BlogCategory.community },
        { label: t('category.viewpoint'), value: BlogCategory.viewpoint },
    ];
});

const router = useRouter();
const { locale, curCategory, onCategoryChange, curTag, onTagChange, recommend } = useStore();
const tagInfo = computed(() => {
    return [{ label: t('blog.all'), value: 'all' }, ...getTags(locale.value)];
});

const toBlog = (path: string) => router.push(path);
</script>

<style lang="less" scoped>
.blog-nav {
    width: 300px;
    // margin-right: 2rem;
    :deep(.search-box) {
        width: 100%;
        margin-left: 0;

        input {
            width: 100%;
        }
    }
    .category-list {
        margin-top: 1.5rem;
        padding: 1.5rem 0;
        border-top: 1px solid @border-color;
        .title {
            margin-bottom: 1.5rem;
        }
    }
    .recommend {
        padding: 1.5rem 0;
        border-top: 1px solid @border-color;
        line-height: 2rem;
        :deep(.el-link) {
            font-size: 1rem;
        }
    }
    .tags {
        border-top: 1px solid @border-color;
        padding: 1.5rem 0;
        .title {
            margin-bottom: 1.5rem;
        }
    }
}
.blog-nav {
    --search-accent-color: @font-active-color;
}
</style>
