import clsx from 'clsx';
import { api_base } from '@/external/bot-skeleton';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher, Divider } from '@deriv-com/ui';
import AccountSwitcherFooter from './account-swticher-footer';

type TDemonAccounts = {
    tabs_labels: {
        demo: string;
    };
    modifiedAccountList: any[];
    switchAccount: (loginId: number) => void;
    isVirtual: boolean;
    activeLoginId?: string;
    oAuthLogout: () => void;
};
const DemoAccounts = ({
    tabs_labels,
    modifiedAccountList,
    switchAccount,
    isVirtual,
    activeLoginId,
    oAuthLogout,
}: TDemonAccounts) => {
    return (
        <>
            <UIAccountSwitcher.AccountsPanel
                isOpen
                title={localize('Deriv account')}
                className='account-switcher-panel'
                key={tabs_labels.demo.toLowerCase()}
            >
                {modifiedAccountList
                    ?.filter(account => account.is_virtual)
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
                                onResetBalance={
                                    isVirtual && activeLoginId === account.loginid && Number(account.balance) !== 10000
                                        ? () => {
                                              api_base?.api?.send({
                                                  topup_virtual: 1,
                                              });
                                          }
                                        : undefined
                                }
                            />
                        </span>
                    ))}
            </UIAccountSwitcher.AccountsPanel>
            <Divider color='var(--general-section-2)' height='4px' />
            <AccountSwitcherFooter loginid={activeLoginId} oAuthLogout={oAuthLogout} />
        </>
    );
};

export default DemoAccounts;
