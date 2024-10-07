import { lazy, Suspense } from 'react';

const CURRENCY_ICONS = {
    aud: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyAudIcon }))),
    bch: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyBchIcon }))),
    btc: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyBtcIcon }))),
    busd: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyBusdIcon }))),
    dai: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyDaiIcon }))),
    eth: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEthIcon }))),
    eur: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEurIcon }))),
    'eur-check': lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEurIcon }))
    ),
    eurs: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEursIcon }))),
    eusdt: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdtIcon }))),
    gbp: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyGbpIcon }))),
    idk: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyIdkIcon }))),
    ltc: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyLtcIcon }))),
    pax: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyPaxIcon }))),
    tusd: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyTusdIcon }))),
    tusdt: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdtIcon }))),
    unknown: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyPlaceholderIcon }))
    ),
    usd: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdIcon }))),
    usdc: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdcIcon }))),
    usdk: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdkIcon }))),
    ust: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUsdtIcon }))),
    virtual: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyDemoIcon }))),
    xrp: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyXrpIcon }))),
    algo: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyAlgoIcon }))),
    avax: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyAvaxIcon }))),
    bat: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyBatIcon }))),
    bnb: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyBnbIcon }))),
    dash: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyDashIcon }))),
    doge: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyDogeIcon }))),
    dot: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyDotIcon }))),
    eos: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEosIcon }))),
    etc: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyEtcIcon }))),
    fil: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyFilIcon }))),
    iota: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyIotaIcon }))),
    link: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyLinkIcon }))),
    matic: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyMaticIcon }))),
    mkr: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyMkrIcon }))),
    mcd: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyMultiCollateralDaiIcon }))
    ),
    neo: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyNeoIcon }))),
    none: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyNoneIcon }))),
    omg: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyOmgIcon }))),
    p2p: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyP2PIcon }))),
    scd: lazy(() =>
        import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencySingleCollateralDaiIcon }))
    ),
    sol: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencySolIcon }))),
    terra: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyTerraIcon }))),
    trx: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyTrxIcon }))),
    uni: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyUniIcon }))),
    xlm: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyXlmIcon }))),
    xmr: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyXmrIcon }))),
    xtz: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyXtzIcon }))),
    zec: lazy(() => import('@deriv/quill-icons/Currencies').then(module => ({ default: module.CurrencyZecIcon }))),
};

export const CurrencyIcon = ({ currency, isVirtual }: { currency?: string; isVirtual?: boolean }) => {
    const Icon = isVirtual
        ? CURRENCY_ICONS.virtual
        : CURRENCY_ICONS[currency?.toLowerCase() as keyof typeof CURRENCY_ICONS] || CURRENCY_ICONS.unknown;

    return (
        <Suspense fallback={null}>
            <Icon iconSize='sm' />
        </Suspense>
    );
};
