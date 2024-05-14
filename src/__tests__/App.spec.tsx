import { describe, expect, it } from 'vitest';

import { render, renderHook } from '@testing-library/react';

import App from '../App';

const useHook = () => {
    return 'hello';
};

describe('App', () => {
    it('should render correctly', async () => {
        const { container } = render(<App />);
        expect(container).toBeDefined();
    });
    it('should return hello for hook', () => {
        const { result } = renderHook(() => useHook());
        expect(result.current).toBe('hello');
    });
});
