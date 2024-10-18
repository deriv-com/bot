/* eslint-disable simple-import-sort/imports */
import localForage from 'localforage';
import LZString from 'lz-string';
import { observer } from 'mobx-react-lite';
import Text from '@/components/shared_ui/text';
import { TStrategy } from 'Types';
import { NOTIFICATION_TYPE } from '@/components/bot-notification/bot-notification-utils';
import { getSavedWorkspaces } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import './delete-dialog.scss';
import Dialog from '@/components/shared_ui/dialog';

const DeleteDialog = observer(() => {
    const { load_modal, dashboard } = useStore();
    const {
        is_delete_modal_open,
        onToggleDeleteDialog,
        selected_strategy_id,
        setDashboardStrategies,
        loadStrategyToBuilder,
        refreshStrategiesTheme,
        resetBotBuilderStrategy,
    } = load_modal;
    const { setOpenSettings } = dashboard;

    const resetStrategiesAfterDelete = async (deleted_strategy_id: string, updated_workspaces: Array<TStrategy>) => {
        if (updated_workspaces.length) {
            if (selected_strategy_id === deleted_strategy_id) {
                await loadStrategyToBuilder(updated_workspaces?.[0]);
            }
            // Change preview strategy to the one that was previously previewed
            await refreshStrategiesTheme();
        } else {
            resetBotBuilderStrategy();
        }
    };

    const removeBotStrategy = async (strategy_id: string) => {
        const workspaces = await getSavedWorkspaces();
        const updated_workspaces = workspaces.filter(
            (strategy_from_workspace: TStrategy) => strategy_from_workspace.id !== strategy_id
        );
        setDashboardStrategies(updated_workspaces);
        // TODO: Need to move this to skeleton
        localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(updated_workspaces)));
        await resetStrategiesAfterDelete(strategy_id, updated_workspaces);
        onToggleDeleteDialog(false);
    };
    return (
        <div>
            <Dialog
                title='Delete bot'
                is_visible={is_delete_modal_open}
                confirm_button_text='Yes, delete'
                onConfirm={() => {
                    removeBotStrategy(selected_strategy_id);
                    onToggleDeleteDialog(false);
                    setOpenSettings(NOTIFICATION_TYPE.BOT_DELETE);
                }}
                cancel_button_text='No'
                onCancel={() => {
                    onToggleDeleteDialog(false);
                }}
                is_mobile_full_width={false}
                className={'dc-dialog__delete-strategy--delete'}
                has_close_icon
            >
                <div>
                    <Text color='prominent' lineHeight='s' size='xs'>
                        Your bot will be permanently deleted when you hit
                        <strong> Yes, delete.</strong>
                    </Text>
                </div>
                <div>
                    <Text color='prominent' lineHeight='xl' size='xs'>
                        Are you sure you want to delete it?
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default DeleteDialog;
