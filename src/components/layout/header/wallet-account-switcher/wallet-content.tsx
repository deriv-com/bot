import React from 'react';
import classNames from 'classnames';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
// import config from '@config';
import { Localize, localize } from '@deriv-com/translations';
// import { setAccountSwitcherId } from '@redux-store/ui-slice';
import WalletIcon from './wallet-icon';
import './wallet-icon.scss';

type TAccount = {
    account: string;
    demo_account: boolean;
    currency: string;
    balance: number;
};

type TWalletContentProps = {
    setIsAccDropdownOpen: (isOpen: boolean) => void;
    account: TAccount[];
};

const WalletContent: React.FC<TWalletContentProps> = ({ setIsAccDropdownOpen, account }) => {
    const { client } = useStore();
    const { accounts, loginid } = client;
    const { landing_company_name } = accounts[loginid];
    const { activeLoginid } = useApiBase();

    const onChangeAccount = (id: string) => {
        if (id && activeLoginid && id !== activeLoginid) {
            // setAccountSwitcherId(id);
            setIsAccDropdownOpen(false);
        }
    };

    return (
        <div className={'account__switcher-tabs-content account__wallet-switcher-tabs-content'}>
            <div className={'account__wallet-switcher-list open'}>
                {account.map((account: TAccount) => {
                    const {
                        demo_account,
                        currency,
                        // balance
                    } = account;
                    const currency_icon = demo_account ? 'virtual' : currency?.toLowerCase() || 'unknown';
                    // const getBalance = () =>
                    //     balance.toLocaleString(undefined, {
                    //         minimumFractionDigits: config.currency_name_map[currency]?.fractional_digits ?? 2,
                    //     });

                    return (
                        <div
                            className={classNames('account__switcher-wallet-acc', {
                                'account__switcher-acc--active': loginid === account.account,
                            })}
                            key={account.account}
                            onClick={e => {
                                e.stopPropagation();
                                onChangeAccount(account.account);
                            }}
                            role='button'
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.stopPropagation();
                                    onChangeAccount(account.account);
                                }
                            }}
                        >
                            <input type='hidden' name='account_name' value={account.account} />
                            <div>
                                <div className='app-icon'>
                                    <WalletIcon
                                        currency={currency}
                                        is_virtual={!!demo_account}
                                        currency_icon={currency_icon}
                                    />
                                </div>
                            </div>
                            <div className='wallet-content'>
                                {!currency && (
                                    <span className='symbols'>
                                        <Localize i18n_default_text='No currency assigned' />
                                    </span>
                                )}
                                <Localize i18n_default_text='Deriv Apps' />
                                <div className='account__switcher-loginid'>{`${currency} ${localize('Wallet')}`}</div>
                                <span className='account__switcher-balance'>
                                    {
                                        currency
                                        // && getBalance()
                                    }
                                    <span className='symbols'>
                                        &nbsp;
                                        {currency && currency === 'UST' ? 'USDT' : account?.currency}
                                    </span>
                                </span>
                            </div>
                            {!!demo_account && (
                                <span
                                    className={classNames('dc-badge', {
                                        'dc-badge--blue': !!demo_account,
                                        'dc-badge--bordered': !demo_account,
                                    })}
                                >
                                    <Localize i18n_default_text='Demo' />
                                </span>
                            )}
                            {landing_company_name === 'maltainvest' && <span>malta</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WalletContent;
