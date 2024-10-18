import React from 'react';
import Text from '@/components/shared_ui/text';
import { DBOT_TABS } from '@/constants/bot-contents';
import { StandaloneMapBoldIcon } from '@deriv/quill-icons/Standalone';
import { Localize } from '@deriv-com/translations';

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
                <StandaloneMapBoldIcon
                    className='user-guide__icon'
                    height='26px'
                    width='26px'
                    fill='var(--text-general)'
                />
                {!is_mobile && (
                    <Text size='xs' className='user-guide__label'>
                        <Localize i18n_default_text='User Guide' />
                    </Text>
                )}
            </button>
        </div>
    );
};

export default UserGuide;
