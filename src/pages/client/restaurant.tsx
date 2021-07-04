

import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";
import { CreateOrderItemInput, DivisionInputType } from '../../__generated__/globalTypes';
import { DishOption } from '../../components/dish-option';
import { createOrder, createOrderVariables } from '../../__generated__/createOrder';
import { ICartProps, useCartsDispatch } from '../../context/CartsContext';
import { DishModal, ICartModalProps } from '../../components/dishModal';
import { DishParts } from '../../__generated__/DishParts';


export const RESTAURANT_QUERY =gql`
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
// const CREATE_ORDER_MUTATION=gql`
//     mutation createOrder($input:CreateOrderInput!){
//         createOrder(input:$input){
//             ok
//             error
//             orderId
//         }
//     }
// `

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

   
    const [orderStarted,setOrderStarted]= useState(false);
    const [openDishModal,setOpenDishModal]= useState(false);
    const [dishModalValue,setDishModalValue]= useState<ICartModalProps>();
    const [orderItems,setOrderItems]=useState<CreateOrderItemInput[]>([])
    const dispatch = useCartsDispatch()

    const dishModalOpen =(dish:DishParts)=>{
        const options= dish.options?.map((option)=>{
            let choices= option.choices?.map((choice)=>{
                return{ 
                    name: choice.name,
                    extra: choice.extra
                }
            })
            return{
                name: option.name,
                extra: option.extra,
                require:option.require,
                choices: choices
            }
        })
        let dishvalue:ICartModalProps ={
            restaurantId:+params.id,
            id:dish.id,
            name:dish.name,
            description:dish.description,
            photo:dish.photo!,
            count:1,
            price:dish.price,
            options:options
        }
        setDishModalValue(dishvalue);
        setOpenDishModal(true);
    }
    const dishModalClose=()=>{
        setOpenDishModal(false)
    }

    const triggerStartOrder=()=>{
        setOrderStarted(true);
    }
    const getItem=(dishId:number)=>{
        return orderItems.find((order)=>order.dishId===dishId)
    }
    const isSelected = (dishId:number)=> {
        return Boolean(getItem(dishId))
    }
    // const addItemToOrder =(dishId:number) =>{
    //     if(isSelected(dishId)){
    //         return;
    //     }
    //     setOrderItems((current)=>[{dishId,options:[]},...current])
    // }
    const removeFromOrder = (dishId:number)=>{
        setOrderItems((current)=> current.filter(dish=>dish.dishId!==dishId));
    }
    // const addOptionToItem =(dishId:number,optionName:string)=>{
    //     if(!isSelected(dishId)){
    //         return
    //     }
    //     const oldItem= getItem(dishId);
        
    //     if(oldItem){
    //         const hasOption = Boolean(
    //             oldItem.options?.find((aOption)=>aOption.name == optionName)
    //         );
    //         if(!hasOption){
    //             removeFromOrder(dishId);
    //             setOrderItems((current)=>[
    //                 {dishId,options:[{name:optionName}, ...oldItem.options!]},
    //                 ...current,
    //             ]);
    //             console.log(orderItems);
    //         }
    //     }
    // }
    // const removeOptionFromItem=(dishId:number,optionName:string)=>{
    //     if(!isSelected(dishId)){
    //         return;
    //     }
    //     const oldItem=getItem(dishId);
    //     if(oldItem){
    //         removeFromOrder(dishId);
    //         setOrderItems((current)=>[
    //             {dishId,options:oldItem.options?.filter(
    //                 option=> option.name!==optionName)},
    //             ...current
    //         ]);
    //         return oldItem.options?.filter(option=> option.name!==optionName);
    //     }
    // }
    const getOptionFromItem = (
        item:CreateOrderItemInput,
        optionName:string)=>{
        return item.options?.find((option)=>option.name===optionName)
    }
    const isOptionSelected=(dishId:number,optionName:string)=>{
        const item= getItem(dishId);
        if(item){
            return Boolean(getOptionFromItem(item,optionName));
        }
        return false;
    }
    const triggerCancelOrder=()=>{
        setOrderStarted(false);
        setOrderItems([]);
    };
    const history = useHistory();
    const onCompleted=(data:createOrder) =>{
        const{createOrder:{ok, orderId}}= data
        if(data.createOrder.ok){
            history.push(`/orders/${orderId}`)
            alert('order created')
        }
    }


    
    // const[createOrderMutation,{loading:placeOrder}]=useMutation<createOrder,createOrderVariables>
    // (CREATE_ORDER_MUTATION,{
    //     onCompleted
    // });
    const triggerConfirmOrder=()=>{
        // if(placeOrder){
        //     return;
        // }
        if(orderItems.length===0){
            alert("Can't place empty")
            return;
        }
        const ok = window.confirm("You ar about to place an order");
        if(ok){
            // createOrderMutation({
            //     variables:{
            //         input:{
            //             restaurantId:+params.id,
            //             items:orderItems,
            //         }
            //     }
            // })
        }
    }
    return(
        <div>
            <div className="bg-gray-800 py-24 bg-center bg-cover" 
            style={{backgroundImage:`url(${data?.restaurant.restaurant?.coverImg})`}}>

            {/* <div className="bg-white w-3/12 py-4 pl-48">
                <h4 className="text-4xl mb-3">
                    {data?.restaurant.restaurant?.name}
                </h4>
                <h5 className="text-sm font-light mb-2">
                    {data?.restaurant.restaurant?.category?.name}
                </h5>
                <h6 className="text-sm font-light">
                    {data?.restaurant.restaurant?.address}
                </h6>
            </div> */}
                <div className="text-white text-6xl ml-10">{data?.restaurant.restaurant?.name}</div>
            </div>
            <div className="px-10 mt-5">
                <div className="text-sm font-light mb-3">{data?.restaurant.restaurant?.description}</div>
                <div className="text-sm font-light">{data?.restaurant.restaurant?.address}</div>
            </div>
            <div className="w-full px-10 mt-12 cursor-pointer">
                <div className="flex border-b border-gray-300 pb-8">
                    {data?.restaurant.restaurant?.divisions?.map((division)=>{
                            return(
                                <div className="mr-10 text-lg">
                                    {division.name}
                                </div>
                            )
                        }
                        )}
                </div>
                </div>
            <div className="max-w-screen-2xl pb-32 flex flex-col items-end mt-5">
                {/* {!orderStarted && (
                <button onClick={triggerStartOrder} className="btn px-10">
                    Start Order
                </button>
                )}
                {orderStarted && (
                <div className="flex items-center">
                <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
                    Confirm Order
                </button>
                <button onClick={triggerCancelOrder} className="btn px-10 bg-black
                hover:bg-black">
                     Cancel Order
                 </button>
                 </div>
                )} */}
                <div>
                    {data?.restaurant.restaurant?.divisions?.map((division)=>{
                        const item = data.restaurant.restaurant?.menu.filter((item)=>item.divisions?.find((findItem)=>findItem.name===division.name))
                        
                            return(
                                <div className="mx-0 md:mx-10">
                                    <div className="font-semibold text-xl">
                                        {item?.length!>0&&division.name}
                                    </div>
                                    <div className="w-full grid mt-10 md:grid-cols-3 gap-x-5 gap-y-10">
                                    {item?.length!>0&&item?.map((dish,index)=>{
                                        return(
                                            <Dish
                                            isSelected={isSelected(dish.id)}
                                            id={dish.id}
                                            orderStarted={orderStarted}
                                            key={index}
                                            name={dish.name}
                                            photo={dish.photo!}
                                            description={dish.description}
                                            price={dish.price}
                                            isCustomer={true}
                                            options={dish.options}
                                            //  addItemToOrder={addItemToOrder}
                                            removeFromOrder={removeFromOrder}
                                            //  addOptionToItem={addOptionToItem}
                                            dishModalOpen={dishModalOpen}
                                            dishValue={dish}
                                            >
                                                {dish.options?.map((option, index) => (
                                                    <DishOption
                                                    key={index}
                                                    isSelected={isOptionSelected(dish.id,option.name)}
                                                    name={option.name}
                                                    extra={option.extra}
                                                    dishId={dish.id}
                                                    // addOptionToItem={addOptionToItem}
                                                    // removeOptionFromItem={removeOptionFromItem}
                                                    />
                                            ))}
                                        </Dish>
                                        )
                                    })}
                                    </div>
                                </div>
                                
                            )
                        }
                        )}
                </div>
            
   
                {/* <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
               
               {data?.restaurant.restaurant?.menu.map((dish,index) => {
                   console.log(data?.restaurant.restaurant?.divisions);
                   return (
                       
                    <Dish
                    isSelected={isSelected(dish.id)}
                    id={dish.id}
                     orderStarted={orderStarted}
                     key={index}
                     name={dish.name}
                     photo={dish.photo!}
                     description={dish.description}
                     price={dish.price}
                     isCustomer={true}
                     options={dish.options}
                    //  addItemToOrder={addItemToOrder}
                     removeFromOrder={removeFromOrder}
                    //  addOptionToItem={addOptionToItem}
                     dishModalOpen={dishModalOpen}
                     dishValue={dish}
                    >
                        {dish.options?.map((option, index) => (
                            <DishOption
                            key={index}
                            isSelected={isOptionSelected(dish.id,option.name)}
                            name={option.name}
                            extra={option.extra}
                            dishId={dish.id}
                            // addOptionToItem={addOptionToItem}
                            // removeOptionFromItem={removeOptionFromItem}
                            />
                    ))}
                    </Dish>
                     )
                    }
                     )}
               </div> */}
               {openDishModal&&<DishModal onclose={dishModalClose} 
                     addDish={dishModalValue!}></DishModal>}
            </div>
        </div>
    )
    
}