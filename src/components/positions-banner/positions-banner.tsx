import React from 'react';
import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import { useStore } from '@/hooks/useStore';
import { LabelPairedCircleInfoSmRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

const PositionsBanner = observer(() => {
    const { isDesktop } = useDevice();
    const store = useStore();
    const is_logged_in = store?.client?.is_logged_in;

    if (!isDesktop || !is_logged_in) return null;

    const handleReviewClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Reports is hosted on app.deriv.com, not in-app — full navigation is correct.
        window.location.assign(standalone_routes.reports);
    };

    return (
        <div className='positions-banner' role='status' aria-live='polite'>
            <LabelPairedCircleInfoSmRegularIcon
                className='positions-banner__icon'
                fill='var(--component-textIcon-normal-default)'
            />
            <span className='positions-banner__text'>
                <Localize
                    i18n_default_text="We're upgrading Deriv Bot on 13 June at 06:00 UTC. Any running bots and open positions will be automatically closed at this time, so please <0>review and close yours</0> beforehand. You'll be able to run new bots after the upgrade."
                    components={[
                        <a
                            key={0}
                            href={standalone_routes.reports}
                            onClick={handleReviewClick}
                            className='positions-banner__link'
                        />,
                    ]}
                />
            </span>
        </div>
    );
});

export default PositionsBanner;
