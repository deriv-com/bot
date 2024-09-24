import React from 'react';
import { observer } from 'mobx-react-lite';
import DraggableResizeWrapper from '@/components/draggable/draggable-resize-wrapper';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import Chart from '..';

const ChartModalDesktop = observer(() => {
    const { dashboard } = useStore();
    const { is_chart_modal_visible, setChartModalVisibility } = dashboard;

    return (
        <React.Fragment>
            {is_chart_modal_visible && (
                <DraggableResizeWrapper
                    boundary='.main'
                    header={localize('Chart')}
                    onClose={setChartModalVisibility}
                    modalWidth={526}
                    modalHeight={595}
                    minWidth={526}
                    minHeight={524}
                    enableResizing
                >
                    <div className='chart-modal-dialog' data-testid='chart-modal-dialog'>
                        <Chart show_digits_stats={false} />
                    </div>
                </DraggableResizeWrapper>
            )}
        </React.Fragment>
    );
});

export default ChartModalDesktop;
