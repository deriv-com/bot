import useActiveAccount from '@/hooks/api/account/useActiveAccount';
import { useApiBase } from '@/hooks/useApiBase';

export type TModifiedAccount = ReturnType<typeof useApiBase>['accountList'][number] & {
    balance: string;
    currencyLabel: string;
    icon: React.ReactNode;
    isVirtual: boolean;
    isActive: boolean;
    loginid: number;
    currency: string;
};
export type TAccountSwitcherProps = {
    isVirtual?: boolean;
    modifiedAccountList: TModifiedAccount[];
    switchAccount: (loginId: number) => void;
    modifiedCRAccountList?: TModifiedAccount[];
    modifiedMFAccountList?: TModifiedAccount[];
    activeLoginId?: string;
};

export type TAccountSwitcher = {
    activeAccount: ReturnType<typeof useActiveAccount>['data'];
};
