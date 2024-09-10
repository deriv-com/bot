import { render, screen } from '@testing-library/react';
import ContractCardRunningBot, { message_running_bot } from '../contract-card-running-bot';

jest.mock('@/external/bot-skeleton/scratch/dbot.js', () => ({}));

describe('ContractCardRunningBot', () => {
    it('renders ContractCardRunningBot with the Icon component with correct props', () => {
        const { container } = render(<ContractCardRunningBot />);
        const svg = container.getElementsByTagName('svg')[0];
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('id', 'rotate-icon');
        expect(svg).toHaveAttribute('height', '24');
        expect(svg).toHaveAttribute('width', '16');
    });

    it('renders ContractCardRunningBot with the Text component with the correct text and styles', () => {
        render(<ContractCardRunningBot />);
        const text = screen.getByText(message_running_bot);
        expect(text).toBeInTheDocument();
        expect(text).toHaveClass('dc-contract-card-message');
    });
});
