import React, { useState, useEffect } from "react";
import { OrderStatus } from "../__generated__/globalTypes";
import { OrderNaviProps } from './orderNavi';
import { BaseMutationOptions, gql, MutationHookOptions, useMutation } from "@apollo/client";
import { editOrder, editOrderVariables } from '../__generated__/editOrder';
import { EDIT_ORDER } from "../pages/order";
import { Modal } from "../pages/modal";
import { OwnerTimeModal } from "./ownerTimeModal";
import { receiptOrder, receiptOrderVariables } from '../__generated__/receiptOrder';
import styled from 'styled-components'
import { ownerMultipleOrdersQuery_getMultipleOrders_orders_items } from "../__generated__/ownerMultipleOrdersQuery";
import { Link } from "react-router-dom";

interface IOrderProgs{
    orderId:number;
    restaurantName:string;
    customerAddress:string;
    customerDetailAddress:string;
    orderDate:string;
    status:OrderStatus;
    naviStatus:OrderNaviProps;
    image:string;
    total:number;
    items:ownerMultipleOrdersQuery_getMultipleOrders_orders_items[];
    refTarget:React.RefObject<HTMLDivElement>;
}
interface IParams{
    id:string;
}


const RECEIPT_ORDER_MUTATION= gql`
mutation receiptOrder($input:ReceiptOrderInput!) {
    receiptOrder(input:$input){
        ok
        error
    }
}
`


export const OwnerOrder:React.FC<IOrderProgs>=(
    {orderId,restaurantName,customerAddress,customerDetailAddress,orderDate,status,image,naviStatus,
    total,items,refTarget})=>{
        
        const[submitOpen,setSubmitOpen]=useState(false);

        const onCompleted=(data:any) =>{
           
            setSubmitOpen(false);
            let ok;
            if(data.receiptOrder){
                ok = data.receiptOrder.ok;
                // const{receiptOrder:{ok}}= data
            }else{
                ok = data.editOrder.ok
                // const {editOrder:{ok}}=data
            }
            // const{receiptOrder:{ok}}= data
            // const {editOrder:{ok}}=data
            console.log(ok);
            if(!ok){
                console.log("error....");
            }else{
                window.location.reload();
            }
            
        }
        
  

        const [editOrderMutation] = useMutation<
        editOrder,editOrderVariables>(EDIT_ORDER,{onCompleted})

        const [receiptOrderMutation] = useMutation<
        receiptOrder,receiptOrderVariables>(RECEIPT_ORDER_MUTATION,{onCompleted})

         const closeSubmit=()=>{
             setSubmitOpen(false);
         }
         const openSubmit=()=>{
             setSubmitOpen(true);
           
        }

        const onSubmit=(orderId:number, status:OrderStatus,time:number)=>{
    
            const item =status===OrderStatus.Pending?OrderStatus.Cooking:(
                status===OrderStatus.Cooking?OrderStatus.Cooked:status);

            receiptOrderMutation({
                variables:{
                    input:{
                        id:orderId,
                        status:item,
                        deliveryTime:time
                    }
                }
            })

        }
        const onEditOrder=()=>{
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
        const onCancelOrder=()=>{
            editOrderMutation({
                variables:{
                    input:{
                        id:orderId,
                        status:OrderStatus.Canceled
                    }
                }
            })
        }


        const OrderItem = styled.div`
         &::before{
             /* background-color: aqua; */
             content:"";
             background-image: url(${image}) !important;
             opacity:0.5;
             position:absolute;
            background-size:100%;
            width:100%;

            min-height:160px;
            z-index:-1;
            }
        `
        return(
            <div className="mb-10" style={{height:160}}>
                <OrderItem
                ref={refTarget}
                className="
                bg-cover 
                bg-center 
                grid 
                grid-cols-10
                h-full
                w-full">
                    <div className="col-span-1 flex flex-col justify-center">
                        <h2 className="text-4xl text-center  ">{new Date(orderDate).getUTCHours()}:{new Date(orderDate).getUTCMinutes()}</h2>
                        <h2 className="text-center text-xl ">{status}</h2>
                    </div>
                    <div className="ml-4 col-span-7 flex flex-col justify-center">
                        <div>
                            <span>[??????{items.length}??? ]</span>
                            <span>${total}</span>
                        </div>
                        <div>
                            {items.map((item,i)=>{
                                if(i<5){
                                    return(
                                        <span>{item.dish.name}/</span>
                                    )
                                }
                            })}
                            {items.length>=5?"...":""}
                        </div>
                        <div> {customerAddress} {customerDetailAddress}</div>
                        <div>{restaurantName}</div>
                    </div>
                    {status===OrderStatus.Pending&&(
                        <div className="col-span-2 pr-6 flex flex-col justify-center">
                            <div onClick={openSubmit} className="btn text-center">????????????</div>
                            <div onClick={onCancelOrder} className="cancel-btn text-center">?????? ??????</div>
                        </div>
                    )
                    }
                    {status===OrderStatus.Cooking&&(
                        <div className=" col-span-2 pr-6 flex flex-col justify-center">
                            <div onClick={onEditOrder} className="btn text-center">Cooked</div>
                        </div>
                    )
                    }
                    {naviStatus===OrderNaviProps.Complete&&(
                    <div className="col-span-2 pr-6 flex flex-col justify-center">
                             <Link to={`/order/${orderId}`} className="btn text-center">????????????</Link>
                     </div>
                    )}
                    {submitOpen&&  (<Modal><OwnerTimeModal 
                    onclose={closeSubmit} 
                    orderId={orderId} status={status}
                    onPreSubmit={onSubmit}
                    /></Modal>)}
                </OrderItem>
            </div>
    )
}