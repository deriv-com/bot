import { useEffect, useState } from 'react';

declare global {
    interface Window {
        Analytics: typeof Analytics;
    }
}
import { useIsMounted } from 'usehooks-ts';
import { Analytics } from '@deriv-com/analytics';
import getFeatureFlag from '../utils/getFeatureFlag';

interface UseGrowthbookGetFeatureValueArgs<T> {
    featureFlag: string;
    defaultValue?: T;
}

const useGrowthbookGetFeatureValue = <T extends string | boolean>({
    featureFlag,
    defaultValue,
}: UseGrowthbookGetFeatureValueArgs<T>) => {
    const resolvedDefaultValue: T = defaultValue !== undefined ? defaultValue : (false as T);
    const [featureFlagValue, setFeatureFlagValue] = useState<boolean>(false);
    const [isGBLoaded, setIsGBLoaded] = useState(false);
    const isMounted = useIsMounted();

    // Required for debugging Growthbook, this will be removed after this is added in the Analytics directly.
    if (typeof window !== 'undefined') {
        window.Analytics = Analytics;
    }

    useEffect(() => {
        const fetchFeatureFlag = async () => {
            const is_enabled = await getFeatureFlag(featureFlag, resolvedDefaultValue);
            if (isMounted()) {
                setFeatureFlagValue(is_enabled);
                setIsGBLoaded(true);
            }
        };

        fetchFeatureFlag();
    }, [featureFlag, resolvedDefaultValue, isMounted]);

    return [featureFlagValue, isGBLoaded];
};

export default useGrowthbookGetFeatureValue;
