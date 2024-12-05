import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import {
    LabelPairedArrowRotateLeftMdRegularIcon,
    LabelPairedArrowRotateRightMdRegularIcon,
    LabelPairedArrowsRotateMdRegularIcon,
    LabelPairedChartLineMdRegularIcon,
    LabelPairedChartTradingviewMdRegularIcon,
    LabelPairedFloppyDiskMdRegularIcon,
    LabelPairedFolderOpenMdRegularIcon,
    LabelPairedMagnifyingGlassMinusMdRegularIcon,
    LabelPairedMagnifyingGlassPlusMdRegularIcon,
    LabelPairedObjectsAlignLeftMdRegularIcon,
} from '@deriv/quill-icons/LabelPaired';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { rudderStackSendOpenEvent } from '../../../analytics/rudderstack-common-events';
import ToolbarIcon from './toolbar-icon';

const WorkspaceGroup = observer(() => {
    const { dashboard, toolbar, load_modal, save_modal } = useStore();
    const { setPreviewOnPopup, setChartModalVisibility, setTradingViewModalVisibility } = dashboard;
    const { has_redo_stack, has_undo_stack, onResetClick, onSortClick, onUndoClick, onZoomInOutClick } = toolbar;
    const { toggleSaveModal } = save_modal;
    const { toggleLoadModal } = load_modal;
    const { isDesktop } = useDevice();

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
                            <LabelPairedArrowsRotateMdRegularIcon />
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
                                rudderStackSendOpenEvent({
                                    subpage_name: 'bot_builder',
                                    subform_source: 'bot_builder',
                                    subform_name: 'load_strategy',
                                    load_strategy_tab: 'recent',
                                });
                            }}
                        >
                            <LabelPairedFolderOpenMdRegularIcon />
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
                            <LabelPairedFloppyDiskMdRegularIcon />
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
                            <LabelPairedObjectsAlignLeftMdRegularIcon />
                        </span>
                    }
                />
                {isDesktop && (
                    <>
                        <div className='vertical-divider' />
                        <ToolbarIcon
                            popover_message={localize('Charts')}
                            icon={
                                <span
                                    className='toolbar__icon'
                                    id='db-toolbar__charts-button'
                                    onClick={() => setChartModalVisibility()}
                                >
                                    <LabelPairedChartLineMdRegularIcon />
                                </span>
                            }
                        />
                        <ToolbarIcon
                            popover_message={localize('TradingView Chart')}
                            icon={
                                <span
                                    className='toolbar__icon'
                                    id='db-toolbar__tradingview-button'
                                    onClick={() => setTradingViewModalVisibility()}
                                >
                                    <LabelPairedChartTradingviewMdRegularIcon />
                                </span>
                            }
                        />
                    </>
                )}
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
                            <LabelPairedArrowRotateLeftMdRegularIcon />
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
                            <LabelPairedArrowRotateRightMdRegularIcon />
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
                            <LabelPairedMagnifyingGlassPlusMdRegularIcon />
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
                            <LabelPairedMagnifyingGlassMinusMdRegularIcon />
                        </span>
                    }
                />
            </div>
        </div>
    );
});

export default WorkspaceGroup;
