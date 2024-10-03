import classnames from 'classnames';
import { MessageTypes } from '@/external/bot-skeleton';
import { isDbotRTL } from '@/external/bot-skeleton/utils/workspace';
import { TJournalItemExtra, TJournalItemProps } from '../journal.types';
import DateItem from './date-item';
import FormatMessage from './format-message';

const getJournalItemContent = (
    message: string | ((value: () => void) => string),
    type: string,
    className: string,
    extra: TJournalItemExtra,
    measure: () => void
) => {
    switch (type) {
        case MessageTypes.SUCCESS: {
            return <FormatMessage logType={message as string} extra={extra} className={className} />;
        }
        case MessageTypes.NOTIFY: {
            if (typeof message === 'function') {
                return <div className={classnames('journal__text', className)}>{message(measure)}</div>;
            }
            return <div className={classnames('journal__text', className)}>{message}</div>;
        }
        case MessageTypes.ERROR: {
            return <div className='journal__text--error journal__text'>{message as string}</div>;
        }
        default:
            return null;
    }
};

const JournalItem = ({ row, measure }: TJournalItemProps) => {
    const { date, time, message, message_type, className, extra } = row;
    const date_el = DateItem({ date, time });

    return (
        <div>
            <div className='list__animation' data-testid='mock-css-transition'>
                <div className='journal__item' dir={isDbotRTL() ? 'rtl' : 'ltr'}>
                    <div className='journal__item-content'>
                        {getJournalItemContent(message, message_type, className, extra as TJournalItemExtra, measure)}
                    </div>
                    <div className='journal__text-datetime'>{date_el}</div>
                </div>
            </div>
        </div>
    );
};

export default JournalItem;
