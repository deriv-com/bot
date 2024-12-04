import React from 'react';
import classNames from 'classnames';
import RectangleSkeleton from '@/components/loader/rectangle-skeleton';
import { standalone_routes } from '@/components/shared';
import Button from '@/components/shared_ui/button';
import Text from '@/components/shared_ui/text';
import { LegacyLogout1pxIcon } from '@deriv/quill-icons';
import { Localize, localize } from '@deriv-com/translations';
import { AccountSwitcher as UIAccountSwitcher } from '@deriv-com/ui';
import { TAccountSwitcherFooter } from './types';
import { AccountSwitcherDivider } from './utils';

const AccountSwitcherFooter = ({ oAuthLogout, loginid, is_logging_out }: TAccountSwitcherFooter) => {
    const show_manage_button = loginid?.includes('CR') || loginid?.includes('MF');

    return (
        <div className=''>
            <UIAccountSwitcher.TradersHubLink href={standalone_routes.traders_hub}>
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
                        onClick={() => location.replace('https://app.deriv.com')}
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
