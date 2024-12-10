import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { CSSTransition } from 'react-transition-group';
import { formatMoney, getCurrencyDisplayCode } from '@/components/shared';
import { AppLinkedWithWalletIcon } from '@/components/shared_ui/app-linked-with-wallet-icon';
import Text from '@/components/shared_ui/text';
import { WalletIcon } from '@/components/shared_ui/wallet-icon';
import { useStore } from '@/hooks/useStore';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import {
    AccountsDerivAccountLightIcon,
    LabelPairedLockCaptionBoldIcon,
    StandaloneChevronDownBoldIcon,
} from '@deriv/quill-icons';
import { TStores } from '@deriv/stores/types';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import AccountInfoWrapper from '../account-info-wrapper';
import { AccountSwitcherWallet, AccountSwitcherWalletMobile } from '../AccountSwitcherWallet';
import WalletBadge from './wallet-badge';

type TAccountInfoWallets = {
    toggleDialog: () => void;
    is_dialog_on: boolean;
};

type TDropdownArrow = {
    is_disabled?: boolean;
};

type TBalanceLabel = {
    balance: TStores['client']['accounts'][string]['balance'];
    currency: TStores['client']['accounts'][string]['currency'];
    is_virtual: boolean;
    display_code: string;
};

type TInfoIcons = {
    gradients: Exclude<ReturnType<typeof useStoreWalletAccountsList>['data'], undefined>[number]['gradients'];
    icons: Exclude<ReturnType<typeof useStoreWalletAccountsList>['data'], undefined>[number]['icons'];
    icon_type: Exclude<ReturnType<typeof useStoreWalletAccountsList>['data'], undefined>[number]['icon_type'];
};

const DropdownArrow = ({ is_disabled = false }: TDropdownArrow) =>
    is_disabled ? (
        <LabelPairedLockCaptionBoldIcon />
    ) : (
        <div className='acc-info__select-arrow'>
            <StandaloneChevronDownBoldIcon />
        </div>
    );

const BalanceLabel = ({ balance, currency, is_virtual, display_code }: Partial<TBalanceLabel>) =>
    typeof balance !== 'undefined' || !currency ? (
        <div className='acc-info__wallets-account-type-and-balance'>
            <Text
                as='p'
                data-testid='dt_balance'
                className={classNames('acc-info__balance acc-info__wallets-balance', {
                    'acc-info__balance--no-currency': !currency && !is_virtual,
                })}
            >
                {!currency ? (
                    <Localize i18n_default_text='No currency assigned' />
                ) : (
                    `${formatMoney(currency, balance ?? 0, true)} ${display_code}`
                )}
            </Text>
        </div>
    ) : null;

const MobileInfoIcon = observer(({ gradients, icons, icon_type }: TInfoIcons) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const theme = is_dark_mode_on ? 'dark' : 'light';
    const app_icon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';

    return (
        <div className='acc-info__wallets-container'>
            <AppLinkedWithWalletIcon
                app_icon={app_icon}
                gradient_class={gradients?.card[theme] ?? ''}
                size='small'
                type={icon_type}
                wallet_icon={icons?.[theme] ?? ''}
                hide_watermark
            />
        </div>
    );
});

const DesktopInfoIcons = observer(({ gradients, icons, icon_type }: TInfoIcons) => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const theme = is_dark_mode_on ? 'dark' : 'light';

    return (
        <div className='acc-info__wallets-container'>
            <AccountsDerivAccountLightIcon iconSize='sm' />
            <WalletIcon
                icon={icons?.[theme] ?? ''}
                type={icon_type}
                gradient_class={gradients?.card[theme]}
                size={'small'}
                has_bg
                hide_watermark
            />
        </div>
    );
});

const AccountInfoWallets = observer(({ is_dialog_on, toggleDialog }: TAccountInfoWallets) => {
    const { client, ui } = useStore();
    const { loginid, accounts, all_accounts_balance } = client;
    const { account_switcher_disabled_message } = ui;
    const { data: wallet_list } = useStoreWalletAccountsList();
    const { isDesktop } = useDevice();

    const balance = all_accounts_balance?.accounts?.[loginid ?? '']?.balance;
    const active_account = accounts?.[loginid ?? ''];
    const linked_dtrade_trading_account_loginid = loginid;

    const linked_wallet = wallet_list?.find(wallet => wallet.dtrade_loginid === linked_dtrade_trading_account_loginid);
    const show_badge = linked_wallet?.is_virtual;

    return (
        <div className='acc-info__wrapper'>
            <AccountInfoWrapper
                is_mobile={!isDesktop}
                is_disabled={Boolean(active_account?.is_disabled)}
                disabled_message={account_switcher_disabled_message}
            >
                <div
                    data-testid='dt_acc_info'
                    id='dt_core_account-info_acc-info'
                    className={classNames('acc-info acc-info__wallets', {
                        'acc-info--show': is_dialog_on,
                        'acc-info--is-disabled': active_account?.is_disabled,
                    })}
                    onClick={active_account?.is_disabled ? undefined : () => toggleDialog()}
                >
                    {isDesktop ? (
                        <DesktopInfoIcons
                            gradients={linked_wallet?.gradients}
                            icons={linked_wallet?.icons}
                            icon_type={linked_wallet?.icon_type}
                        />
                    ) : (
                        <MobileInfoIcon
                            gradients={linked_wallet?.gradients}
                            icons={linked_wallet?.icons}
                            icon_type={linked_wallet?.icon_type}
                        />
                    )}
                    <BalanceLabel
                        balance={balance}
                        currency={active_account?.currency}
                        is_virtual={Boolean(active_account?.is_virtual)}
                        display_code={getCurrencyDisplayCode(active_account?.currency)}
                    />
                    {show_badge && (
                        <WalletBadge
                            is_demo={Boolean(linked_wallet?.is_virtual)}
                            label={linked_wallet?.landing_company_name}
                        />
                    )}
                    <DropdownArrow is_disabled={Boolean(active_account?.is_disabled)} />
                </div>
            </AccountInfoWrapper>
            {isDesktop ? (
                <CSSTransition
                    in={is_dialog_on}
                    timeout={200}
                    classNames={{
                        enter: 'acc-switcher__wrapper--enter',
                        enterDone: 'acc-switcher__wrapper--enter-done',
                        exit: 'acc-switcher__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <div className='acc-switcher__wrapper acc-switcher__wrapper--wallets'>
                        <AccountSwitcherWallet is_visible={is_dialog_on} toggle={toggleDialog} />
                    </div>
                </CSSTransition>
            ) : (
                <AccountSwitcherWalletMobile is_visible={is_dialog_on} toggle={toggleDialog} loginid={loginid} />
            )}
        </div>
    );
});

export default AccountInfoWallets;
