import { useMemo } from 'react';
import { useBalance as useAPIBalance } from '@deriv-com/api-hooks';

const useBalance = () => {
    const { data, ...rest } = useAPIBalance({
        payload: { account: 'all' },
    });

    const modifiedBalance = useMemo(() => ({ ...data }), [data]);

    return { data: modifiedBalance, ...rest };
};

export default useBalance;
