import { useEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';
import useGrowthbookGetFeatureValue from '@/hooks/growthbook/useGrowthbookGetFeatureValue';

const useFreshChat = (token: string | null) => {
    const scriptStatus = useScript('https://static.deriv.com/scripts/freshchat/v1.0.2.js');
    const [isReady, setIsReady] = useState(false);
    const { featureFlagValue, isGBLoaded } = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_freshchat',
    });

    useEffect(() => {
        const checkFcWidget = (intervalId: NodeJS.Timeout) => {
            if (typeof window !== 'undefined') {
                if (window.fcWidget?.isInitialized() == true && !isReady) {
                    setIsReady(true);
                    clearInterval(intervalId);
                }
            }
        };

        const initFreshChat = async () => {
            if (scriptStatus === 'ready' && window.FreshChat && window.fcSettings) {
                window.FreshChat.initialize({
                    token,
                    hideButton: true,
                });

                const intervalId = setInterval(() => checkFcWidget(intervalId), 500);

                return () => clearInterval(intervalId);
            }
        };

        featureFlagValue && isGBLoaded && initFreshChat();
    }, [featureFlagValue, isGBLoaded, isReady, scriptStatus, token]);

    return {
        isReady,
        widget: window.fcWidget,
        featureFlagValue,
    };
};

export default useFreshChat;
