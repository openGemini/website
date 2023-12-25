import { App } from 'vue';
import {
    ElDropdown,
    ElMenu,
    ElMenuItem,
    ElSubMenu,
    ElButton,
    ElPopover,
    ElTag,
    ElLink,
    ElCarousel,
    ElCarouselItem,
    ElEmpty,
} from 'element-plus';

const install = (app: App) => {
    app.use(ElDropdown);
    app.use(ElMenu);
    app.use(ElMenuItem);
    app.use(ElSubMenu);
    app.use(ElButton);
    app.use(ElPopover);
    app.use(ElTag);
    app.use(ElLink);
    app.use(ElCarousel);
    app.use(ElCarouselItem);
    app.use(ElEmpty);
};

export default install;
