



import React from "react"
import { Link } from 'react-router-dom';
import { OrderStatus } from "../__generated__/globalTypes";

export const OrderNavi =()=>{
    return(
        <div className=" min-w-full flex items-center flex-col">
            <div>
                <Link to={`/orders/${OrderStatus.Cooked}`} 
                className="border-gray-500 border-t-2 border-b-2 border-l-2 text-3xl p-5 cursor-pointer">
                    대기</Link>
                <Link to={`/orders/${OrderStatus.PickedUp}`}
                className="border-gray-500 border-2 text-3xl p-5 cursor-pointer">
                    진행</Link>
                <Link to={`/orders/${OrderStatus.Deliverd}`}
                className=" border-gray-500 border-t-2 border-b-2 text-3xl border-r-2 p-5 cursor-pointer">
                    완료</Link>
            </div>
        </div>
    )
}