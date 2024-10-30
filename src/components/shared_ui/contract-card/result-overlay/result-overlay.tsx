import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { StandaloneFlagCheckeredFillIcon } from '@deriv/quill-icons';
import Money from '../../money';
import Text from '../../text';
import { TGetCardLables, TGetContractPath } from '../../types';

type TResultOverlayProps = {
    currency?: string;
    contract_id?: number;
    getCardLabels: TGetCardLables;
    getContractPath?: TGetContractPath;
    is_multiplier?: boolean;
    is_positions?: boolean;
    is_visible: boolean;
    onClickRemove?: (contract_id?: number) => void;
    payout_info: number;
    result: string;
};

type TResultStatusIcon = {
    getCardLabels: TGetCardLables;
    is_contract_won?: boolean;
};

export const ResultStatusIcon = ({ getCardLabels, is_contract_won }: TResultStatusIcon) => (
    <span
        className={classNames('dc-result__caption', {
            'dc-result__caption--won': is_contract_won,
            'dc-result__caption--lost': !is_contract_won,
        })}
    >
        <div className='dc-result__icon'>
            <StandaloneFlagCheckeredFillIcon
                iconSize='sm'
                fill={is_contract_won ? 'var(--text-profit-success)' : 'var(--text-loss-danger)'}
            />
        </div>
        {getCardLabels().CLOSED}
    </span>
);

const ResultOverlay = ({
    currency,
    contract_id,
    getCardLabels,
    getContractPath,
    is_positions,
    is_visible,
    onClickRemove,
    payout_info,
    result,
}: TResultOverlayProps) => {
    const is_contract_won = result === 'won';

    return (
        <React.Fragment>
            <CSSTransition
                in={is_visible}
                timeout={250}
                classNames={{
                    enter: 'dc-contract-card__result--enter',
                    enterDone: 'dc-contract-card__result--enter-done',
                    exit: 'dc-contract-card__result--exit',
                }}
                unmountOnExit
            >
                <div
                    id={`dc_contract_card_${contract_id}_result`}
                    className={classNames('dc-contract-card__result', {
                        'dc-result__positions-overlay': is_positions,
                        'dc-contract-card__result--won': is_contract_won,
                        'dc-contract-card__result--lost': !is_contract_won,
                    })}
                >
                    {is_positions && (
                        <span
                            id={`dc_contract_card_${contract_id}_result_close_icon`}
                            className='dc-result__close-btn'
                            onClick={() => {
                                if (contract_id) onClickRemove?.(contract_id);
                            }}
                        />
                    )}
                    {getContractPath && (
                        <NavLink className='dc-result__caption-wrapper' to={getContractPath(contract_id)} />
                    )}
                    <div className='dc-result__content'>
                        <ResultStatusIcon getCardLabels={getCardLabels} is_contract_won={is_contract_won} />
                        <Text
                            weight='bold'
                            size='s'
                            lineHeight='2xl'
                            color={is_contract_won ? 'profit-success' : 'loss-danger'}
                        >
                            <Money amount={payout_info} currency={currency} has_sign show_currency />
                        </Text>
                    </div>
                </div>
            </CSSTransition>
        </React.Fragment>
    );
};

export default ResultOverlay;
