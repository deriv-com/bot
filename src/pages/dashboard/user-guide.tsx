import React from 'react';

import { Text } from '@deriv-com/ui';

import { DBOT_TABS } from '@/constants/bot-contents';
import { Icon, localize } from '@/utils/tmp/dummy';

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
                <Icon className='user-guide__icon' icon='IcMapTripFold' />
                {!is_mobile && (
                    <Text size='xs' line_height='s' className='user-guide__label'>
                        {localize('User Guide')}
                    </Text>
                )}
            </button>
        </div>
    );
};

export default UserGuide;
