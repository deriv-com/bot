import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { getRecentFileIcon } from '@/components/load-modal/recent-workspace';
import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import MobileWrapper from '@/components/shared_ui/mobile-wrapper';
import Text from '@/components/shared_ui/text';
import { DBOT_TABS } from '@/constants/bot-contents';
import { timeSince } from '@/external/bot-skeleton';
import { useComponentVisibility } from '@/hooks/useComponentVisibility';
import { useStore } from '@/hooks/useStore';
import { waitForDomElement } from '@/utils/dom-observer';
import {
    LabelPairedCircleArrowRightCaptionRegularIcon,
    LabelPairedFloppyDiskCaptionRegularIcon,
    LabelPairedTrashCaptionRegularIcon,
    LegacyMenuDots1pxIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { STRATEGY } from '../../../constants/dashboard';
import './index.scss';

export const CONTEXT_MENU = [
    {
        type: STRATEGY.OPEN,
        icon: <LabelPairedCircleArrowRightCaptionRegularIcon height='24px' width='24px' />,
        label: <Localize i18n_default_text='Open' />,
    },
    {
        type: STRATEGY.SAVE,
        icon: <LabelPairedFloppyDiskCaptionRegularIcon height='24px' width='24px' />,
        label: <Localize i18n_default_text='Save' />,
    },
    {
        type: STRATEGY.DELETE,
        icon: <LabelPairedTrashCaptionRegularIcon height='24px' width='24px' />,
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
    const { active_tab, setActiveTab, setPreviewOnDialog } = dashboard;
    const { toggleSaveModal, updateBotName } = save_modal;
    const {
        dashboard_strategies = [],
        getSaveType,
        getSelectedStrategyID,
        loadFileFromRecent,
        onToggleDeleteDialog,
        previewRecentStrategy,
        previewed_strategy_id,
        selected_strategy_id,
        setSelectedStrategyId,
        setPreviewedStrategyId,
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

    const handleInit = () => {
        setPreviewedStrategyId(workspace?.id);
        // Fires for desktop
        if (active_tab === 0) {
            previewRecentStrategy(workspace.id);
        }
    };

    const handlePreviewList = () => {
        setPreviewedStrategyId(workspace.id);
        // Fires for mobile on clicking preview button
        if (!isDesktop) {
            setPreviewOnDialog(true);
            const dashboard_tab_dom_element = document.getElementsByClassName('tab__dashboard')?.[0];
            waitForDomElement('#load-strategy__blockly-container', dashboard_tab_dom_element).then(() => {
                previewRecentStrategy(workspace.id);
            });
        }
    };

    const handleEdit = async () => {
        await loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const handleSave = () => {
        updateBotName(workspace?.name);
        toggleSaveModal();
    };

    const viewRecentStrategy = async (type: string) => {
        setSelectedStrategyId(workspace.id);

        switch (type) {
            case STRATEGY.INIT:
                // Fires for desktop preview
                handleInit();
                break;

            case STRATEGY.PREVIEW_LIST:
                // Fires for mobile preview
                handlePreviewList();
                break;

            case STRATEGY.EDIT:
                await handleEdit();
                break;

            case STRATEGY.SAVE:
                handleSave();
                break;

            case STRATEGY.DELETE:
                onToggleDeleteDialog(true);
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
            <DesktopWrapper>
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
                            {item.icon}
                        </div>
                    ))}
                </div>
            </DesktopWrapper>
            <MobileWrapper>
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
                            <div>{item.icon}</div>
                            <Text color='prominent' className='bot-list__item__responsive__menu__item' as='p' size='xs'>
                                {item.label}
                            </Text>
                        </div>
                    ))}
                </div>
            </MobileWrapper>
        </div>
    );
});

export default RecentWorkspace;
