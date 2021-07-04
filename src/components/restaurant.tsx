
import React from "react";
import { Link } from "react-router-dom";
interface IRestaurantProgs{
    id:string;
    coverImg:string;
    name:string|null;
    categoryName?:string;
}

export const Restaurant:React.FC<IRestaurantProgs>=(
    {id,coverImg,name,categoryName})=>(
        <Link to={`/restaurants/${id}`}>
            <div className="flex flex-col">
                <div
                style={{backgroundImage:`url(${coverImg})`}} 
                className=" bg-cover bg-center mb-3 py-28">
                    <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
                        {categoryName}
                    </span>
                </div>
                <div className="text-xl font-medium">
                {name}
                </div>
                <div className="text-gray-400 text-base">
                    $1.49 Delivery Free
                </div>
            </div>
        </Link>

)