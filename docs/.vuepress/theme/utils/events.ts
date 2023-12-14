// @ts-ignore
import { page } from '@temp/pageData';
import { EventInfo } from '@/types';

export const getEventData = () => page.events as { zh: EventInfo[]; en: EventInfo[] };
