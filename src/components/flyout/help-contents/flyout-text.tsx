import { Text } from '@deriv-com/ui';

const FlyoutText = (props: { text: string }) => {
    const { text } = props;

    return (
        <Text as='p' size='xs' styles={{ lineHeight: '1.3em' }}>
            {text}
        </Text>
    );
};

export default FlyoutText;
