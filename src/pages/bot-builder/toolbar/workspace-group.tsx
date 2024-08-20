import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import { useStore } from '@/hooks/useStore';
import { localize } from '@/utils/tmp/dummy';
import {
    LabelPairedChartLineLgRegularIcon,
    LabelPairedFloppyDiskLgRegularIcon,
    LabelPairedFolderOpenLgRegularIcon,
    LabelPairedMagnifyingGlassMinusLgRegularIcon,
    LabelPairedMagnifyingGlassPlusLgRegularIcon,
    LabelPairedObjectsAlignLeftCaptionRegularIcon,
    LegacyRefresh1pxIcon,
    LegacyTradeTypeLookbacksIcon,
} from '@deriv/quill-icons';
import ToolbarIcon from './toolbar-icon';

const WorkspaceGroup = observer(() => {
    const { dashboard, toolbar, load_modal, save_modal } = useStore();
    const { setPreviewOnPopup, setChartModalVisibility, setTradingViewModalVisibility } = dashboard;
    const { has_redo_stack, has_undo_stack, onResetClick, onSortClick, onUndoClick, onZoomInOutClick } = toolbar;
    const { toggleSaveModal } = save_modal;
    const { toggleLoadModal } = load_modal;

    return (
        <div className='toolbar__wrapper'>
            <div className='toolbar__group toolbar__group-btn' data-testid='dt_toolbar_group_btn'>
                <ToolbarIcon
                    popover_message={localize('Reset')}
                    icon={
                        <span
                            id='db-toolbar__reset-button'
                            className='toolbar__icon'
                            onClick={onResetClick}
                            data-testid='dt_toolbar_reset_button'
                        >
                            <LegacyRefresh1pxIcon height='20px' width='20px' />
                        </span>
                    }
                />
                <ToolbarIcon
                    popover_message={localize('Import')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__import-button'
                            data-testid='dt_toolbar_import_button'
                            onClick={() => {
                                setPreviewOnPopup(true);
                                toggleLoadModal();
                            }}
                        >
                            <LabelPairedFolderOpenLgRegularIcon height='24px' width='24px' />
                        </span>
                    }
                />
                <ToolbarIcon
                    popover_message={localize('Save')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__save-button'
                            data-testid='dt_toolbar_save_button'
                            onClick={toggleSaveModal}
                        >
                            <LabelPairedFloppyDiskLgRegularIcon height='26px' width='26px' />
                        </span>
                    }
                />
                <ToolbarIcon
                    popover_message={localize('Sort blocks')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__sort-button'
                            data-testid='dt_toolbar_sort_button'
                            onClick={onSortClick}
                        >
                            <LabelPairedObjectsAlignLeftCaptionRegularIcon height='24px' width='24px' />
                        </span>
                    }
                />
                <DesktopWrapper>
                    <div className='vertical-divider' />
                    <ToolbarIcon
                        popover_message={localize('Charts')}
                        icon={
                            <span
                                className='toolbar__icon'
                                id='db-toolbar__charts-button'
                                onClick={() => setChartModalVisibility()}
                            >
                                <LabelPairedChartLineLgRegularIcon height='24px' width='24px' />
                            </span>
                        }
                    />
                    <ToolbarIcon
                        popover_message={localize('Trading View Chart')}
                        icon={
                            <span
                                className='toolbar__icon'
                                id='db-toolbar__tradingview-button'
                                onClick={() => setTradingViewModalVisibility()}
                            >
                                <LabelPairedChartLineLgRegularIcon height='24px' width='24px' />
                            </span>
                        }
                    />
                </DesktopWrapper>
                <div className='vertical-divider' />
                <ToolbarIcon
                    popover_message={localize('Undo')}
                    icon={
                        <span
                            className={classNames('toolbar__icon undo', {
                                'toolbar__icon--disabled': !has_undo_stack,
                            })}
                            id='db-toolbar__undo-button'
                            data-testid='dt_toolbar_undo_button'
                            onClick={() => onUndoClick(/* redo */ false)}
                        >
                            <LegacyTradeTypeLookbacksIcon height='14px' width='14px' />
                        </span>
                    }
                />
                <ToolbarIcon
                    popover_message={localize('Redo')}
                    icon={
                        <span
                            className={classNames('toolbar__icon redo', {
                                'toolbar__icon--disabled': !has_redo_stack,
                            })}
                            id='db-toolbar__redo-button'
                            data-testid='dt_toolbar_redo_button'
                            onClick={() => onUndoClick(/* redo */ true)}
                        >
                            <LegacyTradeTypeLookbacksIcon height='14px' width='14px' />
                        </span>
                    }
                />
                <div className='vertical-divider' />
                <ToolbarIcon
                    popover_message={localize('Zoom in')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__zoom-in-button'
                            data-testid='dt_toolbar_zoom_in_button'
                            onClick={() => onZoomInOutClick(/* in */ true)}
                        >
                            <LabelPairedMagnifyingGlassPlusLgRegularIcon height='24px' width='24px' />
                        </span>
                    }
                />
                <ToolbarIcon
                    popover_message={localize('Zoom out')}
                    icon={
                        <span
                            className='toolbar__icon'
                            id='db-toolbar__zoom-out'
                            data-testid='dt_toolbar_zoom_out_button'
                            onClick={() => onZoomInOutClick(/* in */ false)}
                        >
                            <LabelPairedMagnifyingGlassMinusLgRegularIcon height='24px' width='24px' />
                        </span>
                    }
                />
            </div>
        </div>
    );
});
export default WorkspaceGroup;
