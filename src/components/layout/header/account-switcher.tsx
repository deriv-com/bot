import { observer } from 'mobx-react-lite';
import Popover from '@/components/shared_ui/popover';
import useModifiedAccountList from '@/hooks/api/account/useAccountList';
import useActiveAccount from '@/hooks/api/account/useActiveAccount';
import { useStore } from '@/hooks/useStore';
import { LegacyLogout1pxIcon } from '@deriv/quill-icons';
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
    const { switchAccount, logout } = useAuthData();

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
                        <UIAccountSwitcher.AccountsItem
                            key={account.loginid}
                            account={account}
                            onSelectAccount={() => {
                                switchAccount(account.loginid);
                            }}
                        />
                    ))}
            </UIAccountSwitcher.AccountsPanel>

            <Divider color='#f2f3f4' height='4px' />

            <div className='account-switcher-footer'>
                <Divider color='#f2f3f4' height='4px' />
                {/* TODO: need to handle total assets */}
                {/* <UIAccountSwitcher.TotalAsset
                    title={localize('Total assets')}
                    description={localize('Total assets in your Deriv accounts.')}
                    value={`${activeAccount.balance} ${activeAccount.currency}`}
                /> */}
                <Divider color='#f2f3f4' height='4px' />
                <UIAccountSwitcher.TradersHubLink href='https://app.deriv.com'>
                    {localize(`Looking for CFD accounts? Go to Trader's Hub`)}
                </UIAccountSwitcher.TradersHubLink>
                <Divider color='#f2f3f4' height='4px' />

                <UIAccountSwitcher.Footer>
                    <div
                        id='dt_logout_button'
                        className='deriv-account-switcher__logout'
                        onClick={() => {
                            logout();
                        }}
                    >
                        <Text color='prominent' size='xs' align='left' className='deriv-account-switcher__logout-text'>
                            {localize('Log out')}
                        </Text>
                        <LegacyLogout1pxIcon iconSize='xs' />
                    </div>
                </UIAccountSwitcher.Footer>
            </div>
        </>
    );
};

const AccountSwitcher = observer(({ activeAccount }: TAccountSwitcherProps) => {
    const { ui } = useStore();
    const { is_accounts_switcher_on, account_switcher_disabled_message } = ui;

    return (
        activeAccount && (
            <Popover
                className='run-panel__info'
                classNameBubble='run-panel__info--bubble'
                alignment='bottom'
                message={account_switcher_disabled_message}
                zIndex='5'
            >
                <UIAccountSwitcher activeAccount={activeAccount} isDisabled={!is_accounts_switcher_on}>
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
