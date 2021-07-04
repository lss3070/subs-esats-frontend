import React from 'react';
import { Iprops } from './LazyItem';

const LazyImage = ({src, name} :Iprops) => {
    return (
        <img className="w-full h-full" src={src} alt={name}/>
    );
};

export default LazyImage;