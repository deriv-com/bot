import { DerivLogo, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';
import './app-logo.scss';

export const AppLogo = () => {
    const { isDesktop } = useDevice();

    if (!isDesktop) return null;
    return (
        <DerivLogo
            className='app-header__logo'
            href={URLConstants.derivComProduction}
            target='_blank'
            variant='wallets'
        />
    );
};
