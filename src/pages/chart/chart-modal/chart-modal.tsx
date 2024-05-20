import { Suspense } from 'react';
import { observer } from 'mobx-react-lite';

import { Loader } from '@deriv-com/ui';

import { useStore } from '@/hooks/useStore';

import ChartModalDesktop from './chart-modal-desktop';

export const ChartModal = observer(() => {
    const {
        ui: { is_desktop },
    } = useStore();
    return <Suspense fallback={<Loader />}>{is_desktop && <ChartModalDesktop />}</Suspense>;
});

export default ChartModal;
