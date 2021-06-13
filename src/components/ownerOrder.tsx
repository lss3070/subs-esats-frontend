import React, { useState, useEffect } from "react";
import { OrderStatus } from "../__generated__/globalTypes";
import { OrderNaviProps } from './orderNavi';
import {  multipleOrdersQuery_getMultipleOrders_orders_items } from "../__generated__/multipleOrdersQuery";
import { useMutation } from "@apollo/client";
import { editOrder, editOrderVariables } from "../__generated__/editOrder";
import { EDIT_ORDER } from "../pages/order";
import { Modal } from "../pages/modal";
import { OwnerTimeModal } from "./ownerTimeModal";

interface IOrderProgs{
    orderId:number;
    restaurantName:string;
    customerAddress:string;
    customerDetailAddress:string;
    orderDate:string;
    status:OrderStatus;
    naviStatus:OrderNaviProps;
    total:number;
    items:multipleOrdersQuery_getMultipleOrders_orders_items[];
}
interface IParams{
    id:string;
}

export const OwnerOrder:React.FC<IOrderProgs>=(
    {orderId,restaurantName,customerAddress,customerDetailAddress,orderDate,status,naviStatus,
    total,items})=>{

        const[submitOpen,setSubmitOpen]=useState(false);
        const [editOrderMutation] = useMutation<
        editOrder,editOrderVariables>(EDIT_ORDER,{
            
         })
         const closeSubmit=()=>{
             setSubmitOpen(false);
         }
         const openSubmit=()=>{
             setSubmitOpen(true);
           
        }
        const onSubmit=(orderId:number, status:OrderStatus,time:number)=>{
            const item =status===OrderStatus.Pending?OrderStatus.Cooking:(
                status===OrderStatus.Cooking?OrderStatus.Cooked:status);
            editOrderMutation({
                variables:{
                    input:{
                        id:orderId,
                        status:item
                    }
                }
            })
        }
         

        return(
            <div >
                <div
                style={{border:"1px solid red"}} 
                className="bg-cover bg-center mb-3 py-10 flex flex-row w-full">
                    <div>
                        <h2 className="text-4xl">{new Date(orderDate).getUTCHours()}:{new Date(orderDate).getUTCMinutes()}</h2>
                    </div>
                    <div className="ml-4">
                        <div>
                            <span>[메뉴{items.length}개 ]</span>
                            <span>${total}</span>
                        </div>
                        {items.map((item)=>{
                            return(
                                <span>{item.id}/</span>
                            )
                        })}
                        <div> {customerAddress} {customerDetailAddress}</div>
                        <div>{restaurantName}</div>
                    </div>
                    <div className="float-right">
                        <div onClick={openSubmit} className="btn">접수하기</div>
                    </div>
                    {submitOpen&&  (<Modal><OwnerTimeModal 
                    onclose={closeSubmit} 
                    orderId={orderId} status={status}
                    onPreSubmit={onSubmit}
                    /></Modal>)}
                </div>
            </div>
    )
}