import { Link } from 'react-router-dom';
import { standalone_routes } from '@/components/shared';
import Text from '@/components/shared_ui/text';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';

const Endpoint = () => {
    const serverURL = LocalStorageUtils.getValue<string>(LocalStorageConstants.configServerURL);

    if (serverURL) {
        return (
            <Text className='app-footer__endpoint' color='red' size='s'>
                The server{' '}
                <Link className='app-footer__endpoint-text' to={standalone_routes.endpoint}>
                    endpoint
                </Link>{' '}
                {`is: ${serverURL}`}
            </Text>
        );
    }
    return null;
};

export default Endpoint;
