import { observer } from 'mobx-react-lite';

import { Button } from '@deriv-com/ui';

import { useStore } from '@/hooks/useStore';
import { localize } from '@/utils/tmp/dummy';

import './index.scss';

const RecentFooter = observer(() => {
    const { load_modal } = useStore();
    const { is_open_button_loading, loadFileFromRecent } = load_modal;
    return (
        <Button
            text={localize('Open')}
            onClick={loadFileFromRecent}
            is_loading={is_open_button_loading}
            has_effect
            primary
            large
        />
    );
});

export default RecentFooter;
