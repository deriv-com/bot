import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuContent } from '../MenuContent';

const mockSettingsButtonClick = jest.fn();

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

jest.mock('@deriv-com/api-hooks', () => ({
    useAuthData: jest.fn().mockReturnValue({
        isAuthorized: true,
    }),
}));

jest.mock('../../PlatformSwitcher', () => ({
    PlatformSwitcher: () => <div>PlatformSwitcher</div>,
}));

jest.mock('../MobileMenuConfig', () => ({
    MobileMenuConfig: jest.fn(() => [
        [
            {
                as: 'a',
                href: '/home',
                label: 'Home',
                LeftComponent: () => <span>Home Icon</span>,
                removeBorderBottom: false,
            },
        ],
        [
            {
                as: 'button',
                label: 'Settings',
                LeftComponent: () => <span>Settings Icon</span>,
                onClick: mockSettingsButtonClick,
                removeBorderBottom: true,
            },
        ],
    ]),
}));

describe('MenuContent Component', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            value: jest.fn(),
            writable: true,
        });
    });

    it('renders PlatformSwitcher and MenuItem components correctly', () => {
        render(<MenuContent />);
        expect(screen.getByText('PlatformSwitcher')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders MenuItem as an anchor when `as` prop is "a"', () => {
        render(<MenuContent />);
        expect(screen.getByRole('link', { name: 'Home Icon Home' })).toBeInTheDocument();
    });

    it('renders anchor props correctly', () => {
        render(<MenuContent />);
        const link = screen.getByRole('link', { name: 'Home Icon Home' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/home');
        expect(screen.getByText('Home Icon')).toBeInTheDocument();
    });

    it('renders MenuItem as a button when `as` prop is "button"', () => {
        render(<MenuContent />);
        expect(screen.getByRole('button', { name: 'Settings Icon Settings' })).toBeInTheDocument();
    });

    it('renders button props correctly', async () => {
        render(<MenuContent />);
        const settingsButton = screen.getByRole('button', { name: 'Settings Icon Settings' });
        expect(settingsButton).toBeInTheDocument();
        await userEvent.click(settingsButton);
        expect(mockSettingsButtonClick).toHaveBeenCalled();
    });

    it('adjusts text size for mobile devices', () => {
        render(<MenuContent />);
        const text = screen.getByText('Home');
        expect(text).toHaveClass('derivs-text__size--md');
    });

    it('adjusts text size for desktop devices', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<MenuContent />);
        const text = screen.getByText('Home');
        expect(text).toHaveClass('derivs-text__size--sm');
    });

    it('applies conditional border styles based on configuration', () => {
        render(<MenuContent />);
        expect(screen.getAllByTestId('dt_menu_item')[0]).toHaveClass('border-b');
        expect(screen.getAllByTestId('dt_menu_item')[1]).not.toHaveClass('border-b');
    });
});
