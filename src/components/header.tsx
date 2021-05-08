import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import mainlogo from "../images/logo.svg"

interface IHeaderProps {
    email:string;
}

export const Header:React.FC=() => {
    const {data}= useMe();
    return(
        <>
        {!data?.me.verified &&  
        <div className="bg-red-500 p-3 text-center text-white text-base">
            <span>Please verify your email</span>
        </div>}
            <header className="py-4">
                <div className="w-full px-5 md:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
                    <img src={mainlogo} className="w-36 mb-10" alt="Nuber eats"/>
                    <span className="text-xs">
                        <Link to="/edit-profile/">
                            <FontAwesomeIcon icon={faUser} className="text-xl"/>
                        </Link>
                    </span>
                </div>
            </header>
    </>
)}

//rem은 전체에서 찾고
//em 가장 가까운 element에서 찾는다.