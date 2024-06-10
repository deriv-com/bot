import { Localize, localize } from '@/utils/tmp/dummy';

export const switch_to_tick_chart = {
    key: 'switch_to_tick_chart',
    header: localize('This chart display is not ideal for tick contracts'),
    message: <Localize i18n_default_text='Please change the chart duration to tick for a better trading experience.' />,
    type: 'info',
};
