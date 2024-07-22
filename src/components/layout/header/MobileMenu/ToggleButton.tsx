import { ComponentProps } from 'react';
import { LegacyMenuHamburger1pxIcon } from '@deriv/quill-icons';

type TToggleButton = {
    onClick: ComponentProps<'button'>['onClick'];
};

export const ToggleButton = ({ onClick }: TToggleButton) => (
    <button className='h-full px-4 border-r border-[#f2f3f4]' onClick={onClick}>
        <LegacyMenuHamburger1pxIcon iconSize='xs' />
    </button>
);
