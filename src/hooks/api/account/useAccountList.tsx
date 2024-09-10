import { useMemo } from 'react';
import { CurrencyIcon } from '@/components/currency/currency-icon';
import { getDecimalPlaces } from '@/components/shared';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';
import { localize } from '@deriv-com/translations';
import useBalance from './useBalance';

/** A custom hook that returns the account object for the current active account. */
const useModifiedAccountList = () => {
    const { data: accountList, ...rest } = useAccountList();
    const { data: balanceData } = useBalance();
    const { activeLoginid } = useAuthData();

    const modifiedAccounts = useMemo(() => {
        return accountList?.map(account => {
            return {
                ...account,
                balance:
                    balanceData?.accounts?.[account?.loginid]?.balance?.toFixed(getDecimalPlaces(account.currency)) ??
                    '0',
                currencyLabel: account?.is_virtual ? localize('Demo') : account?.currency,
                icon: (
                    <CurrencyIcon
                        currency={account?.currency?.toLowerCase()}
                        isVirtual={Boolean(account?.is_virtual)}
                    />
                ),
                isVirtual: Boolean(account?.is_virtual),
                isActive: account?.loginid === activeLoginid,
            };
        });
    }, [accountList, balanceData, activeLoginid]);

    return {
        /** User's active accounts list. */
        data: modifiedAccounts,
        ...rest,
    };
};

export default useModifiedAccountList;
