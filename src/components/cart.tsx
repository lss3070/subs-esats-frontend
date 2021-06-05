
import React from "react";
import { useCartsState } from '../context/CartsContext';
import { Button } from "./button";

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
        right:60,
        top:postion.y
    }
    return(
        <div className="modal-cart" style={postionStyle}>
        <div className="modal-header">
          <span onClick={onclose} className="float-right cursor-pointer">X</span>
        </div>
        <div className="modal-content">
        
        <form>
        {carts.map((cart)=>{
              return(
                <div>
                  <span>{cart.dish.name}</span>
                  {
                  cart.dish.options.map((option)=>{
                    if(option.choices===undefined){
                      return(
                        <div>
                          <span>{option.name}</span>
                          <span>{option.extra}</span>
                        </div>
                      )
                    }else{
                      return(
                        <div>
                          <div>
                            <span>{option.name}</span>
                          </div>
                          <div>
                            <span>{option.choices.name}</span>
                            <span>{option.choices.extra}</span>
                          </div>
                        </div>
                      )
                    }
                  })
                  }
                </div>
              )    
                })
            }
            <Button canClick={true} loading={false} actionText="Buy"/>
        </form>
        </div>
      </div>
    )
}