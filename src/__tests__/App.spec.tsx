import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';

const useHook = () => {
    return 'hello';
};

describe('App', () => {
    it('should render correctly', async () => {
        render(<App />);

        const clickBtn = screen.getByRole('button', {
            name: 'Click me 💅',
        });
        await userEvent.click(clickBtn);

        expect(screen.getByText('Deriv V2')).toBeInTheDocument();
    });
    it('should return hello for hook', () => {
        const { result } = renderHook(() => useHook());
        expect(result.current).toBe('hello');
    });
});
