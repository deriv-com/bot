import { ComponentProps } from 'react';
import { LegacyMenuHamburger1pxIcon } from '@deriv/quill-icons/Legacy';

type TToggleButton = {
    onClick: ComponentProps<'button'>['onClick'];
};

const ToggleButton = ({ onClick }: TToggleButton) => (
    <button onClick={onClick}>
        <LegacyMenuHamburger1pxIcon iconSize='xs' fill='var(--text-general)' />
    </button>
);

export default ToggleButton;
