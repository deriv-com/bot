import { BrowserRouter } from 'react-router-dom';
import useModalManager from '@/hooks/useModalManager';
import { mockStore, StoreProvider } from '@/hooks/useStore';
import { mock_ws } from '@/utils/mock';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from '../mobile-menu';

jest.mock('@/hooks/useModalManager', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        hideModal: jest.fn(),
        isModalOpenFor: jest.fn().mockReturnValue(false),
        showModal: jest.fn(),
    }),
}));
jest.mock('@/hooks/useNetworkStatus', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue('online'),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

describe('MobileMenu component', () => {
    const mock_store = mockStore(mock_ws as any);

    const MobileMenuComponent = () => (
        <BrowserRouter>
            <StoreProvider mockStore={mock_store}>
                <MobileMenu />
            </StoreProvider>
        </BrowserRouter>
    );

    it('should not render when isDesktop is true', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<MobileMenuComponent />);
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });

    it('should render toggle button and handle click', async () => {
        mock_store.client.is_logged_in = true;
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(<MobileMenuComponent />);
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Menu')).toBeInTheDocument();
    });

    it('should open the language settings', async () => {
        mock_store.client.is_logged_in = true;
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        const { isModalOpenFor, showModal } = useModalManager();

        render(<MobileMenuComponent />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('EN')).toBeInTheDocument();

        await userEvent.click(screen.getByText('EN'));

        expect(showModal).toHaveBeenCalledWith('MobileLanguagesDrawer');
        expect(isModalOpenFor).toHaveBeenCalledWith('MobileLanguagesDrawer');
    });
});
