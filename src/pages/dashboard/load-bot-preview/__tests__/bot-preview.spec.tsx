import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render } from '@testing-library/react';
import { mock_ws } from '@/utils/mock';
import { DBotStoreProvider, mockDBotStore } from '@/stores/__useDBotStore';
import BotPreview from '../bot-preview';

jest.mock('@/external/bot-skeleton/scratch/blockly', () => jest.fn());
jest.mock('@/external/bot-skeleton/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@/external/bot-skeleton/scratch/hooks/block_svg', () => jest.fn());
describe('BotPreview', () => {
    it('should render BotPreview component with ref', () => {
        const mock_store = mockStore({});
        const mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const ref = React.createRef<HTMLDivElement>();

        render(
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <BotPreview id_ref={ref} />
                </DBotStoreProvider>
            </StoreProvider>
        );

        expect(ref.current).toBeInTheDocument();
    });
});
