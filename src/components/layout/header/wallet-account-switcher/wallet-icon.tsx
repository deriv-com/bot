import React from 'react';
import cn from 'classnames';
import { MarketIcon } from '@/components/market/market-icon';
import { useDevice } from '@deriv-com/ui';
import './wallet-icon.scss';

type TWalletIconProps = {
    currency: string;
    is_virtual: boolean;
    currency_icon: string;
    is_menu?: boolean;
};

const WalletIcon: React.FC<TWalletIconProps> = ({ currency, is_virtual, currency_icon, is_menu = false }) => {
    const { isMobile } = useDevice();

    return (
        <div className={cn('acc-info__wallets-container', { is_menu: isMobile && is_menu })}>
            <div className='app-icon__top-icon'>
                <div className='wallet-icon'>
                    <MarketIcon type={currency_icon} />
                </div>
            </div>
            <div className={'app-icon__bottom-icon'}>
                <div
                    className={`wallet-icon wallet-icon--small wallet-icon__default-bg wallet-card__${
                        is_virtual ? 'demo' : currency.toLowerCase()
                    }-bg`}
                >
                    <MarketIcon type={currency_icon} />
                </div>
            </div>
        </div>
    );
};

export default WalletIcon;
