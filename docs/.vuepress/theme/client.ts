import { defineClientConfig } from '@vuepress/client';
import ElementPlus, { ID_INJECTION_KEY } from 'element-plus';

import i18n from '@/locale';
import Directive from '@/directive';
import Layout from './layouts/Layout.vue';
import NotFound from './layouts/NotFound.vue';
import componentRegistor from './componentRegistor';

import './assets/styles/basic.less';
import './assets/iconfont/iconfont.css';
import 'element-plus/dist/index.css';

export default defineClientConfig({
    layouts: {
        Layout,
        404: NotFound,
    },
    enhance({ app }) {
        app.provide(ID_INJECTION_KEY, {
            prefix: 1024,
            current: 0,
        });
        componentRegistor(app);
        app.use(i18n);
        app.use(Directive);
    },
});
