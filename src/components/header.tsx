import { faUser,faSignOutAlt,faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, MouseEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { useMe } from "../hooks/useMe";
import mainlogo from "../images/logo.svg"
import { Modal } from "../pages/modal";
import { Cart } from "./cart";

interface IHeaderProps {
    email:string;
}
interface position{
    x:number
    y:number
}

export const Header:React.FC=() => {
    const {data}= useMe();
    const [cartOpen,setCartOpen] =useState(false);
    const [position,setPosition]= useState<position>()
    const history = useHistory();

    const Logout=()=>{
        localStorage.removeItem(LOCALSTORAGE_TOKEN);
        window.location.href = '/'; 
     }
     const openCart = (e: MouseEvent<HTMLSpanElement>)=>{
        setPosition({x:e.pageX,y:e.pageY})
       if(cartOpen) setCartOpen(false);
        else setCartOpen(true)
    }
    const closeCart=()=>{
        setCartOpen(false)
    }
    return(
        <>
        {!data?.me.verified &&  
        <div className="bg-red-500 p-3 text-center text-white text-base">
            <span>Please verify your email</span>
        </div>}
            <header className="py-4">
                <div className="w-full px-5 md:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
                    <Link to="/">
                        <img src={mainlogo} className="w-36 mb-10" alt="Nuber eats"/>
                    </Link>
                    <span className="text-xs">
                        <span onClick={openCart} className="text-xl cursor-pointer mr-2">
                            <FontAwesomeIcon icon={faShoppingCart} className="text-xl"></FontAwesomeIcon>
                        </span>
                        <Link to="/edit-profile/">
                            <FontAwesomeIcon icon={faUser} className="text-xl mr-2"/>
                        </Link>
                        <span onClick={Logout} className="text-xl cursor-pointer">
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-xl"></FontAwesomeIcon>
                        </span>
                    </span>
                </div>
                {cartOpen&&(
                        <Modal><Cart onclose={closeCart} postion={position!}/></Modal>
                    )}
            </header>
    </>
)}

//rem은 전체에서 찾고
//em 가장 가까운 element에서 찾는다.