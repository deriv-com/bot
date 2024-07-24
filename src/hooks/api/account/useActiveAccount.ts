import { useMemo } from 'react';
import { useBalance } from '@/hooks/api/account';
import { useAccountList, useAuthData } from '@deriv-com/api-hooks';

/** A custom hook that returns the account object for the current active account. */
const useActiveAccount = () => {
    const { data, ...rest } = useAccountList();
    const { activeLoginid } = useAuthData();
    const { data: balanceData } = useBalance();
    const activeAccount = useMemo(
        () => data?.find(account => account.loginid === activeLoginid),
        [activeLoginid, data]
    );

    const modifiedAccount = useMemo(() => {
        return activeAccount
            ? {
                  ...activeAccount,
                  balance: balanceData?.accounts?.[activeAccount?.loginid]?.balance ?? 0,
              }
            : undefined;
    }, [activeAccount, balanceData]);

    return {
        /** User's current active account. */
        data: modifiedAccount,
        ...rest,
    };
};

export default useActiveAccount;
