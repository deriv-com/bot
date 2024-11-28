import { lazy, Suspense } from 'react';
import { IconSize } from '@deriv/quill-icons';

const WALLET_ICONS = {
    IcWalletDerivDemoLight: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodDerivDemoBrandDarkIcon }))
    ),
    IcWalletDerivDemoDark: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodDerivDemoBrandDarkIcon }))
    ),
    IcWalletCurrencyUsdLight: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdIcon }))
    ),
    IcWalletCurrencyUsdDark: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdIcon }))
    ),
    IcWalletCurrencyEurLight: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEurIcon }))
    ),
    IcWalletCurrencyEurDark: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEurIcon }))
    ),
    IcWalletCurrencyAudLight: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyAudIcon }))
    ),
    IcWalletCurrencyAudDark: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyAudIcon }))
    ),
    IcWalletCurrencyGbpLight: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyGbpIcon }))
    ),
    IcWalletCurrencyGbpDark: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyGbpIcon }))
    ),
    IcWalletBitcoinLight: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyBtcIcon }))
    ),
    IcWalletBitcoinDark: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyBtcIcon }))
    ),
    IcWalletEthereumLight: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEthIcon }))
    ),
    IcWalletEthereumDark: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEthIcon }))
    ),
    IcWalletTetherLight: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodTetherUsdtBrandIcon }))
    ),
    IcWalletTetherDark: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodTetherUsdtBrandIcon }))
    ),
    IcWalletLiteCoinLight: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodLitecoinBrandIcon }))
    ),
    IcWalletLiteCoinDark: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodLitecoinBrandIcon }))
    ),
    IcWalletUsdCoinLight: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodUsdCoinBrandIcon }))
    ),
    IcWalletUsdCoinDark: lazy(() =>
        import('@deriv/quill-icons/Logo').then(module => ({ default: module.PaymentMethodUsdCoinBrandIcon }))
    ),
    IcWalletXrpLight: lazy(() =>
        import('@deriv/quill-icons/PaymentMethods').then(module => ({ default: module.PaymentMethodXrpBrandIcon }))
    ),
    IcWalletXrpDark: lazy(() =>
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
