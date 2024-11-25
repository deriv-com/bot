import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { getRecentFileIcon } from '@/components/load-modal/recent-workspace';
import Popover from '@/components/shared_ui/popover';
import Text from '@/components/shared_ui/text';
import { DBOT_TABS } from '@/constants/bot-contents';
import { timeSince } from '@/external/bot-skeleton';
import { useComponentVisibility } from '@/hooks/useComponentVisibility';
import { useStore } from '@/hooks/useStore';
import {
    LabelPairedPageCircleArrowRightSmRegularIcon,
    LabelPairedTrashSmRegularIcon,
} from '@deriv/quill-icons/LabelPaired';
import { LegacyMenuDots1pxIcon, LegacySave1pxIcon } from '@deriv/quill-icons/Legacy';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { rudderStackSendDashboardClickEvent } from '../../../analytics/rudderstack-dashboard';
import { STRATEGY } from '../../../constants/dashboard';
import './index.scss';

export const CONTEXT_MENU = [
    {
        type: STRATEGY.OPEN,
        icon: <LabelPairedPageCircleArrowRightSmRegularIcon fill='var(--text-general)' />,
        label: <Localize i18n_default_text='Open' />,
    },
    {
        type: STRATEGY.SAVE,
        icon: (
            <LegacySave1pxIcon
                fill='var(--text-general)'
                className='icon-general-fill-path'
                iconSize='xs'
                path=''
                opacity={0.8}
            />
        ),
        label: <Localize i18n_default_text='Save' />,
    },
    {
        type: STRATEGY.DELETE,
        icon: <LabelPairedTrashSmRegularIcon fill='var(--text-general)' />,
        label: <Localize i18n_default_text='Delete' />,
    },
];

type TRecentWorkspace = {
    index: number;
    workspace: { [key: string]: string };
    updateBotName: (name: string) => void;
};

const RecentWorkspace = observer(({ workspace, index }: TRecentWorkspace) => {
    const { dashboard, load_modal, save_modal } = useStore();
    const { setActiveTab } = dashboard;
    const { toggleSaveModal, updateBotName } = save_modal;
    const {
        dashboard_strategies = [],
        getSaveType,
        getSelectedStrategyID,
        loadFileFromRecent,
        onToggleDeleteDialog,
        previewed_strategy_id,
        selected_strategy_id,
        setSelectedStrategyId,
    } = load_modal;

    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);
    const toggle_ref = React.useRef<HTMLButtonElement>(null);
    const is_div_triggered_once = React.useRef<boolean>(false);
    const visible = useComponentVisibility(toggle_ref);
    const { setDropdownVisibility, is_dropdown_visible } = visible;
    const { isDesktop } = useDevice();

    React.useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const select_first_strategy = dashboard_strategies?.length && index === 0 && !is_div_triggered_once.current;

        if (select_first_strategy) {
            timer = setTimeout(() => {
                is_div_triggered_once.current = true;
                trigger_div_ref?.current?.click();
            }, 50);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [dashboard_strategies, index]);

    const onToggleDropdown = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setDropdownVisibility(!is_dropdown_visible);
        setSelectedStrategyId(workspace.id);
    };

    const handleOpen = async () => {
        await loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
        rudderStackSendDashboardClickEvent({ dashboard_click_name: 'open', subpage_name: 'bot_builder' });
    };

    const handleSave = () => {
        updateBotName(workspace?.name);
        toggleSaveModal();
        rudderStackSendDashboardClickEvent({ dashboard_click_name: 'save', subpage_name: 'dashboard' });
    };

    const viewRecentStrategy = async (type: string) => {
        setSelectedStrategyId(workspace.id);

        switch (type) {
            case STRATEGY.OPEN:
                await handleOpen();
                break;

            case STRATEGY.SAVE:
                handleSave();
                break;

            case STRATEGY.DELETE:
                onToggleDeleteDialog(true);
                rudderStackSendDashboardClickEvent({ dashboard_click_name: 'delete', subpage_name: 'dashboard' });
                break;

            default:
                break;
        }
    };

    const is_active_mobile = selected_strategy_id === workspace.id && is_dropdown_visible;
    const text_size = isDesktop ? 'xs' : 'xxs';

    return (
        <div
            className={classnames('bot-list__item', {
                'bot-list__item--selected': previewed_strategy_id === workspace.id,
                'bot-list__item--loaded': dashboard_strategies,
                'bot-list__item--min': !!dashboard_strategies?.length && !isDesktop,
            })}
            key={workspace.id}
            ref={trigger_div_ref}
            onClick={e => {
                e.stopPropagation(); //stop event bubbling for child element
                if (is_dropdown_visible) setDropdownVisibility(false);
                getSelectedStrategyID(workspace.id);
                viewRecentStrategy(STRATEGY.INIT);
            }}
        >
            <div className='bot-list__item__label'>
                <div className='text-wrapper' title={workspace.name}>
                    <Text align='left' as='p' size={text_size} lineHeight='l'>
                        {workspace.name}
                    </Text>
                </div>
            </div>
            <div className='bot-list__item__time-stamp'>
                <Text align='left' as='p' size={text_size} lineHeight='l'>
                    {timeSince(workspace.timestamp)}
                </Text>
            </div>
            <div className='bot-list__item__load-type'>
                {getRecentFileIcon(workspace.save_type, 'bot-list__item__load-type__icon--active')}
                <div className='bot-list__item__load-type__icon--saved'>
                    <Text align='left' as='p' size={text_size} lineHeight='l'>
                        {getSaveType(workspace.save_type)}
                    </Text>
                </div>
            </div>
            {isDesktop ? (
                <div className='bot-list__item__actions'>
                    {CONTEXT_MENU.map(item => (
                        <div
                            key={item.type}
                            className='bot-list__item__actions__action-item'
                            onClick={e => {
                                e.stopPropagation();
                                viewRecentStrategy(item.type);
                            }}
                        >
                            <Popover alignment='top' message={item.label} zIndex={'9999'}>
                                {item.icon}
                            </Popover>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className='bot-list__item__actions'>
                        <button ref={toggle_ref} onClick={onToggleDropdown} tabIndex={0}>
                            <LegacyMenuDots1pxIcon height='20px' width='20px' />
                        </button>
                    </div>
                    <div
                        className={classnames('bot-list__item__responsive', {
                            'bot-list__item__responsive--active': is_active_mobile,
                            'bot-list__item__responsive--min': dashboard_strategies.length <= 5,
                        })}
                    >
                        {CONTEXT_MENU.map(item => (
                            <div
                                key={item.type}
                                className='bot-list__item__responsive__menu'
                                onClick={e => {
                                    e.stopPropagation();
                                    viewRecentStrategy(item.type);
                                }}
                            >
                                <div className='bot-list__item__responsive__menu__icon'>{item.icon}</div>
                                <Text
                                    color='prominent'
                                    className='bot-list__item__responsive__menu__item'
                                    as='p'
                                    size='xs'
                                >
                                    {item.label}
                                </Text>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});

export default RecentWorkspace;
