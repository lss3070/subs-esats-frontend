import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory } from 'react-router-dom';


interface IMatchProgs{
    matchName:string;
}  
export const NotMatch:React.FC<IMatchProgs>=({matchName})=>{
    const history = useHistory();

    const onClick=()=>{
        history.push("/");
    }
    return(
<div className="h-screen flex flex-col items-center justify-center">
    <Helmet>
        <title>Not Match Page</title>
    </Helmet>
    <h2 className="font-semibold text-2xl mb-3">Not Match Page</h2>
    <h4 className="font-medium text-base mb-5">We didn't find a match for"{matchName}"</h4>
    <span onClick={onClick} className="btn cursor-pointer">
        View All Restaurants
    </span>
</div>
)
    }
