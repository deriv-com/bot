import { lazy, Suspense } from 'react';
import { IconSize } from '@deriv/quill-icons';

const TRADE_TYPE_ICONS = {
    ACCU: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesAccumulatorStayInIcon }))
    ),
    DIGITDIFF: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesDigitsDiffersIcon }))
    ),
    DIGITEVEN: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesDigitsEvenIcon }))
    ),
    DIGITMATCH: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesDigitsMatchesIcon }))
    ),
    DIGITODD: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesDigitsOddIcon }))
    ),
    DIGITOVER: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesDigitsOverIcon }))
    ),
    DIGITUNDER: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesDigitsUnderIcon }))
    ),
    TICKHIGH: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesHighsAndLowsHighIcon }))
    ),
    TICKLOW: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesHighsAndLowsLowIcon }))
    ),
    NOTOUCH: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesHighsAndLowsNoTouchIcon }))
    ),
    ONETOUCH: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesHighsAndLowsTouchIcon }))
    ),
    EXPIRYRANGE: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesInsAndOutsEndsInIcon }))
    ),
    EXPIRYMISS: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesInsAndOutsEndsOutIcon }))
    ),
    UPORDOWN: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesInsAndOutsGoesOutIcon }))
    ),
    RANGE: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesInsAndOutsStaysInIcon }))
    ),
    MULTDOWN: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesMultipliersDownIcon }))
    ),
    MULTUP: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesMultipliersUpIcon }))
    ),
    CALLSPREAD: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesSpreadsCallIcon }))
    ),
    PUTSPREAD: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesSpreadsPutIcon }))
    ),
    ASIAND: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsAsianDownIcon }))
    ),
    ASIANU: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsAsianUpIcon }))
    ),
    PUT: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsFallIcon }))
    ),
    PUTE: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsFallIcon }))
    ),
    RUNLOW: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsOnlyDownsIcon }))
    ),
    RUNHIGH: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsOnlyUpsIcon }))
    ),
    RESETPUT: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsResetDownIcon }))
    ),
    RESETCALL: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsResetUpIcon }))
    ),
    CALL: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsRiseIcon }))
    ),
    CALLE: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesUpsAndDownsRiseIcon }))
    ),
    HIGHER: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesHighsAndLowsHigherIcon }))
    ),
    LOWER: lazy(() =>
        import('@deriv/quill-icons/TradeTypes').then(module => ({ default: module.TradeTypesHighsAndLowsLowerIcon }))
    ),
    unknown: lazy(() =>
        import('@deriv/quill-icons/Illustrative').then(module => ({ default: module.IllustrativeMarketsIcon }))
    ),
};

export const TradeTypeIcon = ({ type, size, className }: { type: string; size?: IconSize; className?: string }) => {
    const Icon = TRADE_TYPE_ICONS[type?.toUpperCase() as keyof typeof TRADE_TYPE_ICONS] || TRADE_TYPE_ICONS.unknown;

    return (
        <Suspense fallback={null}>
            <Icon iconSize={size ?? 'xs'} className={className} />
        </Suspense>
    );
};
