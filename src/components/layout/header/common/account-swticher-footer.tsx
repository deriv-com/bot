import React from 'react';
import classNames from 'classnames';
import RectangleSkeleton from '@/components/loader/rectangle-skeleton';
import { standalone_routes } from '@/components/shared';
import Button from '@/components/shared_ui/button';
import Text from '@/components/shared_ui/text';
import useStoreWalletAccountsList from '@/hooks/useStoreWalletAccountsList';
import { getWalletUrl, handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
import { LegacyLogout1pxIcon } from '@deriv/quill-icons';
import { Localize, localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { TAccountSwitcherFooter } from './types';
import { AccountSwitcherDivider } from './utils';

const AccountSwitcherFooter = ({ oAuthLogout, loginid, is_logging_out }: TAccountSwitcherFooter) => {
    const accountList = JSON.parse(localStorage.getItem('clientAccounts') || '{}');
    const account_currency = loginid ? accountList[loginid]?.currency : '';
    const show_manage_button = loginid?.includes('CR') || loginid?.includes('MF');
    const { has_wallet = false } = useStoreWalletAccountsList() || {};

    // Check if the account is a demo account from both loginid and URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const account_param = urlParams.get('account');
    const is_virtual = loginid?.startsWith('VRTC') || account_param === 'demo' || false;

    // Get the redirect URL from handleTraderHubRedirect
    const redirect_url_str = handleTraderHubRedirect('cfds', has_wallet, is_virtual) || standalone_routes.traders_hub;

    // Add the account parameter to the URL
    let final_url_str = redirect_url_str;
    try {
        const redirect_url = new URL(redirect_url_str);
        if (is_virtual) {
            // For demo accounts, set the account parameter to 'demo'
            redirect_url.searchParams.set('account', 'demo');
        } else if (account_currency) {
            // For real accounts, set the account parameter to the currency
            redirect_url.searchParams.set('account', account_currency);
        }
        final_url_str = redirect_url.toString();
    } catch (error) {
        console.error('Error parsing redirect URL:', error);
    }

    return (
        <div className=''>
            <UIAccountSwitcher.TradersHubLink href={final_url_str}>
                {localize(`Looking for CFD accounts? Go to Trader's Hub`)}
            </UIAccountSwitcher.TradersHubLink>
            <AccountSwitcherDivider />
            <div
                className={classNames('account-switcher-footer__actions', {
                    'account-switcher-footer__actions--hide-manage-button': !show_manage_button,
                })}
            >
                {show_manage_button && (
                    <Button
                        id='manage-button'
                        className='manage-button'
                        onClick={() => {
                            if (has_wallet) {
                                const wallet_url = getWalletUrl();
                                location.replace(wallet_url);
                            } else {
                                location.replace(final_url_str);
                            }
                        }}
                    >
                        <Localize i18n_default_text='Manage accounts' />
                    </Button>
                )}
                <UIAccountSwitcher.Footer>
                    {is_logging_out ? (
                        <div className='deriv-account-switcher__logout--loader'>
                            <RectangleSkeleton width='120px' height='12px' />
                        </div>
                    ) : (
                        <div id='dt_logout_button' className='deriv-account-switcher__logout' onClick={oAuthLogout}>
                            <Text
                                color='prominent'
                                size='xs'
                                align='left'
                                className='deriv-account-switcher__logout-text'
                            >
                                {localize('Logout')}
                            </Text>
                            <LegacyLogout1pxIcon
                                iconSize='xs'
                                fill='var(--text-general)'
                                className='icon-general-fill-path'
                            />
                        </div>
                    )}
                </UIAccountSwitcher.Footer>
            </div>
        </div>
    );
};

export default AccountSwitcherFooter;
