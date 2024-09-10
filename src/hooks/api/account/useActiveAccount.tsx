import { useMemo } from 'react';
import { CurrencyIcon } from '@/components/currency/currency-icon';
import { getDecimalPlaces } from '@/components/shared';
import { useStore } from '@/hooks/useStore';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';
import { localize } from '@deriv-com/translations';
import useBalance from './useBalance';

/** A custom hook that returns the account object for the current active account. */
const useActiveAccount = () => {
    const { data, ...rest } = useAccountList();
    const { activeLoginid } = useAuthData();
    const { data: allBalanceData } = useBalance();
    const { client } = useStore();
    const { setLoginId, setAccountList, setBalance, setCurrency, setIsLoggedIn } = client;

    const activeAccount = useMemo(
        () => data?.find(account => account.loginid === activeLoginid),
        [activeLoginid, data]
    );

    const modifiedAccount = useMemo(() => {
        const currentBalanceData = allBalanceData?.accounts?.[activeAccount?.loginid ?? ''];

        if (currentBalanceData) {
            setLoginId(activeLoginid);
            setAccountList(data);
            setBalance(currentBalanceData.balance.toFixed(getDecimalPlaces(currentBalanceData.currency)));
            setCurrency(currentBalanceData.currency);
            setIsLoggedIn(true);
        }

        return activeAccount
            ? {
                  ...activeAccount,
                  balance: currentBalanceData?.balance?.toFixed(getDecimalPlaces(currentBalanceData.currency)) ?? '0',
                  currencyLabel: activeAccount?.is_virtual ? localize('Demo') : activeAccount?.currency,
                  icon: (
                      <CurrencyIcon
                          currency={activeAccount?.currency?.toLowerCase()}
                          isVirtual={Boolean(activeAccount?.is_virtual)}
                      />
                  ),
                  isVirtual: Boolean(activeAccount?.is_virtual),
                  isActive: activeAccount?.loginid === activeLoginid,
              }
            : undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAccount, activeLoginid, allBalanceData]);

    return {
        /** User's current active account. */
        data: modifiedAccount,
        ...rest,
    };
};

export default useActiveAccount;
