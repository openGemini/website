import { defineClientConfig } from '@vuepress/client';
import ElementPlus from 'element-plus';

import i18n from '@/locale';
import Directive from '@/directive';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';

import './assets/styles/basic.less';
import './assets/iconfont/iconfont.css';

export default defineClientConfig({
    layouts: {
        Layout,
        404: NotFound,
    },
    enhance({ app }) {
        //@ts-ignore
        if (!__VUEPRESS_SSR__) {
            import('element-plus/es/locale/lang/zh-cn').then((module) => {
                app.use(i18n);
                app.use(Directive);
                app.use(ElementPlus, {
                    locale: module.default,
                });
            });
            import('element-plus/es/components/card/style/css');
        }
    },
});
