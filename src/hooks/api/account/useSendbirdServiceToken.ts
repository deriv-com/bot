import { useGetSettings, useServiceToken } from '@deriv-com/api-hooks';

const SEVEN_DAYS_MILLISECONDS = 604800000;

/** A custom hook that get Service Token for Sendbird. */
const useSendbirdServiceToken = () => {
    const { isSuccess } = useGetSettings();
    const { data, ...rest } = useServiceToken({
        enabled: isSuccess,
        payload: {
            service: 'sendbird',
        },
        staleTime: SEVEN_DAYS_MILLISECONDS, // Sendbird tokens expire 7 days by default
    });

    return {
        /** return the sendbird service token */
        data: data?.sendbird,
        ...rest,
    };
};

export default useSendbirdServiceToken;
