import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    createBrowserRouter: jest.fn(),
    RouterProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid='router-provider'>{children}</div>
    ),
}));

jest.mock('@deriv-com/translations', () => ({
    TranslationProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid='translation-provider'>{children}</div>
    ),
    initializeI18n: jest.fn(),
    localize: jest.fn(),
    Localize: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid='query-client-provider'>{children}</div>
    ),
    QueryClient: jest.fn(),
}));

// eslint-disable-next-line react/display-name
jest.mock('@/components/layout', () => () => <div data-testid='layout'>Layout</div>);

jest.mock('@/hooks/useStore', () => ({
    StoreProvider: ({ children }: { children: React.ReactNode }) => <div data-testid='store-provider'>{children}</div>,
}));

// eslint-disable-next-line react/display-name
jest.mock('@/components/route-prompt-dialog', () => () => (
    <div data-testid='route-prompt-dialog'>RoutePromptDialog</div>
));

describe('App Component', () => {
    it('renders without crashing', async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Wait for the Suspense fallback to resolve
        await waitFor(() => {
            expect(screen.getByTestId('router-provider')).toBeInTheDocument();
        });
    });
});
