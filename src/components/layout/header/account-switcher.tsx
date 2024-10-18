import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Popover from '@/components/shared_ui/popover';
import useModifiedAccountList from '@/hooks/api/account/useAccountList';
import useActiveAccount from '@/hooks/api/account/useActiveAccount';
import { useStore } from '@/hooks/useStore';
import { LegacyLogout1pxIcon } from '@deriv/quill-icons/Legacy';
import { useAuthData } from '@deriv-com/api-hooks';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher, Divider, Text } from '@deriv-com/ui';

type TActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
type TAccountSwitcherProps = {
    activeAccount: TActiveAccount | undefined;
    isVirtual?: boolean;
};

const RenderAccountItems = ({ isVirtual }: Partial<TAccountSwitcherProps>) => {
    const { data: modifiedAccountList } = useModifiedAccountList();
    const { switchAccount } = useAuthData();
    const { client } = useStore() ?? {
        client: {
            logout: () => {},
        },
    };

    return (
        <>
            <UIAccountSwitcher.AccountsPanel
                isOpen
                title={localize('Deriv accounts')}
                className='account-switcher-panel'
                key={isVirtual ? 'demo' : 'real'}
            >
                {modifiedAccountList
                    ?.filter(account => (isVirtual ? account.is_virtual : !account.is_virtual))
                    .map(account => (
                        <span
                            className={clsx('account-switcher__item', {
                                'account-switcher__item--disabled': account.is_disabled,
                            })}
                            key={account.loginid}
                        >
                            <UIAccountSwitcher.AccountsItem
                                account={account}
                                onSelectAccount={() => {
                                    if (!account.is_disabled) switchAccount(account.loginid);
                                }}
                            />
                        </span>
                    ))}
            </UIAccountSwitcher.AccountsPanel>

            <Divider color='var(--du-general-active)' height='2px' />

            <div className='account-switcher-footer'>
                {/* TODO: need to handle total assets */}
                {/* <UIAccountSwitcher.TotalAsset
                    title={localize('Total assets')}
                    description={localize('Total assets in your Deriv accounts.')}
                    value={`${activeAccount.balance} ${activeAccount.currency}`}
                /> */}
                <UIAccountSwitcher.TradersHubLink href='https://app.deriv.com'>
                    {localize(`Looking for CFD accounts? Go to Trader's Hub`)}
                </UIAccountSwitcher.TradersHubLink>
                <Divider color='var(--du-general-active)' height='2px' />

                <UIAccountSwitcher.Footer>
                    <div id='dt_logout_button' className='deriv-account-switcher__logout' onClick={client.logout}>
                        <Text color='prominent' size='xs' align='left' className='deriv-account-switcher__logout-text'>
                            {localize('Log out')}
                        </Text>
                        <LegacyLogout1pxIcon
                            iconSize='xs'
                            fill='var(--text-general)'
                            className='icon-general-fill-path'
                        />
                    </div>
                </UIAccountSwitcher.Footer>
            </div>
        </>
    );
};

const AccountSwitcher = observer(({ activeAccount }: TAccountSwitcherProps) => {
    const { ui, run_panel } = useStore() ?? {
        ui: {
            account_switcher_disabled_message: '',
        },
        run_panel: {
            is_stop_button_visible: false,
        },
    };
    const { account_switcher_disabled_message } = ui;
    const { is_stop_button_visible } = run_panel;

    return (
        activeAccount && (
            <Popover
                className='run-panel__info'
                classNameBubble='run-panel__info--bubble'
                alignment='bottom'
                message={account_switcher_disabled_message}
                zIndex='5'
            >
                <UIAccountSwitcher activeAccount={activeAccount} isDisabled={is_stop_button_visible}>
                    <UIAccountSwitcher.Tab title={localize('Real')}>
                        <RenderAccountItems activeAccount={activeAccount} />
                    </UIAccountSwitcher.Tab>
                    <UIAccountSwitcher.Tab title={localize('Demo')}>
                        <RenderAccountItems activeAccount={activeAccount} isVirtual />
                    </UIAccountSwitcher.Tab>
                </UIAccountSwitcher>
            </Popover>
        )
    );
});

export default AccountSwitcher;
