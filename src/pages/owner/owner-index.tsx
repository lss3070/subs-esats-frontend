import React from "react"
import { Link } from "react-router-dom"
import { OrderNaviProps } from "../../components/orderNavi"


export const OwnerIndex =()=>{
    return(
        <div className="container text-center align-middle h-auto">
            <Link className=" border-gray-700 border-2 p-6 text-2xl mr-4" to={"/restaurants"}>My restaurants</Link>
            <Link className="border-gray-700 border-2 p-6 text-2xl" to={`/orders/${OrderNaviProps.Pending}`}>Orders</Link>
        </div>
    )
}
