import { getImageLocation } from '@/public-path';
import { localize } from '@deriv-com/translations';

const SSOLoader = () => {
    return (
        <div className='sso-loader'>
            <div className='sso-loader__content'>
                <img src={getImageLocation('sso_loader.gif')} width={234} height={234} alt='loader' />
                <h3 className='callback__title'>{localize('Getting your account ready')}</h3>
            </div>
        </div>
    );
};

export default SSOLoader;
