

import React, { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { cookedOrders } from '../../__generated__/cookedOrders';
import { Link, useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';


const COOKED_ORDERS_SUBSCRIPTION =gql`
    subscription cookedOrders{
        cookedOrders{
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`

const TAKE_ORDER_MUTATION= gql`
    mutation takeOrder($input:TakeOrderInput!){
        takeOrder(input:$input){
            ok
            error
        }
    }
`

interface ICoords{
    lat:number;
    lng:number;
}

interface IDriverProps{
    lat:number;
    lng:number;
    $hover?:any;
}

export const DashBoard =()=>{
    const [driverCoords,setDriverCoords]= useState<ICoords>({lng:0,lat:0});
    const [map,setMap] = useState<google.maps.Map>();
    const [maps,setMaps] = useState<any>();

    //@ts-ignore
    const onSuccess=({coords:{latitude,longitude}}:Position)=>{
        setDriverCoords({lat:latitude,lng:longitude})
    }
    //@ts-ignore
    const onError=(error:PositionError)=>{
        console.log(error);
    }
    useEffect(()=>{
        navigator.geolocation.watchPosition(onSuccess,onError,{
            enableHighAccuracy:true,
        })
    },[]);
    useEffect(()=>{
        if(map && maps){
            map.panTo(new google.maps.LatLng(driverCoords.lat,driverCoords.lng));

            //google 연동 결제 됨 
            // const geocoder = new google.maps.Geocoder();
            // geocoder.geocode(
            //     {
            //         location: new google.maps.LatLng(driverCoords.lat,driverCoords.lng),
            //     },
            //     (results,status)=>{
            //         console.log(status,results);

            //     }
            // );
        }
    },[driverCoords.lat,driverCoords.lng])
    const onApiLoaded =({map,maps}:{map:any,maps:any})=>{
        map.panTo(new google.maps.LatLng(driverCoords.lat,driverCoords.lng));
        setMap(map);
        setMaps(maps);
    }
    const makeRoute=()=>{
        if(map){
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({polylineOptions:{
                strokeColor:"#000",
                strokeOpacity:1,
                strokeWeight:3
            }});
            directionsRenderer.setMap(map);
            directionsService.route(
                {
                    origin:{
                        location:new google.maps.LatLng(
                            driverCoords.lat,
                            driverCoords.lng
                            )
                    },
                    destination:{
                        location: new google.maps.LatLng(
                            driverCoords.lat+ 0.05,
                            driverCoords.lng+0.05)
                    },
                    travelMode:google.maps.TravelMode.DRIVING,
                },(result,status)=>{
                    directionsRenderer.setDirections(result);
                });
        }
       
    };
    const {data:cookedOrdersData} = useSubscription<cookedOrders>(COOKED_ORDERS_SUBSCRIPTION)

    useEffect(()=>{
        if(cookedOrdersData?.cookedOrders.id){
            makeRoute();
        }
    },[cookedOrdersData]);

    const history = useHistory();
    const onCompleted=(data:takeOrder)=>{
        if(data.takeOrder.ok){
            history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`)
        }
    }
    const[takeOrderMutation]= useMutation<takeOrder,takeOrderVariables>(
        TAKE_ORDER_MUTATION,{
            onCompleted
    });
    const triggerMutation = (orderId:number)=>{
        takeOrderMutation({
            variables:{
                input:{
                    id: orderId
                }
            }
        })
    }
    return (
        <div>
        <div className=" bg-gray-800 overflow-hidden" 
        style={{width:window.innerWidth,height:"50vh"}}
        >
        <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={onApiLoaded}
            bootstrapURLKeys={{key:"AIzaSyC-TwQItJHA06gC8gwHtT578TwTO5p6nhM"}}
            defaultZoom={16}
            defaultCenter={{
                lat:36.58,
                lng:125.95
            }}
        >
            <div 
            // @ts-ignore
            lat={driverCoords.lat} 
            lng={driverCoords.lng}
            className="text-lg">
            🚖
            </div>
        </GoogleMapReact>
        </div>
        {
        cookedOrdersData?.cookedOrders.restaurant ?
        (
        <>
        <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
            <h1 className="text-center text-3xl font-medium">New Cooked Order</h1>
            <h4 className="text-center my-3 text-2xl font-medium">
                Pick it up soon @ {cookedOrdersData.cookedOrders.restaurant?.name}
            </h4>
            <button 
            onClick={
                ()=>triggerMutation(cookedOrdersData.cookedOrders.id)} 
            className="btn w-full mt-5 block text-center">
                Accept Challenge &rarr;
            </button>
        </div>
        </> 
        )
        : (<h1 className="text-center text-3xl font-medium">
            No orders yet ...
        </h1>
        )}
    </div>
    )
}