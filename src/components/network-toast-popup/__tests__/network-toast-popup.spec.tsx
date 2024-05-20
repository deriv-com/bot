import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen } from '@testing-library/react';
import { mock_ws } from '@/utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider } from '@/stores/__useDBotStore';
import NetworkToastPopup from '..';

jest.mock('@/external/bot-skeleton/scratch/blockly', () => jest.fn());
jest.mock('@/external/bot-skeleton/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

jest.mock('@deriv-com/utils', () => ({
    ...jest.requireActual('@deriv-com/utils'),
    isMobile: () => true,
}));

jest.useFakeTimers();

const addPopupRootToDom = (root_name?: string) => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', root_name ?? 'popup_root');
    document.body.appendChild(modal_root_el);
};

describe('NetworkToastPopup', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        addPopupRootToDom();
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render NetworkToastPopup message', () => {
        mock_store.common.network_status.message = 'Network is down!';
        mock_store.common.network_status.status = 'blinker';
        render(<NetworkToastPopup />, { wrapper });
        expect(screen.getByText(mock_store.common.network_status.message)).toBeInTheDocument();
    });

    it('should not render NetworkToastPopup if status is online', () => {
        mock_store.common.network_status.message = 'Network is back!';
        mock_store.common.network_status.status = 'online';
        render(<NetworkToastPopup should_open={true} />, { wrapper });
        act(() => {
            jest.advanceTimersByTime(1500);
        });
        const toast = screen.queryByTestId('dt_network_status_toast');
        expect(toast).not.toBeInTheDocument();
    });

    it('should not render NetworkToastPopup if no message found', () => {
        mock_store.common.network_status.message = '';
        render(<NetworkToastPopup />, { wrapper });
        const toast = screen.queryByTestId('dt_network_status_toast');
        expect(toast).not.toBeInTheDocument();
    });
});
