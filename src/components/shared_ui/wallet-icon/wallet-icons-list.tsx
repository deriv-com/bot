import { lazy, Suspense } from 'react';
import { IconSize } from '@deriv/quill-icons';

const WALLET_ICONS = {
    IcWalletDerivDemoLight: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodDerivDemoBrandIcon }))
    ),
    USD: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdIcon }))),
    EUR: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEurIcon }))),
    AUD: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyAudIcon }))),
    GBP: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyGbpIcon }))),
    BTC: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyBtcIcon }))),
    ETH: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEthIcon }))),
    USDT: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdtIcon }))),
    eUSDT: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodTetherUsdtBrandIcon }))
    ),
    IcWalletTetherLight: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodTetherUsdtBrandIcon }))
    ),
    UST: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdtIcon }))),
    IcWalletLiteCoinLight: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodLitecoinBrandIcon }))
    ),
    USDC: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodUsdCoinBrandIcon }))
    ),
    XRP: lazy(() =>
        import('@deriv/quill-icons/PaymentMethods').then(module => ({ default: module.PaymentMethodXrpBrandIcon }))
    ),
    unknown: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdIcon }))),
};

export const WalletIconList = ({ type, size }: { type: string; size?: IconSize }) => {
    const Icon = WALLET_ICONS[type as keyof typeof WALLET_ICONS] || WALLET_ICONS.unknown;

    return (
        <Suspense fallback={null}>
            <Icon iconSize={size ?? 'xs'} />
        </Suspense>
    );
};
