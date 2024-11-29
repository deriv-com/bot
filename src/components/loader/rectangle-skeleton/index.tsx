import React from 'react';
import './rectangle-skeleton.scss';

const RectangleSkeleton: React.FC<{ width: string; height: string }> = ({ width, height }) => {
    return <div className='skeleton' style={{ width, height }} />;
};

export default RectangleSkeleton;
