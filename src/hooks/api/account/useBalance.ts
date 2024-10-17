import { useEffect, useMemo, useState } from 'react';
import { useAuthData, useBalance as useApiBalance, useSubscribe } from '@deriv-com/api-hooks';

type BalanceData = ReturnType<typeof useApiBalance>['data'];

const useBalance = () => {
    const { isAuthorized } = useAuthData();
    const { data, subscribe, ...rest } = useSubscribe('balance');
    const [allBalanceData, setAllBalanceData] = useState<BalanceData | null>(null);

    useEffect(() => {
        if (isAuthorized) {
            subscribe({
                account: 'all',
            });
        }
    }, [isAuthorized, subscribe]);

    useEffect(() => {
        if (data?.balance?.accounts) {
            setAllBalanceData(data.balance);
        } else if (data?.balance?.loginid) {
            setAllBalanceData(prevData => {
                if (!prevData?.accounts || !data?.balance?.loginid) return prevData;
                const accounts = { ...prevData.accounts };
                const currentLoggedInBalance = accounts[data.balance.loginid];
                currentLoggedInBalance.balance = data.balance.balance;

                return {
                    ...prevData,
                    accounts: {
                        ...prevData.accounts,
                        [data.balance.loginid]: currentLoggedInBalance,
                    },
                };
            });
        }
    }, [data]);

    const modifiedBalance = useMemo(() => ({ ...allBalanceData }), [allBalanceData]);

    return { data: modifiedBalance, ...rest };
};

export default useBalance;
