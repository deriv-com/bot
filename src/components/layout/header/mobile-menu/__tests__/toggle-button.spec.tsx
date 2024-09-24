import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleButton from '../toggle-button';

const mockOnClick = jest.fn();

describe('ToggleButton component', () => {
    it('renders correctly', () => {
        render(<ToggleButton onClick={mockOnClick} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        render(<ToggleButton onClick={mockOnClick} />);
        await userEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
