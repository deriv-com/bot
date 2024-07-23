import { useTranslations } from '@deriv-com/translations';

export type TLocalize = ReturnType<typeof useTranslations>['localize'];
