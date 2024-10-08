import React from 'react';
import classNames from 'classnames';
import { LabelPairedChevronDownLgRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { TItem } from '../types/common.types';
import ArrayRenderer from './array-renderer';

type TExpansionPanel = {
    message: { header: React.ReactNode; content: (Array<React.ReactNode> & Array<TItem>) | React.ReactNode };
    onResize?: () => void;
};

const ExpansionPanel = ({ message, onResize }: TExpansionPanel) => {
    const [open_ids, setOpenIds] = React.useState<string[]>([]);
    const [is_open, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (typeof onResize === 'function') {
            onResize();
        }
    }, [is_open, onResize]);

    const onClick = () => {
        // close if clicking the expansion panel that's open, otherwise open the new one
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            <div
                className={classNames('dc-expansion-panel__header-container', {
                    'dc-expansion-panel__header-active': is_open,
                })}
            >
                {message.header}
                <LabelPairedChevronDownLgRegularIcon
                    className='dc-expansion-panel__header-chevron-icon'
                    onClick={onClick}
                    height='24px'
                    width='24px'
                />
            </div>
            {is_open &&
                (Array.isArray(message.content) ? (
                    <ArrayRenderer array={message.content} open_ids={open_ids} setOpenIds={setOpenIds} />
                ) : (
                    message.content
                ))}
        </React.Fragment>
    );
};

export default ExpansionPanel;
