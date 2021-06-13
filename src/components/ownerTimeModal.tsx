
import React, { useState } from "react";
import { OrderStatus } from "../__generated__/globalTypes";


interface IModalProps{
  onclose:()=>void;
  orderId:number;
  status:OrderStatus;
  onPreSubmit:(orderId:number,status:OrderStatus,time:number)=>void;
}

export const OwnerTimeModal:React.FC<IModalProps>=({onclose,onPreSubmit,orderId,status})=>{
    const [time,setTime]=useState<number>();

    const onChange=(e:React.FormEvent<HTMLInputElement>)=>{
        setTime(+e.currentTarget.value);
    }

    const onSubmit=()=>{
        onPreSubmit(orderId,status,time!)
    }

    return (
    <div className="modal-wrap">
      <div className="modal-header">
        <span onClick={onclose} className="float-right cursor-pointer">X</span>
      </div>
      <div  className="modal-content">
          <div>
              <div>
                <span onClick={()=>setTime(20)}>20분</span>
                <span onClick={()=>setTime(30)}>30분</span>
                <span onClick={()=>setTime(40)}>40분</span>
              </div>
              <div>
                <span onClick={()=>setTime(50)}>50분</span>
                <span onClick={()=>setTime(50)}>60분</span>
                <span onClick={()=>setTime(90)}>90분</span>
              </div>
          </div>
          <div>
            <input type="" pattern="[0-9]*" onChange={onChange} placeholder="배달시간을 입력하세요" value={time}/>
            <span onClick={onSubmit} className="btn"></span>
          </div>
      </div>
    </div>
    )
}
   