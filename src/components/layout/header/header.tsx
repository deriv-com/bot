import clsx from 'clsx';
import useActiveAccount from '@/hooks/api/account/useActiveAccount';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Header, Text, useDevice, Wrapper } from '@deriv-com/ui';
import { Tooltip } from '@deriv-com/ui';
import { URLUtils } from '@deriv-com/utils';
import { AppLogo } from '../app-logo';
import AccountsInfoLoader from './account-info-loader';
import AccountSwitcher from './account-switcher';
import MenuItems from './menu-items';
import MobileMenu from './mobile-menu';
import { Notifications } from './notifications';
import PlatformSwitcher from './platform-switcher';
import './header.scss';

const { getOauthURL } = URLUtils;

const AppHeader = () => {
    const { isDesktop } = useDevice();
    const { activeLoginid, isAuthorizing } = useAuthData();
    const { data: activeAccount } = useActiveAccount();

    const { localize } = useTranslations();

    const renderAccountSection = () => {
        if (isAuthorizing) {
            return <AccountsInfoLoader isLoggedIn isMobile={!isDesktop} speed={3} />;
        } else if (activeLoginid) {
            return (
                <>
                    <Notifications />
                    {isDesktop && (
                        <Tooltip
                            as='a'
                            href='https://app.deriv.com/account/personal-details'
                            tooltipContent={localize('Manage account settings')}
                            tooltipPosition='bottom'
                            className='app-header__account-settings'
                        >
                            <StandaloneCircleUserRegularIcon className='app-header__profile_icon' />
                        </Tooltip>
                    )}
                    <AccountSwitcher activeAccount={activeAccount} />
                    <Button
                        onClick={() => {
                            window.location.assign('https://app.deriv.com/cashier/deposit');
                        }}
                        size='md'
                        className='deposit-button'
                    >
                        <Text size='sm' weight='bold'>
                            {localize('Deposit')}
                        </Text>
                    </Button>
                </>
            );
        } else {
            return (
                <div className='auth-actions'>
                    <Button
                        borderWidth='sm'
                        color='primary-light'
                        variant='ghost'
                        onClick={() => {
                            window.location.assign(getOauthURL());
                        }}
                    >
                        <Localize i18n_default_text='Log in' />
                    </Button>
                    <Button
                        size='md'
                        onClick={() => {
                            window.location.assign(getOauthURL());
                        }}
                    >
                        <Localize i18n_default_text='Sign up' />
                    </Button>
                </div>
            );
        }
    };

    return (
        <Header
            className={clsx('app-header', {
                'app-header--desktop': isDesktop,
                'app-header--mobile': !isDesktop,
            })}
        >
            <Wrapper variant='left'>
                <AppLogo />
                <MobileMenu />
                {isDesktop && <MenuItems.TradershubLink />}
                {isDesktop && <PlatformSwitcher />}
                {isDesktop && <MenuItems />}
            </Wrapper>
            <Wrapper variant='right'>{renderAccountSection()}</Wrapper>
        </Header>
    );
};

export default AppHeader;
