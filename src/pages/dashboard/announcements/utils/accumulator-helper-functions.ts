import { load, save_types } from '@/external/bot-skeleton';
import { rudderStackSendPWAInstallEvent } from '../../../analytics/rudderstack-common-events';
import { rudderStackSendAnnouncementClickEvent } from '../../../analytics/rudderstack-dashboard';
import { ANNOUNCEMENTS, BUTTON_ACTION_TYPE, TAnnouncement, TAnnouncementItem } from '../config';

export const handleOnConfirmAccumulator = () => {
    import(/* webpackChunkName: `[request]` */ '@/external/bot-skeleton/scratch/xml/main.xml')
        .then(strategy_xml => {
            const strategy_dom = Blockly.utils.xml.textToDom(strategy_xml.default);
            const modifyFieldDropdownValues = (name: string, value: string) => {
                const name_list = `${name.toUpperCase()}_LIST`;
                const el_blocks = strategy_dom?.querySelectorAll(`field[name="${name_list}"]`);

                el_blocks?.forEach((el_block: HTMLElement) => {
                    el_block.textContent = value;
                });
            };
            modifyFieldDropdownValues('tradetypecat', 'accumulator');

            const { derivWorkspace: workspace } = Blockly;

            load({
                block_string: Blockly.Xml.domToText(strategy_dom),
                file_name: 'Strategy with accumulator trade type',
                workspace,
                from: save_types.UNSAVED,
                drop_event: null,
                strategy_id: null,
                showIncompatibleStrategyDialog: null,
            });
        })
        .catch(error => {
            /* eslint-disable no-console */
            console.error('Failed to load strategy XML:', error);
        });
};

export const performButtonAction = (
    item: TAnnouncementItem,
    modalButtonAction: (announce_id: string, announcement: TAnnouncement) => void,
    handleRedirect: (url: string) => void
) => {
    switch (item.buttonAction) {
        case BUTTON_ACTION_TYPE.MODAL_BUTTON_ACTION: {
            return modalButtonAction(item.id, ANNOUNCEMENTS[item.id]);
        }
        case BUTTON_ACTION_TYPE.REDIRECT_BUTTON_ACTION: {
            const urlRedirect = ANNOUNCEMENTS[item.id].url_redirect;
            if (urlRedirect) {
                return handleRedirect(urlRedirect);
            }
            return false;
        }
        case BUTTON_ACTION_TYPE.NO_ACTION: {
            // Special handling for PWA announcement - show PWA modal directly and close announcement panel
            if (item.id === 'PWA_INSTALL_ANNOUNCE') {
                return () => {
                    // Send announcement click tracking event
                    rudderStackSendAnnouncementClickEvent({
                        announcement_name: ANNOUNCEMENTS[item.id].announcement.main_title,
                    });

                    // Send PWA install event
                    rudderStackSendPWAInstallEvent();

                    // Mark as read
                    let data: Record<string, boolean> | null = null;
                    data = JSON.parse(localStorage.getItem('bot-announcements') ?? '{}');
                    localStorage?.setItem('bot-announcements', JSON.stringify({ ...data, [item.id]: false }));

                    // Trigger PWA modal
                    window.dispatchEvent(new CustomEvent('showPWAInstallModal'));

                    // Close announcements panel by triggering a custom event
                    window.dispatchEvent(new CustomEvent('closeAnnouncementsPanel'));
                };
            }
            return false;
        }
        default:
            return false;
    }
};
