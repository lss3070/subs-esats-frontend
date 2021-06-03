
import React from "react";

interface ICartProps{
    onclose:()=>void;
    postion:{
        x:number
        y:number
    }
  }

export const Cart:React.FC<ICartProps>=({onclose,postion}) => {
    const postionStyle={
        left:postion.x-100,
        top:postion.y+20
    }
    return(
        <div className="modal-cart" style={postionStyle}>
        <div className="modal-header">
          <span onClick={onclose} className="float-right cursor-pointer">X</span>
        </div>
        <div className="btn">buy</div>
      </div>
    )
}