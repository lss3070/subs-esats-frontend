


import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import { Link } from "react-router-dom";
import axios from 'axios';

interface IOrderProgs{
    orderId:number;
    restaurantName:string;
    restaurantAddress:string;
    restaurantImg:string;
    customerAddress:string;
}

interface PlaceInfo{
    lat:number;
    lng:number;
    placeId:string;
}


export const Order:React.FC<IOrderProgs>=(
    {orderId,restaurantName,restaurantImg,restaurantAddress,customerAddress})=>{
        const [map,setMap] = useState<google.maps.Map>();
        const [customerLatLng,setCustomerLatLng] = useState<PlaceInfo>();
        const [restaurantLatLng,setRestaurantLatLng]= useState<PlaceInfo>();
        const [eta,setETA]=useState();//예상시간
        const [ed,setED]=useState();//거리
        //나와의 거리


        const service= new google.maps.DistanceMatrixService();
        const geocoder = new google.maps.Geocoder();

        useEffect(()=>{
             geocoder.geocode({address:customerAddress},function(results,status){
                    if(status==google.maps.GeocoderStatus.OK){
                        setCustomerLatLng({
                            lat:results[0].geometry.location.lat(),
                            lng:results[0].geometry.location.lng(),
                            placeId:results[0].place_id
                        })
                        console.log(results[0]);
                        console.log(customerLatLng)
                    }else{
                        alert("fail status!!");
                    }
                })
        },[]);
        useEffect(()=>{
             geocoder.geocode({address:restaurantAddress},function(results,status){
                if(status==google.maps.GeocoderStatus.OK){
                    setRestaurantLatLng({
                        lat:results[0].geometry.location.lat(),
                        lng:results[0].geometry.location.lng(),
                        placeId:results[0].place_id
                    })
                }else{
                    alert("fail status!!");
                }
            });
       },[]);
       useEffect(()=>{
  
        if(restaurantLatLng?.lat&&restaurantLatLng?.lng&&customerLatLng?.lat&&customerLatLng?.lng){
            const cc = axios(`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${restaurantLatLng?.lat},${restaurantLatLng?.lng}&&goal=${customerLatLng?.lat},${customerLatLng?.lng}&&option=trafast`,
            {
                method: 'GET',
                headers: {
                    "X-NCP-APIGW-API-KEY-ID": "m6bcbwpcqv",
                    "X-NCP-APIGW-API-KEY": "egZEV3OWuoueN5kooBDNkDyLhQlO05WaI3ZyRs4d",
                },
              }).then(response => {
                  console.log("!!!!")
                console.log(response);
              }).catch(e=>{
                  console.log("error");
                  console.log(e)
              })
              console.log(cc);
            //   const temp= axios.create({
            //     headers:{
            //     'X-NCP-APIGW-API-KEY-ID': 'm6bcbwpcqv',
            //     "X-NCP-APIGW-API-KEY":'egZEV3OWuoueN5kooBDNkDyLhQlO05WaI3ZyRs4d',
            //     "Access-Control-Allow-Origin": "*",
            //     }
            // })

            // const aa= temp.get(`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${restaurantLatLng?.lat},${restaurantLatLng?.lng}&&goal=${customerLatLng?.lat},${customerLatLng?.lng}&&option=trafast`)
            // console.log(aa);
    
        }
        
             //google api 정확도 떨어져서 naver 지도로 바꿈...
        // customerLatLng&&restaurantLatLng&&service.getDistanceMatrix(
        //     {
        //         origins:[{
        //             placeId:restaurantLatLng.placeId, }],
        //         destinations: [{
        //         placeId:customerLatLng.placeId}],
        //         travelMode: google.maps.TravelMode.WALKING,
        //         // transitOptions: TransitOptions,
        //         // drivingOptions: DrivingOptions,
        //         unitSystem: google.maps.UnitSystem.METRIC,
        //         avoidHighways: false,
        //         avoidTolls: false,
        //     },callback)
       });

        const callback=(response:google.maps.DistanceMatrixResponse,
             status:google.maps.DistanceMatrixStatus)=>{

            console.log(response);
            console.log(status);
        }
        return(
        <Link to={``}>
            <div className="flex flex-col">
                <div
                style={{backgroundImage:`url(${restaurantImg})`}} 
                className="bg-red-500 bg-cover bg-center mb-3 py-28">
                    <h3 className="text-xl font-medium">
                        {restaurantName}
                    </h3>
                    <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
                        {customerAddress}
                    </span>
                    <span>
                        예상시간{}
                    </span>
                    <span>
                        km{}
                    </span>
                </div>
            </div>
        </Link>

    )
}