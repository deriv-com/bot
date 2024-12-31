import React from 'react';
import classNames from 'classnames';
import { getTimePercentage } from '@/components/shared';
import CircularProgress from '../circular-progress';
import RemainingTime from '../remaining-time';
import Text from '../text';
import { TGetCardLables } from '../types';
import ProgressTicksMobile from './progress-ticks-mobile';

type TProgressSliderMobileProps = {
    className?: string;
    current_tick?: number | null;
    expiry_time?: number;
    is_loading?: boolean;
    server_time: moment.Moment;
    start_time?: number;
    ticks_count?: number;
    getCardLabels: TGetCardLables;
};

const ProgressSliderMobile = ({
    className,
    current_tick,
    getCardLabels,
    is_loading,
    start_time,
    expiry_time,
    server_time,
    ticks_count,
}: TProgressSliderMobileProps) => {
    const percentage = getTimePercentage(server_time, Number(start_time), Number(expiry_time));
    return (
        <div className={classNames('dc-progress-slider-mobile', className)}>
            {ticks_count ? (
                <ProgressTicksMobile
                    current_tick={current_tick}
                    getCardLabels={getCardLabels}
                    ticks_count={ticks_count}
                />
            ) : (
                <React.Fragment>
                    <Text size='xxs'>
                        <RemainingTime end_time={expiry_time} getCardLabels={getCardLabels} start_time={server_time} />
                    </Text>
                    {is_loading || percentage < 1 ? (
                        <div className='dc-progress-slider-mobile__infinite-loader'>
                            <div className='dc-progress-slider-mobile__infinite-loader--indeterminate' />
                        </div>
                    ) : (
                        <CircularProgress
                            className='dc-progress-slider-mobile__timer'
                            danger_limit={20}
                            progress={percentage}
                            warning_limit={50}
                        />
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default ProgressSliderMobile;
