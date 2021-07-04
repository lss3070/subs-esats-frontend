import React, { useState, useEffect } from "react";
import { OrderStatus } from "../__generated__/globalTypes";
import { OrderNaviProps } from './orderNavi';
import styled from 'styled-components'
import { Link } from "react-router-dom";
import { clientMultipleOrdersQuery_getMultipleOrders_orders_items } from "../__generated__/clientMultipleOrdersQuery";

interface IOrderProgs{
    orderId:number;
    restaurantName:string;
    restaurantId:number;
    customerAddress:string;
    customerDetailAddress:string;
    orderDate:string;
    status:OrderStatus;
    naviStatus:OrderNaviProps;
    total:number;
    deliveryTime:number;
    coverImg:string;
    items:clientMultipleOrdersQuery_getMultipleOrders_orders_items[];
    refTarget:React.RefObject<HTMLDivElement>;
}
interface IParams{
    id:string;
}




export const ClientOrder:React.FC<IOrderProgs>=(
    {orderId,restaurantName,restaurantId,customerAddress,customerDetailAddress,orderDate,status,deliveryTime,naviStatus,
        coverImg,total,items,refTarget})=>{

            const OrderItem = styled.div`
            &::before{
                /* background-color: aqua; */
                content:"";
                background-image: url(${coverImg}) !important;
                opacity:0.5;
                position:absolute;
               background-size:100%;
               width:100%;
   
               min-height:160px;
               z-index:-1;
               }
           `

        return(
            <div ref={refTarget}>
                <OrderItem
                className="bg-cover bg-center mb-3 py-5 grid grid-cols-5 w-full">
                    <div className="col-span-1 grid grid-flow-row mt-4">
                        <div className="text-4xl text-center">
                            {new Date(orderDate).getFullYear()}/ 
                            {new Date(orderDate).getMonth()}/
                            {new Date(orderDate).getDate()}
                        </div>
                        <div className="text-2xl text-center">
                            {new Date(orderDate).getHours()}:{new Date(orderDate).getMinutes()}
                        </div>
                        <div className="text-center text-xl">{status}</div>
                    </div>
                    <div className="ml-4 col-span-3 mt-4">
                        <div className=" text-2xl">{restaurantName}</div>
                        <div>
                            <span>[메뉴{items.length}개 ]</span>
                            <span>${total}</span>
                        </div>
                        {items.map((item)=>{
                            return(
                                <span>{item.dish.name}/</span>
                            )
                        })}
                        <div> {customerAddress} {customerDetailAddress}</div>
                        {status!==OrderStatus.Deliverd&&(
                            <div>
                                예상시간 : {deliveryTime}분
                            </div>
                        )}
                    </div>
                    <div className="grid col-span-1 p-4">
                        <Link to={`/restaurants/${restaurantId}`} className="mini-btn text-center">가게보기</Link>
                        <Link to={`/orders/${orderId}`} className="mini-btn text-center">주문상세</Link>
                    </div>
                </OrderItem>
            </div>
    )
}