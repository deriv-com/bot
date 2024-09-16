import { Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { Loader, useDevice } from '@deriv-com/ui';
import TransactionDetailsDesktop from './transaction-details-desktop';
import TransactionDetailsMobile from './transaction-details-mobile';

export const TransactionDetails = observer(() => {
    const { isDesktop } = useDevice();
    return (
        <Suspense fallback={<Loader />}>
            {!isDesktop ? <TransactionDetailsMobile /> : <TransactionDetailsDesktop />}
        </Suspense>
    );
});

export default TransactionDetails;
