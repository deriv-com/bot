import { isDemoAccount } from '../auth-utils';

describe('isDemoAccount', () => {
    it('identifies VRTC as demo', () => {
        expect(isDemoAccount('VRTC1234567')).toBe(true);
    });

    it('identifies VRW as demo', () => {
        expect(isDemoAccount('VRW1000001')).toBe(true);
    });

    it('identifies CR as non-demo', () => {
        expect(isDemoAccount('CR1234567')).toBe(false);
    });

    it('identifies MF as non-demo', () => {
        expect(isDemoAccount('MF1234567')).toBe(false);
    });

    it('handles empty string', () => {
        expect(isDemoAccount('')).toBe(false);
    });
});
