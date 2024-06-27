import { memo } from 'react';

import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from '@deriv/deriv-charts';

import { isDesktop } from '@/components/shared';

type TToolbarWidgetsProps = {
    updateChartType: (chart_type: string) => void;
    updateGranularity: (updateGranularity: number) => void;
    position?: string | null;
};

const ToolbarWidgets = ({ updateChartType, updateGranularity, position }: TToolbarWidgetsProps) => {
    return (
        <>
            <div id='chart_modal_root' />
            <ToolbarWidget position={position}>
                <ChartMode
                    portalNodeId='chart_modal_root'
                    onChartType={updateChartType}
                    onGranularity={updateGranularity}
                />
                {isDesktop() && (
                    <>
                        <StudyLegend portalNodeId='chart_modal_root' searchInputClassName='data-hj-whitelist' />
                        <Views
                            portalNodeId='chart_modal_root'
                            onChartType={updateChartType}
                            onGranularity={updateGranularity}
                            searchInputClassName='data-hj-whitelist'
                        />
                        <DrawTools portalNodeId='chart_modal_root' />
                        <Share portalNodeId='chart_modal_root' />
                    </>
                )}
            </ToolbarWidget>
        </>
    );
};

export default memo(ToolbarWidgets);
