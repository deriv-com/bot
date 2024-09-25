import Checkbox from '@/components/shared_ui/checkbox';
import { TFiltersProps } from '../journal.types';

const Filters = ({
    wrapper_ref,
    checked_filters,
    filters,
    filterMessage,
    className,
    classNameLabel,
}: TFiltersProps) => (
    <div ref={wrapper_ref} className={className}>
        {filters.map(item => {
            const hasFilter = Array.isArray(checked_filters) && checked_filters.includes(item.id);
            return (
                <Checkbox
                    key={item.id}
                    labelClassName={classNameLabel}
                    checked={hasFilter}
                    label={item.label}
                    onChange={() => filterMessage(!hasFilter, item.id)}
                    name={item.id}
                />
            );
        })}
    </div>
);

export default Filters;
