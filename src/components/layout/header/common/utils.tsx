import { LegacyDerivIcon } from '@deriv/quill-icons';
import { Divider } from '@deriv-com/ui';

export const no_account = {
    currency: ' ',
    currencyLabel: 'Options & Multipliers',
    is_virtual: 1,
    loginid: '',
    is_disabled: false,
    balance: '',
    icon: <LegacyDerivIcon width={24} height={24} />,
    isActive: false,
    isVirtual: true,
};

export const convertCommaValue = (str: string) => {
    return Number(str.replace(/,/g, ''));
};

export const AccountSwitcherDivider = () => <Divider color='var(--general-section-2)' height='4px' />;
