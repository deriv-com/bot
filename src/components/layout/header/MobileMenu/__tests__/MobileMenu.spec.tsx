import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import useModalManager from '@/hooks/useModalManager';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from '../MobileMenu';

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
jest.mock('@/hooks/useSyncedTime', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('@deriv-com/api-hooks', () => ({
    useAuthData: jest.fn().mockReturnValue({
        isAuthorized: true,
    }),
}));

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn().mockReturnValue({
        currentLang: 'EN',
        localize: jest.fn(text => text),
    }),
}));

const MobileMenuComponent = () => (
    <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter5Adapter}>
            <MobileMenu />
        </QueryParamProvider>
    </BrowserRouter>
);

describe('MobileMenu component', () => {
    it('should not render when isDesktop is true', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<MobileMenuComponent />);
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });

    it('should render toggle button and handle click', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(<MobileMenuComponent />);
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Menu')).toBeInTheDocument();
    });

    it('should open the language settings', async () => {
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
