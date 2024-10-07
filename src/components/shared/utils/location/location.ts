import { StatesList } from '@deriv/api-types';

export const getLocation = (location_list: StatesList, value: string, type: keyof StatesList[number]) => {
    if (!value || !location_list.length) return '';
    const location_obj = location_list.find(
        location => location[type === 'text' ? 'value' : 'text']?.toLowerCase() === value.toLowerCase()
    );

    return location_obj?.[type] ?? '';
};
