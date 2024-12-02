import { standalone_routes } from '@/components/shared';
import { Localize, localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher, Button } from '@deriv-com/ui';
import { TNoEuAccounts } from './types';
import { AccountSwitcherDivider, no_account } from './utils';

const NoEuAccounts = ({ isVirtual, tabs_labels, is_low_risk_country }: TNoEuAccounts) => {
    if (!is_low_risk_country) {
        return null;
    }
    return (
        <UIAccountSwitcher.AccountsPanel
            isOpen
            title={localize('Non-Eu Deriv account')}
            className='account-switcher-panel'
            key={!isVirtual ? tabs_labels?.demo?.toLowerCase() : tabs_labels?.real?.toLowerCase()}
        >
            <div className='account-switcher-panel__no-eu-accounts'>
                <UIAccountSwitcher.AccountsItem account={no_account} onSelectAccount={() => {}} />
                <AccountSwitcherDivider />
                <Button
                    id='add-button'
                    className='add-button'
                    onClick={() => location.replace(standalone_routes.traders_hub)}
                >
                    <Localize i18n_default_text='Add' />
                </Button>
            </div>
        </UIAccountSwitcher.AccountsPanel>
    );
};

export default NoEuAccounts;
