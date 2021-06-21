import React, { useState, useEffect } from "react";
import { OrderStatus } from "../__generated__/globalTypes";
import { OrderNaviProps } from './orderNavi';

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
    items:clientMultipleOrdersQuery_getMultipleOrders_orders_items[];
}
interface IParams{
    id:string;
}




export const ClientOrder:React.FC<IOrderProgs>=(
    {orderId,restaurantName,restaurantId,customerAddress,customerDetailAddress,orderDate,status,deliveryTime,naviStatus,
    total,items})=>{
        return(
            <div >
                <div
                style={{border:"1px solid red"}} 
                className="bg-cover bg-center mb-3 py-10 flex flex-row w-full">
                    <div>
                        <h2 className="text-4xl">
                            {new Date(orderDate).getFullYear()}/ 
                            {new Date(orderDate).getMonth()}/
                            {new Date(orderDate).getDate()}
                        </h2>
                        <h2 className="text-center text-xl">{status}</h2>
                    </div>
                    <div className="ml-4">
                        <div className=" text-2xl">{restaurantName}</div>
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
                        {status!==OrderStatus.Deliverd&&(
                            <div>
                                예상시간 :{deliveryTime}
                            </div>
                        )}
                    </div>
                    <div className="grid">
                        <Link to={`/restaurants/${restaurantId}`} className="mini-btn">가게보기</Link>
                        <Link to={`/orders/${orderId}`} className="mini-btn">주문상세</Link>
                    </div>
                </div>
            </div>
    )
}