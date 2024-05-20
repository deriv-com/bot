import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from '@/utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from '@/stores/__useDBotStore';
import ContractResultOverlay from '../contract-result-overlay';

jest.mock('@/external/bot-skeleton/scratch/blockly', () => jest.fn());
jest.mock('@/external/bot-skeleton/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@/external/bot-skeleton/scratch/hooks/block_svg', () => jest.fn());

describe('ContractResultOverlay', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        jest.resetModules();
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the ContractResultOverlay component', () => {
        const { container } = render(<ContractResultOverlay profit={0} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should show contract won', () => {
        render(<ContractResultOverlay profit={0} />, {
            wrapper,
        });
        expect(screen.getByText('Won')).toBeInTheDocument();
    });

    it('should show contract lost', () => {
        render(<ContractResultOverlay profit={-1} />, {
            wrapper,
        });
        expect(screen.getByText('Lost')).toBeInTheDocument();
    });
});
