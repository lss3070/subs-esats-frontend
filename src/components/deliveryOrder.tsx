import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import jsonp from 'jsonp';
import { gql, useMutation } from "@apollo/client";
import { takeOrder, takeOrderVariables } from '../__generated__/takeOrder';
import { EDIT_ORDER } from '../pages/order';
import { editOrder, editOrderVariables } from '../__generated__/editOrder';
import { OrderStatus } from "../__generated__/globalTypes";
import { OrderNaviProps } from './orderNavi';
import styled from 'styled-components'
import { DeliveryModal } from "./deliveryModal";

interface IOrderProgs{
    orderId:number;
    restaurantName:string;
    restaurantAddress:string;
    restaurantImg:string;
    customerAddress:string;
    customerDetailAddress:string;
    orderDate:string;
    status:OrderStatus;
    naviStatus:OrderNaviProps;
}

interface PlaceInfo{
    lat:number;
    lng:number;
    placeId:string;
}

const TAKE_ORDER =gql`

mutation takeOrder($input:TakeOrderInput!){
    takeOrder(input:$input){
            ok
            error
        }
    }
`


interface IParams{
    id:string;
}


export const DeliveryOrder:React.FC<IOrderProgs>=(
    {orderId,restaurantName,restaurantImg,restaurantAddress,customerAddress,customerDetailAddress,orderDate,status,naviStatus})=>{
        const [map,setMap] = useState<google.maps.Map>();
        const [customerLatLng,setCustomerLatLng] = useState<PlaceInfo>();
        const [restaurantLatLng,setRestaurantLatLng]= useState<PlaceInfo>();
        const [distance,setDistance]=useState<string>();//예상시간
        const [duration,setDuration]=useState<string>();//거리
        //나와의 거리

        const [openDeliveryModal,deliveryOpenModal]= useState(false);

        const service= new google.maps.DistanceMatrixService();
        const geocoder = new google.maps.Geocoder();

        useEffect(()=>{

            naviStatus!==OrderNaviProps.Complete&& geocoder.geocode({address:customerAddress},function(results,status){
                    if(status==google.maps.GeocoderStatus.OK){
                        setCustomerLatLng({
                            lat:results[0].geometry.location.lat(),
                            lng:results[0].geometry.location.lng(),
                            placeId:results[0].place_id
                        })
                        console.log(results[0]);
                        console.log(customerLatLng)
                    }else{
                        console.log("fail status!!");
                    }
                })
        },[]);
        useEffect(()=>{
            naviStatus!==OrderNaviProps.Complete&& geocoder.geocode({address:restaurantAddress},function(results,status){
                if(status==google.maps.GeocoderStatus.OK){
                    setRestaurantLatLng({
                        lat:results[0].geometry.location.lat(),
                        lng:results[0].geometry.location.lng(),
                        placeId:results[0].place_id
                    })
                }else{
                    console.log("fail status!!");
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
             naviStatus!==OrderNaviProps.Complete&& customerLatLng&&restaurantLatLng&&service.getDistanceMatrix(
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

    
        // const onCompleted=(data:editOrder) =>{

        //     const{editOrder:{ok}}= data
        //     if(ok){
        //         console.log("success")
        //         // history.push(`/orders/${orderId}`)
        //         // alert('order created')
        //     }else{
        //         console.log("fail ㅠㅜ");
        //     }
        // }
        const onCompleted=(data:any) =>{
            let ok =false;
            if(data.takeOrder!){
                ok = data.takeOrder.ok
            }else if(data.editOrder!){
                ok=data.editOrder.ok
            }
            if(ok){
                window.location.reload();
            }else{
                console.log("fail ㅠㅜ");
            }
        }

        const [editOrderMutation] = useMutation<
        editOrder,editOrderVariables>(EDIT_ORDER,{
            
         })
         const [takeOrderMutation] = useMutation<
         takeOrder,takeOrderVariables>(TAKE_ORDER,{
            onCompleted
          })


         
        const onDeliverySelect=()=>{

            deliveryOpenModal(true)
            // const updateStatus = status===OrderStatus.Cooked?OrderStatus.PickedUp:OrderStatus.Deliverd
            // takeOrderMutation({
            //     variables:{
            //         input:{
            //             id:orderId,
            //         }
            //     }
            // })
        }
        const onStatusChange=()=>{
            const item =status===OrderStatus.PickedUp?OrderStatus.Deliverd:(
                status===OrderStatus.Cooked?OrderStatus.PickedUp:status);
            editOrderMutation({
                variables:{
                    input:{
                        id:orderId,
                        status:item
                    }
                }
            })
        }
        const onModalClose=()=>{
            deliveryOpenModal(false);
        }
        const OrderItem = styled.div`
        &::before{
            /* background-color: aqua; */
            content:"";
            background-image: url(${restaurantImg}) !important;
            opacity:0.5;
            position:absolute;
           background-size:100%;
           width:100%;
           min-height:220px;
           z-index:-1;
           }
       `
        return(
           
                <OrderItem className="grid grid-cols-5 mb-10 h-56">
                    <div className="col-span-1 grid grid-flow-row">
                        <div className="text-3xl text-center">
                            {new Date(orderDate).getFullYear()}/
                            {new Date(orderDate).getMonth()}/
                            {new Date(orderDate).getDate()}
                        </div>
                        <div className="text-2xl text-center">
                            {new Date(orderDate).getHours()}:
                            {new Date(orderDate).getMinutes()}
                        </div>
                        <div className="text-center text-2xl text-gray-600">
                            {status}
                        </div>
                    </div>
                    <div className="col-span-3 grid grid-flow-row">
                        <div className="text-4xl">
                            {restaurantName}
                        </div>
                        <div className="">
                            <div className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400 block">
                                {restaurantAddress}
                            </div>
                            <div className="mt-2 py-2 text-xl">
                                배달 위치
                            </div>
                            <div className="mt-2 py-2 text-xs opacity-50">
                                {customerAddress} {customerDetailAddress}
                            </div>
                        </div>
                    </div>
                    <div>
                    <div className="col-span-1 p-4">
                        {naviStatus!==OrderNaviProps.Complete&&(
                            <div>
                                <div>
                                    예상시간 {duration}
                                </div>
                                <div>
                                    거리  {distance}
                                </div>
                            </div>
                        ) 
                        }
                        {naviStatus===OrderNaviProps.Pending&&(
                            <div onClick={onDeliverySelect} className="btn text-center cursor-pointer">
                                Delivery Select
                            </div>
                        )}
                        {status===OrderStatus.Cooked&&naviStatus===OrderNaviProps.Progress&&(
                            <div>
                                <div onClick={onStatusChange} className="btn cursor-pointer text-center">Picked Up</div>
                                <div className="cancel-btn cursor-pointer text-center">Delivery Cancel</div>
                            </div>
                        )}
                        {status===OrderStatus.PickedUp&&naviStatus===OrderNaviProps.Progress&&(
                            <div>
                                <div onClick={onStatusChange} className="btn cursor-pointer text-center">Deliverd</div>
                                <div className="cancel-btn cursor-pointer text-center">Pickedup Cancel</div>
                            </div>
                        )}
                        {/* {naviStatus===OrderNaviProps.Complete&&(
                             <div>
                                <div className="btn text-center">Detail</div>
                                <div className="cancel-btn text-center">Delivery Cancel</div>
                         </div>
                        )} */}
                    </div>
                    </div>
                    {openDeliveryModal&&<DeliveryModal 
                    orderId={orderId}
                    onclose={onModalClose}
                    restaurantAddress={customerLatLng!}
                    customerAddress={restaurantLatLng!}
                    duration={duration!}
                    distance={distance!}
                    ></DeliveryModal>}
              </OrderItem>
    )
}