import React, {lazy, Suspense} from 'react';


export interface Iprops {
    src: string,
    name: string,
}

const LazyImage = lazy(() => import('./LazyImage')); // 이미지를 그리는 컴포넌트를 lazy 시켰습니다. lazy는 동적 import를 사용하는 함수를 인자로 넣어줘야합니다.

const LazyItem = ({src, name}: Iprops) => {
    return (
        <div className="w-full h-full">
            <Suspense fallback={<div>...loading</div>}> 
                <LazyImage src={src} name={name}/>
            </Suspense>
        </div>
    );
};

export default LazyItem;