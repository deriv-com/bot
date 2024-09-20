import React from 'react';
import classNames from 'classnames';
import Text from '@/components/shared_ui/text';
import { Localize } from '@/utils/tmp/dummy';
import { LabelPairedCircleCheckMdRegularIcon, LabelPairedCircleXmarkMdRegularIcon } from '@deriv/quill-icons';

type TContractResultOverlayProps = {
    profit: number;
};

const ContractResultOverlay = ({ profit }: TContractResultOverlayProps) => {
    const has_won_contract = profit >= 0;

    return (
        <div
            className={classNames('db-contract-card__result', {
                'db-contract-card__result--won': has_won_contract,
                'db-contract-card__result--lost': !has_won_contract,
            })}
        >
            <Text weight='bold' className='db-contract-card__result-caption'>
                {has_won_contract ? (
                    <React.Fragment>
                        <Localize i18n_default_text='Won' />
                        <LabelPairedCircleCheckMdRegularIcon className='db-contract-card__result-icon' color='green' />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Localize i18n_default_text='Lost' />
                        <LabelPairedCircleXmarkMdRegularIcon className='db-contract-card__result-icon' color='red' />
                    </React.Fragment>
                )}
            </Text>
        </div>
    );
};

export default ContractResultOverlay;
