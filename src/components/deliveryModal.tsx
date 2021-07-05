import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useQuery, useSubscription } from '@apollo/client';
import { cookedOrders } from '../__generated__/cookedOrders';
import { COOKED_ORDERS_SUBSCRIPTION } from '../pages/driver/dashboard';
import { FULL_ORDER_FRAGMENT } from '../fragments';
import { getOrder, getOrderVariables } from '../__generated__/getOrder';
import { GET_ORDER } from '../pages/order';



interface DeliveryModalProps{
    orderId:number;
    customerAddress:PlaceInfo;
    restaurantAddress:PlaceInfo;
    duration:string;
    distance:string;
    onclose:()=>void;
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

export const DeliveryModal:React.FC<DeliveryModalProps>=({onclose,customerAddress,restaurantAddress,distance,duration,orderId})=>{

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

    
    const {data,subscribeToMore}=useQuery<getOrder,getOrderVariables>(
        GET_ORDER,
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
       console.log("makeRoute");
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
        console.log("~~~")
        if(driverCoords){
            console.log("!!!")
            makeRoute();
        }
    },[driverCoords]);

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
                <div className="grid grid-flow-col">
                    <div className="grid">
                        <h2>{data?.getOrder.order?.customer?.email}</h2>
                        <div>{data?.getOrder.order?.customer?.address!} {data?.getOrder.order?.customer?.detailAddress}</div>
                    </div>
                    <div>
                        <h2>{data?.getOrder.order?.restaurant?.name}</h2>
                        <div>{data?.getOrder.order?.restaurant?.address}</div>
                    </div>
                    
                </div> 
                <div>
                    <div>
                   {data?.getOrder.order?.items.map((item)=>
                       item.dish.name
                   )}
                   </div>
                   <div>{distance}/{duration}</div>
                </div>
                <div className="btn text-center">
                    Delivery Select
                </div>


                
            </div>
        </div>
    )
}