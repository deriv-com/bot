import { act, render } from '@testing-library/react';
import Bot from '../app';

jest.mock('@deriv-com/translations', () => ({
    ...jest.requireActual('@deriv-com/translations'),
    TranslationProvider: jest.fn(({ children }) => <>{children}</>),
}));

describe('Bot component', () => {
    it('renders app-main and all the childrens', async () => {
        let container;
        await act(async () => {
            const result = await render(<Bot />);
            container = result.container;
        });
        expect(container).toBeDefined();
    });
});
