



import React from "react"
import { Link } from 'react-router-dom';
import { OrderStatus } from "../__generated__/globalTypes";

export enum OrderNaviProps {

    Pending="pending",
    Progress="progress",
    Complete = "complete"
}

export const OrderNavi =()=>{
    return(
        <div className=" min-w-full flex items-center flex-col">
            <div>
                <Link to={`/orders/${OrderNaviProps.Pending}`} 
                className="border-gray-500 border-t-2 border-b-2 border-l-2 text-3xl p-5 cursor-pointer">
                    Pending</Link>
                <Link to={`/orders/${OrderNaviProps.Progress}`}
                className="border-gray-500 border-2 text-3xl p-5 cursor-pointer">
                    Progress</Link>
                <Link to={`/orders/${OrderNaviProps.Complete}`}
                className=" border-gray-500 border-t-2 border-b-2 text-3xl border-r-2 p-5 cursor-pointer">
                    Complete</Link>
            </div>
        </div>
    )
}