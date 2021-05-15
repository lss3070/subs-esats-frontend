


import React from "react";


interface IDishProps{
    name:string;
    price:number;
    description:string;
}

export const Dish:React.FC<IDishProps> =({name,price,description})=>{
    console.log(description)
    return(
        <div className="px-8 py-4 border hover:border-gray-800 translation-allow" >
            <div className="mb-5">
                <h3 className="text-lg font-medium mb-5">{name}</h3>
                <h4 className="font-medium">{description}</h4>
            </div>
            <span>${price}</span>
        </div>
    )
}