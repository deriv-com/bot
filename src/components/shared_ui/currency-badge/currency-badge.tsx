import { getCurrencyDisplayCode } from '@/components/shared';
import Text from '../text';

type TCurrencyBadgeProps = {
    currency: string;
};

const CurrencyBadge = ({ currency }: TCurrencyBadgeProps) => (
    <Text className='dc-currency-badge' color='colored-background' lineHeight='unset' size='xxxs' weight='bold'>
        {getCurrencyDisplayCode(currency)}
    </Text>
);

export default CurrencyBadge;
