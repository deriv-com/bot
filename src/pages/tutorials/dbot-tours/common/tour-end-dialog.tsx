import { observer } from 'mobx-react-lite';

import { Localize, localize } from '@deriv-com/translations';
import { Dialog, Text } from '@deriv-com/ui';

import { useStore } from '@/hooks/useStore';

const TourEndDialog = observer(() => {
    const { ui } = useStore();
    const { dashboard } = useStore();
    const { is_tour_dialog_visible, setTourDialogVisibility } = dashboard;
    const { is_mobile } = ui;

    const getTourContent = () => {
        return (
            <>
                <div className='dc-dialog__content__description__text' data-testid='tour-success-message'>
                    <Localize
                        key={0}
                        i18n_default_text={'You have successfully created your bot using a simple strategy.'}
                    />
                </div>
                <div className='dc-dialog__content__description__text'>
                    <Localize
                        key={0}
                        i18n_default_text={'Now, <0>run the bot</0> to test out the strategy.'}
                        components={[<strong key={0} />]}
                    />
                </div>
                <div className='dc-dialog__content__description__text'>
                    <Localize
                        key={0}
                        i18n_default_text={
                            'Note: If you wish to learn more about the Bot Builder, you can proceed to the <0>Tutorials</0> tab.'
                        }
                        components={[<strong key={0} />]}
                    />
                </div>
            </>
        );
    };

    const onHandleConfirm = () => {
        setTourDialogVisibility(false);
    };

    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                confirm_button_text={localize('OK')}
                onConfirm={onHandleConfirm}
                is_mobile_full_width
                className='dc-dialog tour-dialog'
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent' size={is_mobile ? 'xs' : 's'}>
                        {localize('Congratulations')}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text size={is_mobile ? 'xxs' : 'xs'} color='prominent'>
                        {getTourContent()}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default TourEndDialog;
