
import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCartsState } from '../context/CartsContext';
import { createOrder, createOrderVariables } from "../__generated__/createOrder";
import { Button } from "./button";
import { useHistory } from 'react-router-dom';
import { CreateOrderItemInput } from "../__generated__/globalTypes";


const CREATE_ORDER_MUTATION=gql`
    mutation createOrder($input:CreateOrderInput!){
        createOrder(input:$input){
            ok
            error
            orderId
        }
    }
`

interface ICartProps{
    onclose:()=>void;
    postion:{
        x:number
        y:number
    }
  }

export const Cart:React.FC<ICartProps>=({onclose,postion}) => {
    const carts = useCartsState();
    const history = useHistory();

    const [orderItems,setOrderItems]= useState<CreateOrderItemInput[]>([])
    const {
      register,
      getValues,
      watch,
      formState: { errors,isValid },
      handleSubmit
    } = useForm({
      mode:"onChange",
  });
    const postionStyle={
        right:60,
        top:postion.y
    }

    const onCompleted=(data:createOrder) =>{
      const{createOrder:{ok, orderId}}= data
      if(data.createOrder.ok){
          history.push(`/orders/${orderId}`)
          alert('order created')
      }
  }
    const[createOrderMutation,{loading:placeOrder}]=useMutation<createOrder,createOrderVariables>
    (CREATE_ORDER_MUTATION,{
        onCompleted
    });



    
    const onSubmit=()=>{
  
      createOrderMutation({
        variables:{
            input:{
                restaurantId:+carts.restaurantId,
                items:orderItems,
            }
        }
    })
  }
  useEffect(() => {
    if (carts) {
      carts.cart?.map((cart)=>{
        const orderItem:CreateOrderItemInput={
          dishId:cart.dish.dishId,
          count:cart.dish.count,
          options:[]
        }
        cart.dish.options.map((option)=>{
          orderItem?.options?.push({
            name:option.name,
            choice:option.choice!==undefined?option.choice.name:undefined
          })
        })
        setOrderItems(current=>[...current,orderItem]);
      })
    }
  }, [carts])


    
    return(
        <div className="modal-cart" style={postionStyle}>
        <div className="modal-header">
          <span onClick={onclose} className="float-right cursor-pointer">X</span>
        </div>
        <div className="modal-content">
        
        <form onSubmit={handleSubmit(onSubmit)}>
        {carts.cart?.map((cart)=>{
              return(
                <div className="border-gray-700 border-2 mb-1">
                  <span>{cart.dish.name}</span>
                  {
                  cart.dish.options.map((option)=>{
                    if(option.choice===undefined){
                      return(
                        <div>
                          <span>{option.name}</span>
                          <span>{option.extra}</span>
                        </div>
                      )
                    }else{
                      return(
                        <div>
                          <div>
                            <span>{option.name}</span>
                          </div>
                          <div>
                            <span>{option.choice.name}</span>
                            <span>{option.choice.extra}</span>
                          </div>
                        </div>
                      )
                    }
                  })
                  }
                </div>
              )    
                })
            }
            <Button canClick={true} loading={false} actionText="Buy"/>
        </form>
        </div>
      </div>
    )
}