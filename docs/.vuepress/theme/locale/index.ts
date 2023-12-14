import { createI18n } from 'vue-i18n';
import { Language } from '@/types/enum';
import en from './en';
import zh from './zh';

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: localStorage.getItem('language') || Language.en,
    messages: {
        en,
        zh,
    },
});

export default i18n;
