import ContentLoader from 'react-content-loader';

type TAccountsInfoLoaderProps = {
    isLoggedIn: boolean;
    isMobile: boolean;
    speed: number;
};

const LoggedInPreloader = ({ isMobile }: Pick<TAccountsInfoLoaderProps, 'isMobile'>) => (
    <>
        {isMobile ? (
            <>
                <circle cx='14' cy='22' r='13' />
                <rect height='7' rx='4' ry='4' width='76' x='35' y='19' />
                <rect height='32' rx='4' ry='4' width='82' x='120' y='6' />
            </>
        ) : (
            <>
                <circle cx='14' cy='22' r='12' />
                <circle cx='58' cy='22' r='12' />
                <rect height='7' rx='4' ry='4' width='76' x='150' y='20' />
                <circle cx='118' cy='24' r='13' />
                <rect height='30' rx='4' ry='4' width='1' x='87' y='8' />
                <rect height='32' rx='4' ry='4' width='82' x='250' y='8' />
            </>
        )}
    </>
);

const AccountsInfoLoader = ({ isMobile, speed }: TAccountsInfoLoaderProps) => (
    <ContentLoader
        data-testid='dt_accounts_info_loader'
        height={isMobile ? 42 : 46}
        speed={speed}
        width={isMobile ? 216 : 350}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
    >
        <LoggedInPreloader isMobile={isMobile} />
    </ContentLoader>
);

export default AccountsInfoLoader;
