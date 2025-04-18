import React from 'react';
import classNames from 'classnames';
import Text from '@/components/shared_ui/text';
import { localize } from '@deriv-com/translations';

type TIconRadio = {
    google_drive_connected?: boolean;
    icon: React.ReactElement<{ className: string }, string>;
    text: string;
    onDriveConnect?: () => void;
};
const IconRadio = ({ icon, text, google_drive_connected }: TIconRadio) => {
    const is_drive_radio = text === 'Google Drive';

    return (
        <div className='save-type__container'>
            <div className='save-type__radio'>
                {icon &&
                    React.cloneElement(icon, {
                        className: classNames(
                            'save-type__icon',
                            {
                                'save-type__icon--active': is_drive_radio && google_drive_connected,
                                'save-type__icon--disabled': is_drive_radio && !google_drive_connected,
                            },
                            icon.props.className
                        ),
                    })}
                <Text
                    as='p'
                    align='center'
                    size='xxs'
                    color={is_drive_radio && !google_drive_connected ? 'disabled' : 'prominent'}
                    lineHeight='s'
                    className='save-type__radio-text'
                >
                    {localize(text)}
                </Text>
            </div>
        </div>
    );
};

export default IconRadio;
