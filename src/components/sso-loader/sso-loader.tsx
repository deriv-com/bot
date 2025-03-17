import { getImageLocation } from '@/public-path';

const SSOLoader = () => {
    return (
        <div className='sso-loader'>
            <div className='sso-loader__content'>
                <img src={getImageLocation('sso_loader.gif')} width={234} height={234} alt='loader' />
                <h3 className='callback__title'>We are getting your account ready...</h3>
            </div>
        </div>
    );
};

export default SSOLoader;
