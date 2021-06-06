
import React from "react";
import { Link } from "react-router-dom";
interface IOrderProgs{
    orderId:number;
    restaurantName:string;
    restaurantImg:string;
    restaurantZipCode:number;
    customerZipCode:number;
    customerAddress:string;
}

export const Order:React.FC<IOrderProgs>=(
    {orderId,restaurantName,restaurantImg,restaurantZipCode,customerZipCode,customerAddress})=>{
        const temp =()=>{
            const service= new google.maps.DistanceMatrixService();
            // new google.maps.LatLng()

            // service.getDistanceMatrix(
            //     {
            //         origins:[],
            //         destinations: [destinationA, destinationB],
            //         travelMode: 'DRIVING',
            //         transitOptions: TransitOptions,
            //         drivingOptions: DrivingOptions,
            //         unitSystem: UnitSystem,
            //         avoidHighways: Boolean,
            //         avoidTolls: Boolean,
            //     },callback)
        }

        const callback=(response:google.maps.DistanceMatrixResponse,
             status:google.maps.DistanceMatrixStatus)=>{
            console.log(response);
            console.log(status);
        }
        return(
        <Link to={``}>
            <div onClick={temp} className="flex flex-col">
                <div
                style={{backgroundImage:`url(${restaurantImg})`}} 
                className="bg-red-500 bg-cover bg-center mb-3 py-28">
                    <h3 className="text-xl font-medium">
                        {restaurantName}
                    </h3>
                    <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
                        {customerAddress}
                    </span>
                </div>
            </div>
        </Link>

    )
}