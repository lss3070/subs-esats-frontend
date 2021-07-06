import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useQuery, useSubscription } from '@apollo/client';
import { GET_ORDER } from '../pages/order';
import { getDeliveryOrder, getDeliveryOrderVariables } from '../__generated__/getDeliveryOrder';


const GET_DELIVERY_ORDER=gql`
query getDeliveryOrder($input:GetOrderInput!){
    getOrder(input:$input){
        ok
        error
        order{
            id
            items{
                dish{
                name
                }
            }
            customer{
                email
                address
                detailAddress
                name
            }
            restaurant{
                name
                address
                detailAddress
            }
        }
    }
}
`

interface DeliveryModalProps{
    orderId:number;
    customerAddress:PlaceInfo;
    restaurantAddress:PlaceInfo;
    duration:string;
    distance:string;
    onclose:()=>void;
    deliverySelect:()=>void;
}
interface PlaceInfo{
    lat:number;
    lng:number;
    placeId:string;
}
interface ICoords{
    lat:number;
    lng:number;
}

export const DeliveryModal:React.FC<DeliveryModalProps>=({onclose,customerAddress,restaurantAddress,distance,duration,orderId,deliverySelect})=>{

    //@ts-ignore
    const onSuccess=({coords:{latitude,longitude}}:Position)=>{
        setDriverCoords({lat:latitude,lng:longitude})
    }
    //@ts-ignore
    const onError=(error:PositionError)=>{
        console.log(error);
    }
    const [driverCoords,setDriverCoords]= useState<ICoords|undefined>();
    const [map,setMap] = useState<google.maps.Map>();
    const [maps,setMaps] = useState<any>();

    
    const {data,subscribeToMore}=useQuery<getDeliveryOrder,getDeliveryOrderVariables>(
        GET_DELIVERY_ORDER,
        {
        variables:{
            input:{
                id:orderId
            }
    }});
    
    
    useEffect(()=>{
        navigator.geolocation.watchPosition(onSuccess,onError,{
            enableHighAccuracy:true,
        })
    },[]);

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
                            customerAddress.lat,
                            customerAddress.lng
                            )
                    },
                    destination:{
                        location: new google.maps.LatLng(
                            restaurantAddress.lat,
                            restaurantAddress.lng)
                    },
                    travelMode:google.maps.TravelMode.TRANSIT,
                },(result,status)=>{
                    directionsRenderer.setDirections(result);
                });
        }
    };

    useEffect(()=>{
        if(driverCoords){
            makeRoute();
        }
    },[map,maps]);

    const onApiLoaded =({map,maps}:{map:any,maps:any})=>{
        map.panTo(new google.maps.LatLng(driverCoords!.lat,driverCoords!.lng));
        setMap(map);
        setMaps(maps);
    }

    return(
        <div className="modal-wrap" style={{background:"rgba(38, 38, 38, 0.8)"}}>
            <div  className="bg-white w-3/5 overflow-y-scroll h-auto">
                <div className="fixed p-3 z-999">
                    <FontAwesomeIcon onClick={onclose} icon={faTimes} className="text-2xl cursor-pointer"></FontAwesomeIcon>
                </div>
                <div className=" bg-gray-800 overflow-hidden w-full" 
                style={{height:"50vh"}}
                >
                    {driverCoords!&&(
                        <GoogleMapReact
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={onApiLoaded}
                        bootstrapURLKeys={{key:"AIzaSyBTrXLEW2gzwzHw7e6HNE2nskvZnYQdAcE"}}
                        defaultZoom={14}
                        defaultCenter={{
                            lat:driverCoords!.lat,
                            lng:driverCoords!.lng
                        }}
                    >
                        <div 
                        // @ts-ignore
                        lat={driverCoords!.lat} 
                        lng={driverCoords!.lng}
                        className="text-lg">
                        🏍
                        </div>
                        <div 
                        // @ts-ignore
                        lat={customerAddress.lat} 
                        lng={customerAddress.lng}
                        className="text-lg">
                        🏠                        
                        </div>
                        <div 
                        // @ts-ignore
                        lat={restaurantAddress.lat} 
                        lng={restaurantAddress.lng}
                        className="text-lg">
                            🍱      
                        </div>

                        </GoogleMapReact>
                    )}
                </div>
                <div className="grid grid-cols-2 border-2 border-gray-500">
                    <div className="grid col-span-1 border-r-2 border-gray-500 text-center px-4">
                            <div className="text-gray-400 text-xs mt-4">🍱출발</div>
                            <div className="mb-4">{data?.getOrder.order?.restaurant?.address} {data?.getOrder.order?.restaurant?.detailAddress}</div> 
                    </div>
                    <div className="col-span-1 text-center px-4">
                            <div className="text-gray-400 text-xs mt-4">🏠도착</div>
                            <div className="mb-4">{data?.getOrder.order?.customer?.address!} {data?.getOrder.order?.customer?.detailAddress}</div>
                    </div>
                </div> 
                <div className="p-4">
                    <div className="text-center">
                        <span className="">메뉴 </span>  
                        <span className="text-2xl text-lime-700">
                            {data?.getOrder.order?.items[0].dish.name}{data?.getOrder.order?.items.length!>1&&+"외"+data?.getOrder.order?.items.length!+"개"}
                        </span>
                    </div>
                    <div className="text-center">
                       총거리 <span className=" text-2xl text-lime-700">{distance}  </span>/   
                    예상시간 <span className="text-2xl text-lime-700">{duration}</span>
                   </div>
                </div>
                <div className="btn text-center" onClick={deliverySelect}>
                    Delivery Select
                </div>


                
            </div>
        </div>
    )
}