import { Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { Loader, useDevice } from '@deriv-com/ui';
import ChartModalDesktop from './chart-modal-desktop';

export const ChartModal = observer(() => {
    const { isDesktop } = useDevice();
    return <Suspense fallback={<Loader />}>{isDesktop && <ChartModalDesktop />}</Suspense>;
});

export default ChartModal;
