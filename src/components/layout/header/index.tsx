import clsx from 'clsx';
import { useActiveAccount } from '@/hooks/api/account';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Header, Text, useDevice, Wrapper } from '@deriv-com/ui';
import { Tooltip } from '@deriv-com/ui';
import { URLUtils } from '@deriv-com/utils';
import { AppLogo } from '../app-logo';
import { AccountSwitcher } from './AccountSwitcher';
import { MenuItems } from './MenuItems';
import { MobileMenu } from './MobileMenu';
import { Notifications } from './Notifications';
import { PlatformSwitcher } from './PlatformSwitcher';
import { AccountsInfoLoader } from './SkeletonLoader';
import './header.scss';

const AppHeader = () => {
    const { isDesktop } = useDevice();
    const { activeLoginid, logout, isAuthorized } = useAuthData();
    const { data: activeAccount } = useActiveAccount();
    const { localize } = useTranslations();
    const { getOauthURL } = URLUtils;

    const renderAccountSection = () => {
        if (!isAuthorized) {
            return (
                <Button
                    size='sm'
                    variant='outlined'
                    color='primary-light'
                    onClick={() => {
                        window.location.href = getOauthURL();
                    }}
                >
                    {localize('Login')}
                </Button>
            );
        } else if (isAuthorized && !activeAccount) {
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
                    <AccountSwitcher account={activeAccount!} />
                    <Button onClick={logout} size='md'>
                        <Text size='sm' weight='bold'>
                            {localize('Logout')}
                        </Text>
                    </Button>
                </>
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
                {isDesktop && <PlatformSwitcher />}
                {isDesktop && <MenuItems />}
            </Wrapper>
            <Wrapper variant='right'>{renderAccountSection()}</Wrapper>
        </Header>
    );
};

export default AppHeader;
