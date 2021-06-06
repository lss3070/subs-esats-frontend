
import React, { useState } from "react";
import {DaumPostcode,AddressData} from "react-daum-postcode";


interface IAddressProps{
  onclose:()=>void;
  addAddress:(zipCode:string,address:string)=>void;
}

export const AddressSearch:React.FC<IAddressProps>=({onclose,addAddress})=>{
    const [isAddress, setIsAddress] = useState("");
    const [isZoneCode, setIsZoneCode] = useState<string>();

    
    const addressComplete=(data:AddressData)=>{
      console.log(data);
        let address = data.address;
        let extraAddress = "";
    
        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          address += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setIsZoneCode(data.zonecode);
        setIsAddress(address);

        let zipCode= data.zonecode;
        addAddress(zipCode,address);
        onclose();
        // setIsPostOpen(false);
    }
    return (
    <div className="modal-wrap">
      <div className="modal-header">
        <span onClick={onclose} className="float-right cursor-pointer">X</span>
      </div>
      <div  className="modal-content">
        <DaumPostcode onComplete={addressComplete}/>
      </div>
    </div>
    )
}
   