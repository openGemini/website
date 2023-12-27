import { useRouter } from 'vue-router';
import { useRouteLocale } from '@vuepress/client';

export const useJump = () => {
    const routeLocale = useRouteLocale();
    const router = useRouter();
    const jump = (path: string, isOut = true) => {
        if (isOut) {
            window.open(path);
            return;
        }
        router.push(`${routeLocale.value}${path}`);
    };

    return { jump };
};
