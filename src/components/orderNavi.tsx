



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
                className="text-3xl p-5 cursor-pointer
                 bg-lime-600 text-white
                 hover:bg-lime-700
                 mr-10
                ">
                    Pending</Link>
                <Link to={`/orders/${OrderNaviProps.Progress}`}
                className=" text-3xl p-5 cursor-pointer
                bg-lime-600 text-white
                hover:bg-lime-700
                mr-10
                ">
                    Progress</Link>
                <Link to={`/orders/${OrderNaviProps.Complete}`}
                className="  text-3xl p-5 cursor-pointer
                bg-lime-600 text-white
                hover:bg-lime-700
                mr-10
                ">
                    Complete</Link>
            </div>
        </div>
    )
}