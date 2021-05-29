
import React, { useState } from "react";
import {DaumPostcode,AddressData} from "react-daum-postcode";


export const AddressSearch=()=>{
    const [isAddress, setIsAddress] = useState("");
    const [isZoneCode, setIsZoneCode] = useState<string>();

    const addressComplete=(data:AddressData)=>{
        let fullAddress = data.address;
        let extraAddress = "";
    
        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setIsZoneCode(data.zonecode);
        setIsAddress(fullAddress);
        // setIsPostOpen(false);
    }

    return (<div className="">
        <DaumPostcode onComplete={addressComplete}/>
    </div>)
}
   