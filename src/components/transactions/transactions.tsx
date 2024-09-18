import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { CSSTransition } from 'react-transition-group';
import Download from '@/components/download';
import { TContractInfo } from '@/components/summary/summary-card.types';
import { contract_stages } from '@/constants/contract-stage';
import { transaction_elements } from '@/constants/transactions';
import { useNewRowTransition } from '@/hooks/useNewRowTransition';
import { useStore } from '@/hooks/useStore';
import { DerivLightEmptyCardboardBoxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import DataList from '../data-list';
import ThemedScrollbars from '../shared_ui/themed-scrollbars';
import Transaction from './transaction';

type TTransactions = {
    is_drawer_open: boolean;
};

type TTransactionItem = {
    row: {
        type: string;
        data: TContractInfo;
    };
    is_new_row?: boolean;
    onClickTransaction?: (transaction_id: null | number) => void;
    active_transaction_id?: number | null;
};

const TransactionItem = ({ row, is_new_row = false, onClickTransaction, active_transaction_id }: TTransactionItem) => {
    const { in_prop } = useNewRowTransition(is_new_row);
    switch (row.type) {
        case transaction_elements.CONTRACT: {
            const { data: contract } = row;
            return (
                <CSSTransition in={in_prop} timeout={500} classNames='list__animation'>
                    <Transaction
                        contract={contract}
                        onClickTransaction={onClickTransaction}
                        active_transaction_id={active_transaction_id}
                    />
                </CSSTransition>
            );
        }
        case transaction_elements.DIVIDER: {
            return (
                <div className='transactions__divider'>
                    <div className='transactions__divider-line' />
                </div>
            );
        }
        default: {
            return null;
        }
    }
};

const Transactions = observer(({ is_drawer_open }: TTransactions) => {
    const [active_transaction_id, setActiveTransactionId] = React.useState<number | null>(null);
    const { ui } = useStore();
    const { run_panel, transactions } = useStore();
    const { contract_stage } = run_panel;
    const { transactions: transaction_list, toggleTransactionDetailsModal, recoverPendingContracts } = transactions;
    const { is_mobile } = ui;

    React.useEffect(() => {
        window.addEventListener('click', onClickOutsideTransaction);
        recoverPendingContracts();
        return () => {
            window.removeEventListener('click', onClickOutsideTransaction);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (active_transaction_id) {
            setActiveTransactionId(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction_list?.length]);

    const onClickOutsideTransaction = (event: PointerEvent | MouseEvent | TouchEvent) => {
        const path: EventTarget[] = event?.composedPath() || [];
        const is_transaction_click = path.some(el =>
            (el as HTMLElement).classList?.contains('transactions__item-wrapper')
        );
        if (!is_transaction_click) {
            setActiveTransactionId(null);
        }
    };

    const onClickTransaction = (transaction_id: null | number) => {
        // Toggle transaction popover if passed transaction_id is the same.
        if (transaction_id && active_transaction_id === transaction_id) {
            setActiveTransactionId(null);
        } else {
            setActiveTransactionId(transaction_id);
        }
    };

    return (
        <div
            className={classnames('transactions', {
                'run-panel-tab__content': !is_mobile,
                'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
            })}
        >
            <div className='download__container transaction-details__button-container'>
                <Download tab='transactions' />
                <Button
                    id='download__container__view-detail-button'
                    className='download__container__view-detail-button'
                    disabled={!transaction_list?.length}
                    onClick={() => {
                        toggleTransactionDetailsModal(true);
                    }}
                    variant='outlined'
                    color='black'
                    size='sm'
                    textSize='sm'
                >
                    <Localize i18n_default_text='View Detail' />
                </Button>
            </div>
            <div className='transactions__header'>
                <span className='transactions__header-column transactions__header-type'>
                    <Localize i18n_default_text='Type' />
                </span>
                <span className='transactions__header-column transactions__header-spot'>
                    <Localize i18n_default_text='Entry/Exit spot' />
                </span>
                <span className='transactions__header-column transactions__header-profit'>
                    <Localize i18n_default_text='Buy price and P/L' />
                </span>
            </div>
            <div
                className={classnames({
                    transactions__content: !is_mobile,
                    'transactions__content--mobile': is_mobile,
                })}
            >
                <div className='transactions__scrollbar'>
                    {transaction_list?.length ? (
                        <DataList
                            className='transactions'
                            data_source={transaction_list}
                            rowRenderer={props => (
                                <TransactionItem
                                    onClickTransaction={onClickTransaction}
                                    active_transaction_id={active_transaction_id}
                                    {...props}
                                />
                            )}
                            keyMapper={row => {
                                switch (row.type) {
                                    case transaction_elements.CONTRACT: {
                                        return row.data.transaction_ids.buy;
                                    }
                                    case transaction_elements.DIVIDER: {
                                        return row.data;
                                    }
                                    default: {
                                        return null;
                                    }
                                }
                            }}
                            getRowSize={({ index }) => {
                                const row = transaction_list?.[index];
                                switch (row.type) {
                                    case transaction_elements.CONTRACT: {
                                        return 50;
                                    }
                                    case transaction_elements.DIVIDER: {
                                        return 21;
                                    }
                                    default: {
                                        return 0;
                                    }
                                }
                            }}
                        />
                    ) : (
                        <>
                            {contract_stage >= contract_stages.STARTING ? (
                                <Transaction contract={null} />
                            ) : (
                                <ThemedScrollbars>
                                    <div className='transactions-empty-box'>
                                        <div className='transactions-empty'>
                                            <div className='transactions-empty__icon-box'>
                                                <DerivLightEmptyCardboardBoxIcon
                                                    height='64px'
                                                    width='64px'
                                                    className='transactions-empty__icon'
                                                    color='secondary'
                                                />
                                            </div>
                                            <Text
                                                as='h4'
                                                size='sm'
                                                weight='bold'
                                                align='center'
                                                color='less-prominent'
                                                lineHeight='sm'
                                                className='transactions-empty__header'
                                            >
                                                <Localize i18n_default_text='There are no transactions to display' />
                                            </Text>
                                            <div className='transactions-empty__message'>
                                                <Text size='xs' color='less-prominent' lineHeight='3xl'>
                                                    <Localize i18n_default_text='Here are the possible reasons:' />
                                                </Text>
                                                <ul className='transactions-empty__list'>
                                                    <li>
                                                        <Text size='xs' color='less-prominent' lineHeight='3xl'>
                                                            <Localize i18n_default_text='The bot is not running' />
                                                        </Text>
                                                    </li>
                                                    <li>
                                                        <Text size='xs' color='less-prominent' lineHeight='3xl'>
                                                            <Localize i18n_default_text='The stats are cleared' />
                                                        </Text>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </ThemedScrollbars>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default Transactions;
