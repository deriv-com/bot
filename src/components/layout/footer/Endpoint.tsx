import { Link } from 'react-router-dom';
import { ENDPOINT } from '@/utils/constants';
import { Text } from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';

const Endpoint = () => {
    const serverURL = LocalStorageUtils.getValue<string>(LocalStorageConstants.configServerURL);

    if (serverURL) {
        return (
            <Text className='app-footer__endpoint' color='red' size='sm'>
                The server{' '}
                <Link className='app-footer__endpoint-text' to={ENDPOINT}>
                    endpoint
                </Link>{' '}
                {`is: ${serverURL}`}
            </Text>
        );
    }
    return null;
};

export default Endpoint;
