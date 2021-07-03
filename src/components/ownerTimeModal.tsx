
import { gql } from "@apollo/client";
import React, { useState } from "react";
import { OrderStatus } from "../__generated__/globalTypes";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    <div className="modal-wrap" style={{background:"rgba(38, 38, 38, 0.8)"}}>
      <div className="modal-header">
        <span onClick={onclose} className="float-left cursor-pointer p-2">
          <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
        </span>
      </div>
      <div  className="modal-content pb-4 px-10">
          <div className="w-full mb-2 text-center">
              <span className="text-xl font-semibold">배달 예상시간을 선택해주세요.</span>
          </div>
          <div>
              <div className="flex flex-row max-w-full items-center">
                <span className="w-1/3 text-center cursor-pointer
                 hover:bg-gray-300
                " onClick={()=>setTime(20)}>20분</span>
                <span className="w-1/3 text-center cursor-pointer
                hover:bg-gray-300" onClick={()=>setTime(30)}>30분</span>
                <span className="w-1/3 text-center cursor-pointer
                hover:bg-gray-300" onClick={()=>setTime(40)}>40분</span>
              </div>
              <div className="flex flex-row max-w-full items-center">
                <span className="w-1/3 text-center cursor-pointer
                hover:bg-gray-300"  onClick={()=>setTime(50)}>50분</span>
                <span className="w-1/3 text-center cursor-pointer
                hover:bg-gray-300"  onClick={()=>setTime(60)}>60분</span>
                <span className="w-1/3 text-center cursor-pointer
                hover:bg-gray-300"  onClick={()=>setTime(90)}>90분</span>
              </div>
          </div>
          <div className="mt-2 flex flex-row justify-center">
            <input className="border border-gray-400 h-12 mt-2 text-center" pattern="[0-9]*" onChange={onChange} placeholder="배달시간을 입력하세요" value={time}/>
            <span onClick={onSubmit} className="mini-btn w-1/5">접수</span>
          </div>
      </div>
    </div>
    )
}
   