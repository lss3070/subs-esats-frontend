
import React from "react";
import { useCartsState } from '../context/CartsContext';

interface ICartProps{
    onclose:()=>void;
    postion:{
        x:number
        y:number
    }
  }

export const Cart:React.FC<ICartProps>=({onclose,postion}) => {
    const carts = useCartsState();
    const postionStyle={
        left:postion.x-100,
        top:postion.y+20
    }
    console.log(carts);
    return(
        <div className="modal-cart" style={postionStyle}>
        <div className="modal-header">
          <span onClick={onclose} className="float-right cursor-pointer">X</span>
        </div>
        <div>
            {carts&&carts.length>0&&carts.map((cart)=>{
                   <span>{cart.dish.name}</span>
                })
            }
        </div>
        <div className="btn">buy</div>
      </div>
    )
}