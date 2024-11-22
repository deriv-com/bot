import React, { ForwardedRef, useEffect, useRef } from 'react';
import Text from '@/components/shared_ui/text';
import { useStore } from '@/hooks/useStore';
// import config from '@config';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import WalletContent from './wallet-content';
import './account-wallet-dropdown.scss';

type TAccountWalletDropdownProps = {
    setIsAccDropdownOpen: (isOpen: boolean) => void;
};

const AccountWalletDropdown = React.forwardRef<HTMLDivElement, TAccountWalletDropdownProps>(
    ({ setIsAccDropdownOpen }, dropdownRef: ForwardedRef<HTMLDivElement>) => {
        const { client } = useStore();
        const { accounts, account_list } = client;
        const container_ref = useRef<HTMLDivElement>(null);
        let all_accounts: any[] = [];
        // const { manage_funds } = config;
        const { isMobile } = useDevice();

        const transformAccounts = () => {
            Object.keys(accounts).forEach(account => {
                all_accounts.push({ ...accounts[account], account });
            });
        };

        const sortWalletAccounts = (wallets: any[]) => {
            const accountOrder = { fiat: 1, crypto: 2, virtual: 3 };
            transformAccounts();

            return wallets
                .filter(
                    account =>
                        account_list.find((acc: any) => acc.loginid === account.account)?.account_category === 'trading'
                )
                .sort((a, b) => {
                    const typeA = account_list.find((acc: any) => acc.loginid === a.account)?.account_type;
                    const typeB = account_list.find((acc: any) => acc.loginid === b.account)?.account_type;

                    return accountOrder[typeA] - accountOrder[typeB];
                });
        };
        all_accounts = [...sortWalletAccounts(all_accounts)];

        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (container_ref.current && !container_ref.current.contains(event.target as Node)) {
                    setIsAccDropdownOpen(false);
                }
            }
            window.addEventListener('click', handleClickOutside);
            return () => window.removeEventListener('click', handleClickOutside);
        }, []);

        return (
            <div
                className='account__switcher-dropdown-wrapper account__switcher-dropdown-wrapper-wallet show'
                ref={dropdownRef}
            >
                <div
                    id='account__switcher-dropdown'
                    className='account__switcher-dropdown account__switcher-dropdown-wallet'
                    ref={container_ref}
                >
                    <div className='account__switcher-container'>
                        <div className='account-switcher-wallet__header'>
                            <Text as='h4' weight='bold' size='s'>
                                <Localize i18n_default_text='Deriv Apps accounts' />
                            </Text>
                            <div
                                className='close-icon'
                                onClick={() => setIsAccDropdownOpen(false)}
                                onFocus={() => setIsAccDropdownOpen(false)}
                                role='button'
                            >
                                <img
                                    className='btn__close mobile-show'
                                    src='/public/images/ic-close.svg'
                                    alt='wallet_icon'
                                />
                            </div>
                        </div>
                        <WalletContent setIsAccDropdownOpen={setIsAccDropdownOpen} account={all_accounts} />
                    </div>
                    <div>
                        {isMobile && (
                            <div className='account__switcher-manage-funds'>
                                {/* <a href={manage_funds.url}>
                                    <button className='account__switcher-wallet-btn'>
                                        <Localize i18n_default_text={manage_funds.label} />
                                    </button>
                                </a> */}
                            </div>
                        )}
                        <div className='account__switcher-total-wallet'>
                            <Localize i18n_default_text="Looking for CFDs? Go to Trader's hub" />

                            {/* <a href={config.wallets.url} className={'account__switcher-total--link'}>
                                <img
                                    className={'header__expand'}
                                    src='/public/images/ic-chevron-down-bold.svg'
                                    alt='wallet_icon'
                                />
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

AccountWalletDropdown.displayName = 'AccountWalletDropdown';

export default AccountWalletDropdown;
