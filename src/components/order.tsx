


import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import { Link } from "react-router-dom";
import axios from 'axios';
import jsonp from 'jsonp';
import { gql, useMutation } from "@apollo/client";
import { takeOrder, takeOrderVariables } from '../__generated__/takeOrder';

interface IOrderProgs{
    orderId:number;
    restaurantName:string;
    restaurantAddress:string;
    restaurantImg:string;
    customerAddress:string;
    customerDetailAddress:string;
    orderDate:string;
    status:string
}

interface PlaceInfo{
    lat:number;
    lng:number;
    placeId:string;
}

const TAKE_ORDER_MUTATION =gql`

mutation takeOrder($input:TakeOrderInput!){
    takeOrder(input:$input){
            ok
            error
        }
    }
`




export const Order:React.FC<IOrderProgs>=(
    {orderId,restaurantName,restaurantImg,restaurantAddress,customerAddress,customerDetailAddress,orderDate,status})=>{
        const [map,setMap] = useState<google.maps.Map>();
        const [customerLatLng,setCustomerLatLng] = useState<PlaceInfo>();
        const [restaurantLatLng,setRestaurantLatLng]= useState<PlaceInfo>();
        const [distance,setDistance]=useState<string>();//예상시간
        const [duration,setDuration]=useState<string>();//거리
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


        // if(restaurantLatLng?.lat&&restaurantLatLng?.lng&&customerLatLng?.lat&&customerLatLng?.lng){
        //     // jsonp(`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${restaurantLatLng?.lat},${restaurantLatLng?.lng}&&goal=${customerLatLng?.lat},${customerLatLng?.lng}&&option=trafast`,undefined,(e,d)=>{

        //     // })
            
        //     const cc = axios(`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${restaurantLatLng?.lat},${restaurantLatLng?.lng}&&goal=${customerLatLng?.lat},${customerLatLng?.lng}&&option=trafast`,
        //     {
        //         method: 'GET',
        //         headers: {
        //             "X-NCP-APIGW-API-KEY-ID": "m6bcbwpcqv",
        //             "X-NCP-APIGW-API-KEY": "egZEV3OWuoueN5kooBDNkDyLhQlO05WaI3ZyRs4d",
        //             'Access-Control-Allow-Origin': '*'
        //         },
        //       }).then(response => {
        //           console.log("!!!!")
        //         console.log(response);
        //       }).catch(e=>{
        //           console.log("error");
        //           console.log(e)
        //       })
   
    
        // }
        
             //google api 정확도 떨어져서 naver 지도로 바꿈...
        customerLatLng&&restaurantLatLng&&service.getDistanceMatrix(
            {
                origins:[{
                    placeId:restaurantLatLng.placeId, }],
                destinations: [{
                placeId:customerLatLng.placeId}],
                travelMode: google.maps.TravelMode.TRANSIT,
                // transitOptions: TransitOptions,
                // drivingOptions: DrivingOptions,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
            },callback)
       });

        const callback=(response:google.maps.DistanceMatrixResponse,
             status:google.maps.DistanceMatrixStatus)=>{
                setDistance(response.rows[0].elements[0].distance.text);
                setDuration(response.rows[0].elements[0].duration.text);
        }

        const onCompleted=()=>{
            alert('success!!');
        }
        const [takeOrderMutation,{loading}]=useMutation<
        takeOrder,takeOrderVariables>(TAKE_ORDER_MUTATION,{
            onCompleted,
        });

        const onClick=()=>{
            takeOrderMutation(({
                variables:{
                    input:{
                        id:+orderId
                    }
                }
            }))
        }
        return(
        <Link to={``}>
            <div className="flex flex-col">
                <div
                style={{border:"1px solid red"}} 
                className="bg-cover bg-center mb-3 py-10">
                    <h5>
                        {status}
                    </h5>
                    <h3 className="text-4xl">
                        {restaurantName}
                    </h3>
                    <div className="float-left">
                        <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400 block">
                        {restaurantAddress}
                        </span>
                        <h4 className="mt-2 py-2 block text-xl">
                            배달 위치
                        </h4>
                        <span className="mt-2 py-2 text-xs opacity-50 block">
                            {customerAddress} {customerDetailAddress}
                        </span>
                        <span className="mt-2 py-2 text-xs opacity-50 block">
                            {orderDate}
                        </span>
                    </div>
                    <div className="float-right">
                        <div>
                            예상시간 {duration}
                        </div>
                        <div>
                            거리  {distance}
                        </div>
                        <div onClick={onClick} className="btn text-center">
                           픽업 선택
                        </div>
                    </div>
                </div>
            </div>
        </Link>

    )
}