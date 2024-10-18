import React from 'react';
import Text from '@/components/shared_ui/text';

type TSectionMessage = {
    icon: React.ReactNode;
    message: string;
    className?: string;
};

const SectionMessage: React.FC<TSectionMessage> = ({ icon, message, className }) => {
    return (
        <div className={className}>
            {icon && <span className='icon'>{icon}</span>}
            <span className='text'>
                <Text size='xs'>{message}</Text>
            </span>
        </div>
    );
};

export default SectionMessage;
