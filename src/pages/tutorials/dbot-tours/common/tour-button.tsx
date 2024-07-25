import Text from '@/components/shared_ui/text';

type TTourButton = {
    type?: string;
    onClick: () => void;
    label: string;
};

const TourButton = ({ label, type = 'default', ...props }: TTourButton) => {
    if (!label) return null;
    return (
        <button className={type} {...props}>
            <Text color='prominent' align='center' weight='bold' as='span' lineHeight='s' size='xs'>
                {label}
            </Text>
        </button>
    );
};

export default TourButton;
