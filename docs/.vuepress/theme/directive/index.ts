import { App } from 'vue';
import EnterDirective from './enter';

export default {
    install(app: App) {
        app.directive('enter-animation', EnterDirective);
    },
};
