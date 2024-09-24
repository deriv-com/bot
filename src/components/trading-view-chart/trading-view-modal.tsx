import React from 'react';
import { observer } from 'mobx-react-lite';
import DraggableResizeWrapper from '@/components/draggable/draggable-resize-wrapper';
import TradingViewComponent from '@/components/trading-view-chart/trading-view';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';

const TradingViewModal = observer(() => {
    const { dashboard } = useStore();
    const { is_trading_view_modal_visible, setTradingViewModalVisibility } = dashboard;

    return (
        <React.Fragment>
            {is_trading_view_modal_visible && (
                <DraggableResizeWrapper
                    boundary='.main'
                    header={localize('TradingView Chart')}
                    onClose={setTradingViewModalVisibility}
                    modalWidth={526}
                    modalHeight={595}
                    minWidth={526}
                    minHeight={524}
                    enableResizing
                >
                    <div style={{ height: 'calc(100% - 6rem)', padding: '0.5rem' }}>
                        <TradingViewComponent />
                    </div>
                </DraggableResizeWrapper>
            )}
        </React.Fragment>
    );
});

export default TradingViewModal;
