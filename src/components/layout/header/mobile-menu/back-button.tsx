import Text from '@/components/shared_ui/text';
import { LegacyChevronLeft1pxIcon } from '@deriv/quill-icons';
import { useDevice } from '@deriv-com/ui';

type TBackButton = {
    buttonText: string;
    onClick: () => void;
};

const BackButton = ({ buttonText, onClick }: TBackButton) => {
    const { isDesktop } = useDevice();

    return (
        <button className='flex items-center w-full pt-8 p-[3.2rem]' onClick={onClick}>
            <LegacyChevronLeft1pxIcon iconSize='xs' />

            <Text className='ml-[1.6rem]' size={isDesktop ? 's' : 'xs'} weight='bold'>
                {buttonText}
            </Text>
        </button>
    );
};

export default BackButton;
