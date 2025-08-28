import React from 'react';
import { getUrlBase } from '@/components/shared';
import OpenLiveChatLink from '@/components/shared_ui/open-livechat-link';
import Text from '@/components/shared_ui/text';
import { DBOT_TABS } from '@/constants/bot-contents';
import { Localize, localize } from '@deriv-com/translations';
import { rudderStackSendOpenEvent } from '../../../analytics/rudderstack-common-events';
import { handleOnConfirmAccumulator } from './utils/accumulator-helper-functions';
import { IconAnnounce } from './announcement-components';

export type TContentItem = {
    id: number;
    text: React.ReactNode;
};

export type TAnnounce = {
    id: string;
    main_title: string;
    confirm_button_text?: string;
    cancel_button_text?: string;
    base_classname: string;
    title: React.ReactNode;
    content?: TContentItem[];
    numbered_content?: TContentItem[];
    plain_text?: TContentItem[];
    media?: Array<string>;
    unordered_list?: TContentItem[];
};

export type TAnnouncement = {
    announcement: TAnnounce;
    switch_tab_on_cancel?: number;
    switch_tab_on_confirm?: number;
    onConfirm?: () => void;
    onCancel?: () => void;
    url_redirect?: string;
    should_not_be_cancel?: boolean;
    should_toggle_load_modal?: boolean;
    should_toggle_qs_modal?: boolean;
};

export const ANNOUNCEMENTS: Record<string, TAnnouncement> = {
    UPDATES_QUICK_STRATEGY_MODAL_ANNOUNCE: {
        announcement: {
            id: 'UPDATES_QUICK_STRATEGY_MODAL_ANNOUNCE',
            main_title: localize('Updates: Quick strategy modal'),
            confirm_button_text: localize('Explore now'),
            base_classname: 'announcement-dialog',
            media: [getUrlBase('assets/images/dbot-new-look-QS-and-accumulators-addition.gif')],
            title: [
                <Text key={0} as='div' align='left' size='xs' className='announcement-dialog__title'>
                    <Localize i18n_default_text="We've improved the Quick strategy (QS) modal for a better trading experience." />
                </Text>,
                <Localize key={1} i18n_default_text='<0>What’s new:</0>' components={[<div key={0} />]} />,
            ],
            unordered_list: [
                {
                    id: 0,
                    text: (
                        <Localize
                            i18n_default_text='<0>A revamped design</0> for improved functionality.'
                            components={[<strong key={0} />]}
                        />
                    ),
                },
                {
                    id: 1,
                    text: (
                        <Localize
                            i18n_default_text='<0>Support for multiple trade types </0> with a filter to find strategies by preference.'
                            components={[<strong key={0} />]}
                        />
                    ),
                },
                {
                    id: 2,
                    text: (
                        <Localize
                            i18n_default_text='<0>Integration of Accumulators Options</0> for direct strategy application within the QS modal.'
                            components={[<strong key={0} />]}
                        />
                    ),
                },
            ],
        },
        should_not_be_cancel: true,
        switch_tab_on_confirm: DBOT_TABS.BOT_BUILDER,
        should_toggle_qs_modal: true,
    },

    MOVING_STRATEGIES_ANNOUNCE: {
        announcement: {
            id: 'MOVING_STRATEGIES_ANNOUNCE',
            main_title: localize('Moving strategies to Deriv Bot'),
            confirm_button_text: localize('Import strategy'),
            base_classname: 'announcement-dialog',
            title: (
                <Localize
                    i18n_default_text='<0>Follow these steps to smoothly transfer your strategies:</0>'
                    components={[<strong key={0} />]}
                />
            ),
            numbered_content: [
                {
                    id: 0,
                    text: localize('Download your strategy in XML format and import it to Deriv Bot.'),
                },
                {
                    id: 1,
                    text: localize('Run your updated strategy to check its performance.'),
                },
                {
                    id: 2,
                    text: localize('Save the updated strategy for quicker re-imports.'),
                },
            ],
            plain_text: [
                {
                    id: 0,
                    text: (
                        <Localize
                            i18n_default_text='<0>Note</0>: Uploading complex strategies may take some time. Saving them from Deriv Bot ensures quicker access later. If you have questions, contact us via <1/>.'
                            components={[<strong key={0} />, <OpenLiveChatLink className='' key={1} />]}
                        />
                    ),
                },
            ],
        },
        should_not_be_cancel: true,
        should_toggle_load_modal: true,
        switch_tab_on_confirm: DBOT_TABS.BOT_BUILDER,
        onConfirm: () => {
            rudderStackSendOpenEvent({
                subpage_name: 'bot_builder',
                subform_source: 'dashboard',
                subform_name: 'quick_strategy',
            });
        },
    },

    BLOCKLY_ANNOUNCE: {
        announcement: {
            id: 'BLOCKLY_ANNOUNCE',
            main_title: localize('Google Blockly v10 update'),
            base_classname: 'announcement-dialog',
            title: (
                <Localize
                    i18n_default_text='We have updated our Blockly system in Deriv Bot from <0>version 3 to version 10</0>. This brings:'
                    components={[<strong key={0} />]}
                />
            ),
            numbered_content: [
                {
                    id: 0,
                    text: localize('Better security.'),
                },
                {
                    id: 1,
                    text: localize('Faster performance.'),
                },
                {
                    id: 2,
                    text: localize('New features for developers.'),
                },
            ],
            plain_text: [
                {
                    id: 0,
                    text: (
                        <Localize
                            i18n_default_text='<0>Note</0>: Some complex strategies might face issues in the Bot Builder. If you have questions, contact us via <1/>.'
                            components={[<strong key={0} />, <OpenLiveChatLink className='' key={1} />]}
                        />
                    ),
                },
            ],
        },
        should_not_be_cancel: true,
    },

    ACCUMULATOR_ANNOUNCE: {
        announcement: {
            id: 'ACCUMULATOR_ANNOUNCE',
            main_title: localize('Accumulators now on Deriv Bot'),
            confirm_button_text: localize('Try now'),
            cancel_button_text: localize('Learn more'),
            base_classname: 'announcement-dialog',
            title: (
                <Localize
                    i18n_default_text='<0>Boost your trading strategy with Accumulators</0>'
                    components={[<strong key={0} />]}
                />
            ),
            content: [
                {
                    id: 0,
                    text: localize('Trade Accumulators to build up potential profits with a structured approach.'),
                },
                {
                    id: 1,
                    text: localize('Customise your investment period and price levels to fit your trading goals.'),
                },
                { id: 2, text: localize('Manage risks while capitalising on market opportunities.') },
            ],
        },
        switch_tab_on_cancel: DBOT_TABS.TUTORIAL,
        switch_tab_on_confirm: DBOT_TABS.BOT_BUILDER,
        onConfirm: () => handleOnConfirmAccumulator(),
    },

    PWA_INSTALL_ANNOUNCE: {
        announcement: {
            id: 'PWA_INSTALL_ANNOUNCE',
            main_title: localize('Install Deriv Bot as an App'),
            confirm_button_text: localize('Install Now'),
            base_classname: 'announcement-dialog',
            title: (
                <Localize i18n_default_text='<0>Get the full app experience</0>' components={[<strong key={0} />]} />
            ),
            content: [
                {
                    id: 0,
                    text: localize(
                        'Install Deriv Bot directly on your device for faster access and better performance.'
                    ),
                },
                {
                    id: 1,
                    text: localize('Work offline and get instant access from your desktop or home screen.'),
                },
                {
                    id: 2,
                    text: localize('Enjoy a native app-like experience with all the features you love.'),
                },
            ],
        },
        should_not_be_cancel: false,
        onConfirm: () => {
            // Trigger PWA install modal directly
            window.dispatchEvent(new CustomEvent('showPWAInstallModal'));
        },
    },
};

export type TAnnouncementItem = {
    id: string;
    icon: React.ComponentType<{ announce: boolean }>;
    title: string;
    message: string;
    date: string;
    buttonAction: string;
    actionText: string;
};

export type TNotifications = {
    key: string;
    icon: React.ReactNode;
    title: React.ReactNode;
    message: React.ReactNode;
    buttonAction: (() => void) | false | void;
    actionText: string;
};

export const BUTTON_ACTION_TYPE = {
    MODAL_BUTTON_ACTION: 'modal_button_action',
    REDIRECT_BUTTON_ACTION: 'redirect_button_action',
    NO_ACTION: 'no_action',
};

const ALL_ANNOUNCEMENTS: TAnnouncementItem[] = [
    {
        id: 'PWA_INSTALL_ANNOUNCE',
        icon: IconAnnounce,
        title: localize('Install Deriv Bot as an App'),
        message: localize('Get faster access and better performance by installing Deriv Bot on your device.'),
        date: '29 January 2025 00:00 UTC',
        buttonAction: BUTTON_ACTION_TYPE.NO_ACTION,
        actionText: '',
    },
    {
        id: 'UPDATES_QUICK_STRATEGY_MODAL_ANNOUNCE',
        icon: IconAnnounce,
        title: localize('Updated: Quick Strategy Modal'),
        message: localize("We've improved the Quick strategy (QS) modal for a better trading experience."),
        date: '18 November 2024 00:00 UTC',
        buttonAction: BUTTON_ACTION_TYPE.MODAL_BUTTON_ACTION,
        actionText: '',
    },
    {
        id: 'MOVING_STRATEGIES_ANNOUNCE',
        icon: IconAnnounce,
        title: localize('Moving strategies to Deriv Bot'),
        message: localize('Follow these steps to smoothly transfer your strategies'),
        date: '1 August 2024 00:00 UTC',
        buttonAction: BUTTON_ACTION_TYPE.MODAL_BUTTON_ACTION,
        actionText: '',
    },
    {
        id: 'BLOCKLY_ANNOUNCE',
        icon: IconAnnounce,
        title: localize('Google Blockly v10 update'),
        message: localize('We have updated our Blockly system in Deriv Bot from version 3 to version 10.'),
        date: '24 July 2024 00:00 UTC',
        buttonAction: BUTTON_ACTION_TYPE.MODAL_BUTTON_ACTION,
        actionText: '',
    },
    {
        id: 'ACCUMULATOR_ANNOUNCE',
        icon: IconAnnounce,
        title: localize('Accumulators is now on Deriv Bot'),
        message: localize('Boost your trading strategy with Accumulators.'),
        date: '2 July 2024 00:00 UTC',
        buttonAction: BUTTON_ACTION_TYPE.MODAL_BUTTON_ACTION,
        actionText: '',
    },
];

// Export all announcements without filtering - filtering will be done at runtime
export const BOT_ANNOUNCEMENTS_LIST: TAnnouncementItem[] = ALL_ANNOUNCEMENTS;

// Helper function to get filtered announcements based on current PWA state
export const getFilteredAnnouncements = (isInPWAMode: boolean = false): TAnnouncementItem[] => {
    return ALL_ANNOUNCEMENTS.filter(announcement => {
        if (announcement.id === 'PWA_INSTALL_ANNOUNCE' && isInPWAMode) {
            return false; // Hide PWA install announcement when app is already in PWA mode
        }
        return true;
    });
};
