import React from 'react';
import { MessageTypes } from '@/external/bot-skeleton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Filters from '../filters';

jest.mock('@/external/bot-skeleton/scratch/blockly', () => jest.fn());
jest.mock('@/external/bot-skeleton/scratch/dbot', () => jest.fn());
jest.mock('@/external/bot-skeleton/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

const journal_filters = [
    { id: MessageTypes.ERROR, label: 'Errors' },
    { id: MessageTypes.NOTIFY, label: 'Notifications' },
    { id: MessageTypes.SUCCESS, label: 'System' },
];

const mockFilterMessage = jest.fn();

const createMockRef = React.createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>;

describe('<Filters />', () => {
    it('should render filter component', () => {
        render(
            <Filters
                wrapper_ref={createMockRef}
                checked_filters={journal_filters}
                filters={journal_filters}
                filterMessage={mockFilterMessage}
                className='sample-classname'
                classNameLabel='sample-classname-label'
                id='test'
            />
        );
        const el = screen.getByText('Errors');
        userEvent.click(el);
        // eslint-disable-next-line testing-library/no-node-access
        const element = document.querySelector('.dc-checkbox__box.dc-checkbox__box--active');
        expect(element).toHaveClass('dc-checkbox__box--active');
    });
});
