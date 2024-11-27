import Checkbox from '@/components/shared_ui/checkbox';
import { TFiltersProps } from '../journal.types';

const Filters = ({ wrapper_ref, checked_filters, filters, filterMessage, className }: TFiltersProps) => (
    <div ref={wrapper_ref} className={className}>
        {filters.map(item => {
            const hasFilter = Array.isArray(checked_filters) && checked_filters.includes(item.id);
            return (
                <Checkbox
                    key={item.id}
                    checked={hasFilter}
                    label={item.label}
                    onChange={() => filterMessage(!hasFilter, item.id)}
                    name={item.id}
                    defaultChecked={hasFilter}
                />
            );
        })}
    </div>
);

export default Filters;
