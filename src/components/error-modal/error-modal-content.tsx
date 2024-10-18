import { DerivLightUserErrorIcon } from '@deriv/quill-icons/Illustration';
import { Localize } from '@deriv-com/translations';
import Button from '../shared_ui/button';
import Text from '../shared_ui/text';

type TErrorModalContent = {
    error_message?: string;
};

const ErrorModalContent = ({ error_message }: TErrorModalContent) => {
    return (
        <div className='unhandled-error'>
            <DerivLightUserErrorIcon height='120px' width='120px' fill='var(--text-general)' />
            <Text className='da-icon-with-message__text' as='p' lineHeight='xxl' align='center' weight='bold'>
                <Localize i18n_default_text='Sorry for the interruption' />
            </Text>
            <Text className='da-icon-with-message__text__desc' as='p' size='xs' lineHeight='xxs' align='center'>
                {error_message}
            </Text>
            <Button onClick={() => location.reload()} has_effect primary large>
                <Localize i18n_default_text='Refresh' />
            </Button>
        </div>
    );
};

export default ErrorModalContent;
