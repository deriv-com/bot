import React from 'react';
import classNames from 'classnames';
import { hasContractEntered, isForwardStarting, isOpen, isValidToSell } from '@/components/shared';
import { TContractInfo } from '@/components/shared/utils/contract/contract-types';
import { Button } from '@deriv-com/ui';
import { TGetCardLables } from '../../types';

export type TContractCardSellProps = {
    contract_info: TContractInfo;
    getCardLabels: TGetCardLables;
    is_sell_requested: boolean;
    onClickSell?: (contract_id?: number) => void;
};

const ContractCardSell = ({ contract_info, getCardLabels, is_sell_requested, onClickSell }: TContractCardSellProps) => {
    const is_valid_to_sell = isValidToSell(contract_info);
    const should_show_sell =
        (hasContractEntered(contract_info) ||
            isForwardStarting(contract_info?.shortcode ?? '', contract_info.purchase_time)) &&
        isOpen(contract_info);

    const onClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
        onClickSell?.(contract_info.contract_id);
        ev.stopPropagation();
        ev.preventDefault();
    };

    return should_show_sell ? (
        <React.Fragment>
            {is_valid_to_sell ? (
                <Button
                    className={classNames('dc-btn--sell', {
                        'dc-btn--loading': is_sell_requested,
                    })}
                    data-testid='dt_contract_card_sell'
                    disabled={is_sell_requested}
                    onClick={onClick}
                    variant='outlined'
                >
                    {getCardLabels().SELL}
                </Button>
            ) : (
                <div className='dc-contract-card__no-resale-msg'>{getCardLabels().RESALE_NOT_OFFERED}</div>
            )}
        </React.Fragment>
    ) : null;
};

export default ContractCardSell;
