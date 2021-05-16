

import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";
import { CreateOrderItemInput } from '../../__generated__/globalTypes';




const RESTAURANT_QUERY =gql`
    query restaurant($input:RestaurantInput!){
        restaurant(input:$input){
            ok
            error
            restaurant{
                ...RestaurantParts
                menu{
                    ...DishParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
`

const CREATE_ORDER_MUTATION=gql`
    mutation createOrder($input:CreateOrderInput!){
        createOrder(input:$input){
            ok
            error
        }
    }
`

interface IRestaurantPramas{
    id:string;
}

export const Restaurant =()=>{
    const params = useParams<IRestaurantPramas>();
    const {loading,data} =useQuery<restaurant,restaurantVariables>(RESTAURANT_QUERY,{
        variables:{
            input:{
                restaurantId:+params.id
            }
        }
    });

    const getItem=(dishId:number)=>{
        return orderItems.find((order)=>order.dishId===dishId)
    }
    const [orderStarted,setOrderStarted]= useState(false);
    const [orderItems,setOrderItmes]=useState<CreateOrderItemInput[]>([])
    const triggerStartOrder=()=>{
        setOrderStarted(true);
    }
    const isSelected = (dishId:number)=> {
        return Boolean(getItem(dishId))
    }
    const addItemToOrder =(dishId:number) =>{
        if(isSelected(dishId)){
            return;
        }
        setOrderItmes(current=>[{dishId,option:[]},...current])
    }
    console.log(orderItems);
    const removeFromOrder = (dishId:number)=>{
        setOrderItmes((current)=> current.filter(dish=>dish.dishId!==dishId));
    }
    const addOptionToItem =(dishId:number,option:any)=>{
        if(!isSelected(dishId)){
            return
        }
        const oldItem= getItem(dishId);
        if(oldItem){
            removeFromOrder(dishId)
            setOrderItems((current)=>[{dishId,options:[option, ...oldItem.options!]},...current]);
        }

    }
    return(
        <div>
            <div className="bg-gray-800 py-48 bg-center bg-cover" 
            style={{backgroundImage:`url(${data?.restaurant.restaurant?.coverImg})`}}>

            <div className="bg-white w-3/12 py-4 pl-48">
                <h4 className="text-4xl mb-3">
                    {data?.restaurant.restaurant?.name}
                </h4>
                <h5 className="text-sm font-light mb-2">
                    {data?.restaurant.restaurant?.category?.name}
                </h5>
                <h6 className="text-sm font-light">
                    {data?.restaurant.restaurant?.address}
                </h6>
            </div>
            </div>
            <div className="container pb-32 flex flex-col items-end mt-20">
                <button onClick={triggerStartOrder} className="btn px-10">
                    {orderStarted?"Ordering":"Start Order"}
                </button>
                <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
               {data?.restaurant.restaurant?.menu.map((dish,index) => {
                   return (
                    <Dish
                    isSelected={isSelected(dish.id)}
                    id={dish.id}
                     orderStarted={orderStarted}
                     key={index}
                     name={dish.name}
                     description={dish.description}
                     price={dish.price}
                     isCustomer={true}
                     options={dish.options}
                     addItemToOrder={addItemToOrder}
                     removeFromOrder={removeFromOrder}
                     addOptionToItem={addOptionToItem}
                    />
                     )
            }
               )}
               </div>
            </div>
        </div>
    )
}