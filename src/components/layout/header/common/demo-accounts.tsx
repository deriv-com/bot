import clsx from 'clsx';
import { api_base } from '@/external/bot-skeleton';
import { localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import AccountSwitcherFooter from './account-swticher-footer';
import { TDemoAccounts } from './types';
import { AccountSwitcherDivider, convertCommaValue } from './utils';

const DemoAccounts = ({
    tabs_labels,
    modifiedVRTCRAccountList,
    switchAccount,
    isVirtual,
    activeLoginId,
    oAuthLogout,
    is_logging_out,
}: TDemoAccounts) => {
    return (
        <>
            <UIAccountSwitcher.AccountsPanel
                isOpen
                title={localize('Deriv account')}
                className='account-switcher-panel'
                key={tabs_labels.demo.toLowerCase()}
            >
                {modifiedVRTCRAccountList &&
                    modifiedVRTCRAccountList.map(account => (
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
                                    isVirtual &&
                                    activeLoginId === account.loginid &&
                                    convertCommaValue(account.balance) !== 10000
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
            <AccountSwitcherDivider />
            <AccountSwitcherFooter
                loginid={activeLoginId}
                oAuthLogout={oAuthLogout}
                is_logging_out={is_logging_out}
                type='demo'
            />
        </>
    );
};

export default DemoAccounts;
