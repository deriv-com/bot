import { observer } from 'mobx-react-lite';
import { Loader } from '@deriv-com/ui';

// import { useDBotStore } from '@/hooks/useStore';

const BlocklyLoading = observer(() => {
    // const { blockly_store } = useStore();
    // const { is_loading } = blockly_store;
    const is_loading = false;
    return (
        <>
            {is_loading && (
                <div className='bot__loading' data-testid='blockly-loader'>
                    <Loader />
                </div>
            )}
        </>
    );
});

export default BlocklyLoading;
