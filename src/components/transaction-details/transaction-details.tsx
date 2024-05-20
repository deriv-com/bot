import { Suspense } from 'react';
import { observer } from 'mobx-react-lite';

import { Loader } from '@deriv-com/ui';

import { useStore } from '@/hooks/useStore';

import TransactionDetailsDesktop from './transaction-details-desktop';
import TransactionDetailsMobile from './transaction-details-mobile';

export const TransactionDetails = observer(() => {
    const {
        ui: { is_mobile },
    } = useStore();
    return (
        <Suspense fallback={<Loader />}>
            {is_mobile ? <TransactionDetailsMobile /> : <TransactionDetailsDesktop />}
        </Suspense>
    );
});

export default TransactionDetails;
