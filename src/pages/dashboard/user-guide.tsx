import React from 'react';
import { DBOT_TABS } from '@/constants/bot-contents';
import { StandaloneMapBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';

type TUserGuide = {
    is_mobile?: boolean;
    handleTabChange: (item: number) => void;
    setActiveTabTutorial: (active_tab: number) => void;
};

const UserGuide: React.FC<TUserGuide> = ({ is_mobile, handleTabChange, setActiveTabTutorial }) => {
    return (
        <div className='user-guide'>
            <button
                className='user-guide__button'
                onClick={() => {
                    handleTabChange(DBOT_TABS.TUTORIAL);
                    setActiveTabTutorial(0);
                }}
                data-testid='btn-user-guide'
            >
                {/* <Icon className='user-guide__icon' icon='IcUserGuide' /> */}
                <StandaloneMapBoldIcon className='user-guide__icon' height='26px' width='26px' />
                {!is_mobile && (
                    <Text size='sm' className='user-guide__label'>
                        <Localize i18n_default_text='User Guide' />
                    </Text>
                )}
            </button>
        </div>
    );
};

export default UserGuide;
