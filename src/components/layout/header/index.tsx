import { useActiveAccount } from '@/hooks/api/account';
import { StandaloneCircleUserRegularIcon } from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Header, Text, useDevice, Wrapper } from '@deriv-com/ui';
import { URLUtils } from '@deriv-com/utils';
import { AppLogo } from '../app-logo';
import { MenuItems } from './MenuItems';
import { MobileMenu } from './MobileMenu';
import { PlatformSwitcher } from './PlatformSwitcher';
// import { AccountsInfoLoader } from './SkeletonLoader';
import './header.scss';

const AppHeader = () => {
    const { isDesktop } = useDevice();
    const { activeLoginid, logout, isAuthorized } = useAuthData();
    const { data: activeAccount } = useActiveAccount();
    const { localize } = useTranslations();
    const { getOauthURL } = URLUtils;

    const renderAccountSection = () => {
        if (!activeAccount || !isAuthorized) {
            return (
                <Button
                    size='sm'
                    variant='outlined'
                    color='primary-light'
                    onClick={() => {
                        window.location.href = getOauthURL();
                    }}
                >
                    Login
                </Button>
            );
        }

        if (activeLoginid) {
            return (
                <>
                    {/* <Notifications /> */}
                    {isDesktop && (
                        // <TooltipMenuIcon
                        //     as='a'
                        //     className='pr-3 border-r-[0.1rem] h-[3.2rem]'
                        //     disableHover
                        //     href='https://app.deriv.com/account/personal-details'
                        //     tooltipContent={localize('Manage account settings')}
                        //     tooltipPosition='bottom'
                        // >
                        <StandaloneCircleUserRegularIcon />
                        // </TooltipMenuIcon>
                    )}
                    {/* <AccountsInfoLoader isLoggedIn isMobile={!isDesktop} speed={3} /> */}
                    {/* <AccountSwitcher account={activeAccount!} /> */}
                    <Button className='mr-6' onClick={logout} size='md'>
                        <Text size='sm' weight='bold'>
                            {localize('Logout')}
                        </Text>
                    </Button>
                </>
            );
        }
    };

    return (
        <Header className={!isDesktop ? 'h-[40px]' : ''}>
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
