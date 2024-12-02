import React from 'react';
import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import Text from '@/components/shared_ui/text';
import ThemedScrollbars from '@/components/shared_ui/themed-scrollbars';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { StandaloneChevronDownBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { AccountSwitcherWalletList } from './account-switcher-wallet-list';
import './account-switcher-wallet.scss';
import '../wallets/wallet.scss';

type TAccountSwitcherWalletProps = {
    is_visible: boolean;
    toggle: (value?: boolean) => void;
};

export const AccountSwitcherWallet = observer(({ is_visible, toggle }: TAccountSwitcherWalletProps) => {
    const { data: wallet_list } = useStoreWalletAccountsList();
    const dtrade_account_wallets = wallet_list?.filter(wallet => wallet.dtrade_loginid);

    const wrapper_ref = React.useRef<HTMLDivElement>(null);

    const validateClickOutside = (event: MouseEvent) => {
        const checkAllParentNodes = (node: HTMLElement): boolean => {
            if (node?.classList?.contains('acc-info__wallets')) return true;
            const parent = node?.parentNode as HTMLElement;
            if (parent) return checkAllParentNodes(parent);
            return false;
        };

        return is_visible && !checkAllParentNodes(event.target as HTMLElement);
    };

    const closeAccountsDialog = React.useCallback(() => {
        toggle(false);
    }, [toggle]);

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const handleTradersHubRedirect = async () => {
        closeAccountsDialog();
        window.location.assign(standalone_routes.traders_hub);
    };

    return (
        <div className='account-switcher-wallet' ref={wrapper_ref}>
            <div className='account-switcher-wallet__header'>
                <Text as='h4' weight='bold' size='xs'>
                    <Localize i18n_default_text='Options accounts' />
                </Text>
            </div>
            <ThemedScrollbars height={450}>
                <AccountSwitcherWalletList wallets={dtrade_account_wallets} closeAccountsDialog={closeAccountsDialog} />
            </ThemedScrollbars>
            <button
                className='account-switcher-wallet__looking-for-cfds'
                onClick={handleTradersHubRedirect}
                type='button'
            >
                <Text size='xs' lineHeight='xl'>
                    <Localize i18n_default_text='Looking for CFDs? Go to Trader’s Hub' />
                </Text>
                <div data-testid='dt_go_to_arrow' className='account-switcher-wallet__arrow'>
                    <StandaloneChevronDownBoldIcon />
                </div>
            </button>
        </div>
    );
});
