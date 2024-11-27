import React from 'react';
import Popover from '@/components/shared_ui/popover';

type TAccountInfoWrapper = {
    is_disabled?: boolean;
    is_mobile?: boolean;
    is_dtrader_v2?: boolean;
    disabled_message?: string;
};

const AccountInfoWrapper = ({
    is_disabled,
    is_mobile,
    disabled_message,
    children,
}: React.PropsWithChildren<TAccountInfoWrapper>) =>
    is_disabled && disabled_message ? (
        <Popover alignment={is_mobile ? 'bottom' : 'left'} message={disabled_message} zIndex='99999'>
            {children}
        </Popover>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );

export default AccountInfoWrapper;
