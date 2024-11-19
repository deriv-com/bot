import PropTypes from 'prop-types';
import { localize } from '@deriv-com/translations';
import PageErrorContainer from '../page-error-container';
import { standalone_routes } from '../shared';
import TradingAssesmentModal from '../trading-assesment-modal';

type TErrorComponent = {
    header: JSX.Element | string;
    message: JSX.Element | string;
    redirect_label: string;
    redirectOnClick: (() => void) | null;
    should_show_refresh: boolean;
    should_clear_error_on_click: boolean;
    setError: (has_error: boolean, error: any) => void;
    redirect_to: string;
    should_redirect: boolean;
};

const ErrorComponent = ({
    header,
    message,
    redirect_label,
    redirectOnClick = null,
    should_clear_error_on_click,
    setError,
    redirect_to = standalone_routes.trade,
    should_show_refresh = true,
    should_redirect = true,
}: Partial<TErrorComponent>) => {
    const refresh_message = should_show_refresh ? localize('Please refresh this page to continue.') : '';

    return (
        <>
            <TradingAssesmentModal />
            <PageErrorContainer
                error_header={header ?? ''}
                error_messages={message ? [message, refresh_message] : []}
                redirect_urls={[redirect_to]}
                redirect_labels={(!redirect_label && []) || [redirect_label || localize('Refresh')]}
                buttonOnClick={redirectOnClick || (() => window.location.reload())}
                should_clear_error_on_click={should_clear_error_on_click}
                setError={setError}
                should_redirect={should_redirect}
            />
        </>
    );
};

ErrorComponent.propTypes = {
    header: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    redirectOnClick: PropTypes.func || PropTypes.object,
    redirect_label: PropTypes.string,
    setError: PropTypes.func,
    should_clear_error_on_click: PropTypes.bool,
    should_redirect: PropTypes.bool,
    redirect_to: PropTypes.string,
    should_show_refresh: PropTypes.bool,
};

export default ErrorComponent;
