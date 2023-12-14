import { Directive } from 'vue';

const OBSERVER_HANDLER = Symbol('OBSERVER_HANDLER');
type OHTMLElement = HTMLElement & {
    [OBSERVER_HANDLER]?: IntersectionObserver;
};

const EnterDirective: Directive = {
    mounted(el: OHTMLElement) {
        const intersectionObserver = new IntersectionObserver((entries) => {
            if (entries[0].intersectionRatio <= 0) return;
            el.classList.add('enter-animation');
            intersectionObserver.unobserve(el);
        });
        el[OBSERVER_HANDLER] = intersectionObserver;
        intersectionObserver.observe(el);
    },
    unmounted(el: OHTMLElement) {
        if (el?.[OBSERVER_HANDLER]) {
            el[OBSERVER_HANDLER].unobserve(el);
            delete el[OBSERVER_HANDLER];
        }
    },
};

export default EnterDirective;
