import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackButton from '../back-button';

const mockOnClick = jest.fn();

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

describe('BackButton Component', () => {
    it('renders the button with the correct text', () => {
        render(<BackButton buttonText='Go Back' onClick={mockOnClick} />);
        expect(screen.getByRole('button')).toBeDefined();
    });

    it('calls the onClick handler when clicked', async () => {
        render(<BackButton buttonText='Go Back' onClick={mockOnClick} />);
        await userEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('adjusts the text size for mobile devices', () => {
        render(<BackButton buttonText='Go Back' onClick={mockOnClick} />);
        const textComponent = screen.getByText('Go Back');
        expect(textComponent).toHaveClass('derivs-text__size--lg');
    });

    it('uses a smaller text size for non-mobile devices', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<BackButton buttonText='Go Back' onClick={mockOnClick} />);
        const textComponent = screen.getByText('Go Back');
        expect(textComponent).toHaveClass('derivs-text__size--md');
    });
});
