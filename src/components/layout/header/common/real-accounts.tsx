import React from 'react';
import { Icon } from '@/utils/tmp/dummy';
import { getBaseTraderHubUrl } from '@/utils/traders-hub-redirect';
import { Localize, localize } from '@deriv-com/translations';
import AccountSwitcherFooter from './account-swticher-footer';
import EuAccounts from './eu-accounts';
import NoNonEuAccounts from './no-non-eu-accounts';
import NonEUAccounts from './non-eu-accounts';
import { TRealAccounts } from './types';
import { AccountSwitcherDivider } from './utils';
import './real-accounts.scss';

const RealAccounts = ({
    modifiedCRAccountList,
    modifiedMFAccountList,
    switchAccount,
    isVirtual,
    tabs_labels,
    is_low_risk_country,
    oAuthLogout,
    loginid,
    is_logging_out,
    upgradeable_landing_companies,
    residence,
}: TRealAccounts) => {
    const hasNonEuAccounts = modifiedCRAccountList && modifiedCRAccountList?.length > 0;
    const hasEuAccounts = modifiedMFAccountList && modifiedMFAccountList?.length > 0;

    const getAccountTitle = (upgradeable_landing_companies: string) => {
        switch (upgradeable_landing_companies) {
            case 'svg':
                return localize('Options & Multipliers');
            case 'maltainvest':
                return localize('Multipliers');
            default:
                return localize('Deriv');
        }
    };
    return (
        <>
            {hasNonEuAccounts ? (
                <>
                    <NonEUAccounts
                        modifiedCRAccountList={modifiedCRAccountList}
                        modifiedMFAccountList={modifiedMFAccountList}
                        switchAccount={switchAccount}
                        isVirtual={isVirtual}
                        tabs_labels={tabs_labels}
                        is_low_risk_country={is_low_risk_country}
                    />
                    <AccountSwitcherDivider />
                </>
            ) : (
                <>
                    <NoNonEuAccounts
                        is_low_risk_country={is_low_risk_country}
                        isVirtual={isVirtual}
                        tabs_labels={tabs_labels}
                        residence={residence}
                    />
                    <AccountSwitcherDivider />
                </>
            )}
            {!hasNonEuAccounts && !hasEuAccounts && upgradeable_landing_companies && (
                <div key={upgradeable_landing_companies} className='real-accounts__account-item'>
                    <div className='real-accounts__account-item-left'>
                        <Icon icon='ic-deriv' className='deriv-account-switcher-item__icon' />
                        <span className='real-accounts__account-item-left-text'>
                            {getAccountTitle(upgradeable_landing_companies ?? '')}
                        </span>
                    </div>
                    <button
                        className='add-button'
                        onClick={() => {
                            const baseUrl = getBaseTraderHubUrl();
                            const redirectUrl = `${baseUrl}/tradershub/redirect?action=real-account-signup&target=${upgradeable_landing_companies}`;
                            window.location.href = redirectUrl;
                        }}
                    >
                        <span>
                            <Localize i18n_default_text='Add' />
                        </span>
                    </button>
                </div>
            )}
            {hasEuAccounts && (
                <>
                    <EuAccounts
                        modifiedMFAccountList={modifiedMFAccountList}
                        switchAccount={switchAccount}
                        isVirtual={isVirtual}
                        tabs_labels={tabs_labels}
                        is_low_risk_country={is_low_risk_country}
                    />
                    <AccountSwitcherDivider />
                </>
            )}
            <AccountSwitcherFooter
                oAuthLogout={oAuthLogout}
                loginid={loginid}
                is_logging_out={is_logging_out}
                residence={residence}
                type='real'
            />
        </>
    );
};

export default RealAccounts;
