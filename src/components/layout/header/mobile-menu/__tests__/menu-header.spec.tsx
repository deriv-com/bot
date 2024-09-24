import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuHeader from '../menu-header';

const mockOpenLanguageSetting = jest.fn();

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn(),
}));

describe('MenuHeader component', () => {
    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'EN',
            localize: jest.fn(text => text),
        });
    });

    it('renders "Menu" with "lg" text size in mobile view', () => {
        render(<MenuHeader hideLanguageSetting={false} openLanguageSetting={mockOpenLanguageSetting} />);
        expect(screen.getByText('Menu')).toHaveClass('derivs-text__size--lg');
    });

    it('renders "Menu" with "md" text size in desktop view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<MenuHeader hideLanguageSetting={false} openLanguageSetting={mockOpenLanguageSetting} />);
        expect(screen.getByText('Menu')).toHaveClass('derivs-text__size--md');
    });

    it('does not render language setting button when hideLanguageSetting is true', () => {
        render(<MenuHeader hideLanguageSetting openLanguageSetting={mockOpenLanguageSetting} />);
        expect(screen.queryByText('EN')).not.toBeInTheDocument();
    });

    it('renders language setting button with correct content when hideLanguageSetting is false', () => {
        render(<MenuHeader hideLanguageSetting={false} openLanguageSetting={mockOpenLanguageSetting} />);
        expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('calls openLanguageSetting when language button is clicked', async () => {
        render(<MenuHeader hideLanguageSetting={false} openLanguageSetting={mockOpenLanguageSetting} />);
        await userEvent.click(screen.getByText('EN'));
        expect(mockOpenLanguageSetting).toHaveBeenCalled();
    });
});
