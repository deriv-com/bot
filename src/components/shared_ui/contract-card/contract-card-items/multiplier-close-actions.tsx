import React from 'react';
import classNames from 'classnames';
import { isValidToCancel } from '@/components/shared';
import { TContractInfo } from '@/components/shared/utils/contract/contract-types';
import { Button } from '@deriv-com/ui';
import RemainingTime from '../../remaining-time';
import { TGetCardLables } from '../../types';

export type TMultiplierCloseActionsProps = {
    className?: string;
    contract_info: TContractInfo;
    getCardLabels: TGetCardLables;
    is_sell_requested: boolean;
    onClickCancel: (contract_id?: number) => void;
    onClickSell: (contract_id?: number) => void;
    server_time: moment.Moment;
};

const MultiplierCloseActions = ({
    className,
    contract_info,
    getCardLabels,
    is_sell_requested,
    onClickCancel,
    onClickSell,
    server_time,
}: TMultiplierCloseActionsProps) => {
    const { contract_id, cancellation: { date_expiry: cancellation_date_expiry } = {}, profit } = contract_info;

    const is_valid_to_cancel = isValidToCancel(contract_info);

    return (
        <React.Fragment>
            <Button
                id={`dc_contract_card_${contract_id}_button`}
                className={classNames(className, {
                    'dc-btn--loading': is_sell_requested,
                })}
                disabled={is_sell_requested || (Number(profit) < 0 && is_valid_to_cancel)}
                onClick={ev => {
                    onClickSell(contract_id);
                    ev.stopPropagation();
                    ev.preventDefault();
                }}
                variant='outlined'
            >
                {getCardLabels().CLOSE}
            </Button>
            {is_valid_to_cancel && (
                <Button
                    id={`dc_contract_card_${contract_id}_cancel_button`}
                    className='dc-btn--cancel'
                    disabled={Number(profit) >= 0}
                    onClick={ev => {
                        onClickCancel(contract_id);
                        ev.stopPropagation();
                        ev.preventDefault();
                    }}
                    variant='outlined'
                >
                    {getCardLabels().CANCEL}
                    {cancellation_date_expiry && (
                        <RemainingTime
                            end_time={cancellation_date_expiry}
                            format='mm:ss'
                            getCardLabels={getCardLabels}
                            start_time={server_time}
                        />
                    )}
                </Button>
            )}
        </React.Fragment>
    );
};

export default MultiplierCloseActions;
