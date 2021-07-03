
import { gql, useMutation } from "@apollo/client";
import React, { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CartState, useCartsDispatch, useCartsState, CartType } from '../context/CartsContext';
import { createOrder, createOrderVariables } from "../__generated__/createOrder";
import { Button } from "./button";
import { useHistory } from 'react-router-dom';
import { CreateOrderItemInput } from "../__generated__/globalTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";


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
    state:CartState;
    onclose:()=>void;
    postion:{
        x:number
        y:number
    }
  }

export const Cart:React.FC<ICartProps>=({onclose,postion,state}) => {
  
    // const state = useCartsState();
    const [value,setValue] = useState<CartType[]|undefined>(state.cart!);
    const dispatch = useCartsDispatch();
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
          onclose();
          state.cart=[];
          history.push(`/orders/${orderId}`)
          alert('order created')
      }
      
  }
    const[createOrderMutation,{loading:placeOrder}]=useMutation<createOrder,createOrderVariables>
    (CREATE_ORDER_MUTATION,{
        onCompleted
    });



    const countChange=(e:ChangeEvent<HTMLSelectElement>,fakeId: string)=>{
      if(e.currentTarget.value==="0"){
       removeItem(fakeId);
      }else{
        changeItem(e,fakeId)
      }
      // const newItem = state.cart?.map((item)=>{
      //   if(item.dish.fakeId===fakeId){
      //     item.dish.count=+e.currentTarget.value;
      //     return item;
      //   }else return item;
      // })
      console.log("changeEvent");
      console.log(value);
    dispatch({
      type:'UPDATE',
      cart:value!
    });
    }
    const removeItem=(fakeId:string)=>{
      
      const returnValue = state.cart?.filter(item=>item.dish.fakeId!==fakeId);
   
      setValue(returnValue);
    }

    const changeItem =(e:ChangeEvent<HTMLSelectElement>,fakeId:string)=>{
      const returnValue =state.cart?.map((item)=>{
        if(item.dish.fakeId===fakeId){
          item.dish.count=+e.currentTarget.value;
          return item;
        }else return item;
      })
      setValue(returnValue!);
    }

    const onSubmit=()=>{
  
      createOrderMutation({
        variables:{
            input:{
                restaurantId:+state.restaurantId,
                items:orderItems,
            }
        }
    })
  }
  useEffect(() => {
    console.log("useeffect!!");
    console.log(value);
    console.log(state.cart)
    if (state.cart) {
      state.cart?.map((cart)=>{
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
    localStorage.setItem("cartdata", JSON.stringify(state));
  }, [value])

    return(
        <div className="fixed z-999 h-auto w-2/6 bg-white shadow-2xl border-1
        " style={postionStyle}>
        <div className= "h-5">
          <span onClick={onclose} className="float-right cursor-pointer">X</span>
        </div>
        {state.cart?.length!==0?
        ( <div className=" p-5">
        <h1 className="text-2xl mb-5">Your order</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" h overflow-y-scroll">
          {state.cart?.map((cart)=>{
              return(
                <div className=" mb-1 grid-flow-col grid">
                  <div>
                    <select className=" bg-gray-300 rounded-lg focus:outline-none"
                    onChange={(e)=>countChange(e,cart.dish.fakeId)} value={cart.dish.count}>
                      {Array.from(Array(50),(e,i)=>{
                       return <option className="" value={i}>{i==0?"remove":i}</option>
                      })}
                    </select>
                  </div>
                  <div>
                  <span className=" text-lg">{cart.dish.name}</span>
                  {
                  cart.dish.options.map((option)=>{
                    if(option.choice===undefined){
                      return(
                        <div>
                          <span className=" text-xs">{option.name}</span>
                          <span className=" text-xs">{option.extra}</span>
                        </div>
                      )
                    }else{
                      return(
                        <div>
                          <div>
                            <span className=" text-xs font-extralight">{option.name}
                            (${option.choice.extra})
                            </span>
                          </div>
                          <div>
                            <span className=" text-xs text-gray-400 font-extralight">{option.choice.name}</span>
                          </div>
                        </div>
                      )
                    }
                  })
                  }
                  </div>
                  <div>
                    $ {cart.dish.price* cart.dish.count}
                  </div>
                </div>
              )    
                })
            }
          </div>

            <Button canClick={true} loading={false} actionText="Buy"/>
        </form>
        </div>
      )
        :
        (<div className=" grid p-10">
          <div className="text-center">
          <FontAwesomeIcon icon={faShoppingCart} className="text-6xl  text-gray-400 "></FontAwesomeIcon>
          </div>
          <div className=" text-center text-gray-500">
            Add items from a restaurant or store to start a new cart
          </div>
        </div>)
      }
       
      </div>
    )
}