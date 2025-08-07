import React, { useState } from 'react';
import PWAInstallModal from './PWAInstallModal';

export const PWAInstallModalTest: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const styles = {
        backgroundColor: '#ff444f',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
    };
    return (
        <div
            style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: 9999,
                ...styles,
            }}
        >
            <button onClick={() => setShowModal(true)} style={styles}>
                Test PWA Modal
            </button>

            <PWAInstallModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onInstall={() => {
                    setShowModal(false);
                }}
            />
        </div>
    );
};

export default PWAInstallModalTest;
