import { useActiveAccount } from '@/hooks/api/account';
import { CurrencyUsdIcon } from '@deriv/quill-icons';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';

type TActiveAccount = NonNullable<ReturnType<typeof useActiveAccount>['data']>;
type TAccountSwitcherProps = {
    account: TActiveAccount;
};

export const AccountSwitcher = ({ account }: TAccountSwitcherProps) => {
    const activeAccount = {
        balance: FormatUtils.formatMoney(account?.balance ?? 0),
        currency: account?.currency || 'USD',
        currencyLabel: account?.currency || 'US Dollar',
        icon: <CurrencyUsdIcon iconSize='sm' />,
        isActive: true,
        isVirtual: Boolean(account?.is_virtual),
        loginid: account?.loginid || '',
    };
    return account && <UIAccountSwitcher activeAccount={activeAccount} buttonClassName='mr-4' isDisabled />;
};
