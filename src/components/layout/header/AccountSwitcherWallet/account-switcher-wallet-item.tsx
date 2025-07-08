import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { formatMoney, getCurrencyDisplayCode } from '@/components/shared';
import { AppLinkedWithWalletIcon } from '@/components/shared_ui/app-linked-with-wallet-icon';
import Text from '@/components/shared_ui/text';
import { api_base } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { Analytics } from '@deriv-com/analytics';
import { Localize } from '@deriv-com/translations';
import WalletBadge from '../wallets/wallet-badge';
import './account-switcher-wallet-item.scss';

type TAccountSwitcherWalletItemProps = {
    account: Exclude<ReturnType<typeof useStoreWalletAccountsList>['data'], undefined>[number];
    closeAccountsDialog: () => void;
    show_badge?: boolean;
};

export const AccountSwitcherWalletItem = observer(
    ({ closeAccountsDialog, account, show_badge = false }: TAccountSwitcherWalletItemProps) => {
        const {
            currency,
            dtrade_loginid,
            dtrade_balance,
            gradients,
            icons,
            is_virtual,
            landing_company_name,
            icon_type,
        } = account;

        const {
            ui: { is_dark_mode_on },
            client: { loginid: active_loginid, is_eu },
        } = useStore();

        const theme = is_dark_mode_on ? 'dark' : 'light';
        const app_icon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';
        const is_dtrade_active = dtrade_loginid === active_loginid;

        const switchAccount = async (loginId: number) => {
            const account_list = JSON.parse(localStorage.getItem('accountsList') ?? '{}');
            const token = account_list[loginId];

            // If token is missing, store the currency in session storage and return
            if (!token) {
                // Store the currency in session storage
                if (currency) {
                    sessionStorage.setItem('query_param_currency', currency);
                }

                // Set clientHasCurrency to false
                if (typeof (window as any).setClientHasCurrency === 'function') {
                    (window as any).setClientHasCurrency(false);
                }
                return;
            }

            localStorage.setItem('authToken', token);
            localStorage.setItem('active_loginid', loginId.toString());
            const account_type =
                loginId
                    .toString()
                    .match(/[a-zA-Z]+/g)
                    ?.join('') || '';
            Analytics.setAttributes({
                account_type,
            });
            await api_base?.init(true);
            closeAccountsDialog();

            const client_accounts = JSON.parse(localStorage.getItem('clientAccounts') ?? '{}');
            const search_params = new URLSearchParams(window.location.search);
            const selected_account = Object.values(client_accounts)?.find(
                (acc: any) => acc.loginid === loginId.toString()
            );
            if (!selected_account) return;
            const account_param = is_virtual ? 'demo' : selected_account.currency;
            search_params.set('account', account_param);
            window.history.pushState({}, '', `${window.location.pathname}?${search_params.toString()}`);
        };

        return (
            <div
                className={classNames('acc-switcher-wallet-item__container', {
                    'acc-switcher-wallet-item__container--active': is_dtrade_active,
                })}
                data-testid='account-switcher-wallet-item'
                onClick={() => switchAccount(dtrade_loginid)}
                role='button'
            >
                <div>
                    <AppLinkedWithWalletIcon
                        app_icon={app_icon}
                        gradient_class={gradients?.card[theme] ?? ''}
                        type={icon_type}
                        wallet_icon={icons?.[theme] ?? ''}
                        hide_watermark
                    />
                </div>
                <div className='acc-switcher-wallet-item__content'>
                    <Text size='xxxs'>
                        {is_eu ? (
                            <Localize i18n_default_text='Multipliers' />
                        ) : (
                            <Localize i18n_default_text='Options' />
                        )}
                    </Text>
                    <Text size='xxxs'>
                        {is_virtual ? (
                            <Localize i18n_default_text='Demo Wallet' />
                        ) : (
                            <Localize
                                i18n_default_text='{{currency}} Wallet'
                                values={{ currency: getCurrencyDisplayCode(currency) }}
                            />
                        )}
                    </Text>
                    <Text size='xs' weight='bold'>
                        {`${formatMoney(currency ?? '', dtrade_balance || 0, true)} ${getCurrencyDisplayCode(
                            currency
                        )}`}
                    </Text>
                </div>
                {show_badge && <WalletBadge is_demo={Boolean(is_virtual)} label={landing_company_name} />}
            </div>
        );
    }
);
