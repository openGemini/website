<template>
    <div class="tc-page">
        <div class="card">
            <div v-for="group in committerInfo" :key="group.groupName" class="group">
                <h3 class="group-name">{{ group.groupName }}</h3>
                <h4>{{ t('committer.requirements') }}</h4>
                <ul>
                    <li v-for="requirement in group[requireName]">{{ requirement }}</li>
                </ul>
                <h4>{{ t('committer.responsibilities') }}</h4>
                <ul>
                    <li v-for="responsibility in group[responseName]">{{ responsibility }}</li>
                </ul>
                <div class="group-info">
                    <Member
                        v-for="item in group.member"
                        :lang="lang"
                        :key="item.name"
                        :info="item as TCMember"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { usePageLang } from '@vuepress/client';
// import Icon from '@/components/Icon.vue';
import Member from './Member.vue';
import { committerInfo, TCMember } from './TCData';
import { useI18n } from 'vue-i18n';
import { Language } from '@/types/enum';

const pageLang = usePageLang();
const { t, locale } = useI18n();
const requireName = computed(() => {
    return locale.value === Language.en ? 'requirements' : 'requirements_zh';
});
const responseName = computed(() => {
    return locale.value === Language.en ? 'responsibilities' : 'responsibilities_zh';
});

const lang = computed(() => (pageLang.value === 'zh-CN' ? 'zh' : 'en'));
</script>

<style>
html[data-theme='light'] {
    --tc-bg-color: rgb(245, 246, 248);
}
html[data-theme='dark'] {
    --tc-bg-color: #282828;
}
</style>
<style lang="less" scoped>
.tc-page {
    max-width: 1200px;
    margin: 5rem auto;
    color: @font-color;
    padding: 0 15px;
    @media screen and (min-width: 1200px) {
      padding: 0;
    }
}
h3,
h4 {
    color: #000;
}

.card {
    display: flex;
    flex-direction: column;
}

.group-name {
    font-size: 1.5rem;
    font-weight: bold;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
}
.group-info {
    margin: 16px 0;
    font-size: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    gap: 16px 56px;
}
.card .flex-center a {
    color: #7d32ea;
    text-decoration: none;
}
.flex-center {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    margin-bottom: 12px;
}
.flex-center .iconfont {
    margin-right: 12px;
}
</style>
