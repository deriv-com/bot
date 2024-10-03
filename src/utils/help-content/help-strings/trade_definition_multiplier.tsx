import StaticUrl from '@/components/shared_ui/static-url';
import { Localize, localize } from '@deriv-com/translations';

export default {
    text: () => [
        localize('Use this block when you want to use multipliers as your trade type.'),
        localize('Click the multiplier drop-down menu and choose the multiplier value you want to trade with.'),
        localize('Your potential profit will be multiplied by the multiplier value you’ve chosen.'),
        <Localize
            key={0}
            i18n_default_text='To learn more about multipliers, please go to the <0>Multipliers</0> page.'
            components={[<StaticUrl key={0} className='link' href='trade-types/multiplier' />]}
        />,
    ],
};
