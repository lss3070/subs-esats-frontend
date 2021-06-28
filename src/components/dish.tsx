


import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";
import { DishParts } from '../__generated__/DishParts';



interface IDishProps{
    id?:number;
    name:string;
    price:number;
    description:string;
    photo:string;
    isCustomer?:boolean;
    orderStarted?:boolean;
    options:restaurant_restaurant_restaurant_menu_options[] | null;
    addItemToOrder?:(dishid:number)=>void;
    removeFromOrder?:(dishid:number)=>void;
    addOptionToItem?:(dishId:number,option:any)=>void;
    dishModalOpen?:(dish:DishParts)=>void;
    isSelected?:boolean;
    dishValue?:DishParts
}

export const Dish: React.FC<IDishProps> = ({
    id=0,
    name,
    price,
    description,
    photo,
    isCustomer=false,
    orderStarted=false,
    options,
    addItemToOrder,
    removeFromOrder,
    addOptionToItem,
    dishModalOpen,
    dishValue,
    isSelected,
    children:dishOptions,
}) => {
    const onClick=()=>{

            if(orderStarted){
                if(!isSelected && addItemToOrder){
                   return addItemToOrder(id)
                }
                if(isSelected && removeFromOrder){
                    return removeFromOrder(id)
                }
            }
    }
    const openModal=()=>{

        return dishModalOpen&&dishModalOpen(dishValue!);
    }
    return (
        <div
            className = {`px-8 py-4 border cursor-pointer hover:border-gray-800 translation-allow grid grid-cols-5
            
            ${isSelected? "border-gray-800": "hover:border-gary-800"} `} 
            onClick={openModal}
            > 
            <div className="col-span-3">
                <div className = "mb-5" > 
                    <h3 className = "text-lg font-medium mb-5" > {name}{" "} {orderStarted&& 
                    <button
                    className={`ml-3 py-1 px-3 focus:outline-none text-sm text-white ${
                        isSelected?"bg-red-500":"bg-lime-600"}`}
                    onClick={onClick}>{isSelected?"Remove":"Add"}</button>}</h3> 
                    < h4 className=" font-light" > {description.length>60?description.substring(0,60)+"...":description}</h4>
                </div>
                <span> $ {price}</span> 
            </div>
            <div className=" col-span-2">
                    <img className="w-40 h-40" src={photo}/>
            </div>

            {/* {
            isCustomer && options &&  options?.length!==0 &&(
            <div> 
                <h5 className="my-8 mb-3 font-medium">Dish Options:</h5>
                <div className="grid gap-2 justify-start">{dishOptions}</div>
            </div>)
        } */}
        </div>
      
    )
}

