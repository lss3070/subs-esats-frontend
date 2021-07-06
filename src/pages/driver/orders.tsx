
import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import { USER_FRAGMENT } from "../../fragments";
import { OrderStatus } from "../../__generated__/globalTypes";
import { ordersQuery, ordersQueryVariables } from '../../__generated__/ordersQuery';
import GoogleMapReact from 'google-map-react';
import  {RouteComponentProps, useParams}  from 'react-router-dom';
import {  OrderNavi, OrderNaviProps } from "../../components/orderNavi";
import { DeliveryOrder } from "../../components/deliveryOrder";
import { multipleOrdersQuery, multipleOrdersQueryVariables, multipleOrdersQuery_getMultipleOrders_orders } from "../../__generated__/multipleOrdersQuery";
import { useMe } from "../../hooks/useMe";

const ORDERS_QUERY = gql`
  query ordersQuery($input: GetOrdersInput!) {

    getOrders(input: $input) {
      ok
      error
      orders {
        id
        items{       
                id
                count
                dish{
                    name
                }
                options{
                    name
                    choice
                }
        }
        total
        status
        createdAt
        customer{
            ...UserParts
        }
        restaurant{
            id
            name
            coverImg
            category{
                name
            }
            zipCode
            address
            isPromoted
            divisions{
                name
            }
        }
      }
    }
  }
  ${USER_FRAGMENT}
`;

const MULTIPLE_ORDERS_QUERY = gql`

query multipleOrdersQuery($input: GetMultipleOrdersInput!) {

getMultipleOrders(input: $input) {
  ok
  error
  orders {
    id
    items{       
            id
            count
            dish{
                name
            }
            options{
                name
                choice
            }
    }
    total
    status
    createdAt
    customer{
        ...UserParts
    }
    driver{
        id
    }
    restaurant{
        id
        name
        coverImg
        category{
            name
        }
        zipCode
        address
        isPromoted
        divisions{
            name
        }
    }
  }
}
}
${USER_FRAGMENT}
`


interface IParams{
    type:OrderNaviProps;
}
type renderedTranscation={
    index:number;
    orders:multipleOrdersQuery_getMultipleOrders_orders[];
}[]

export const DriverOrders=()=>{
    
    const {type} =useParams<IParams>();
    const {data:userData}=useMe();
    const [status,setStatus]= useState<OrderStatus[]>();
    const length = useRef(1);
    const [renderTransaction, setRenderedTransaction] = useState<multipleOrdersQuery_getMultipleOrders_orders[]>()
    const [fakeItem,setFakeItem]=useState<multipleOrdersQuery_getMultipleOrders_orders[]>();
    const target=useRef<HTMLDivElement>(null);
    

    // const [status,setStatus]= useState(OrderStatus.Pending)
    // const{data,loading,error}=useQuery<
    // ordersQuery,ordersQueryVariables
    // >(ORDERS_QUERY,{
    //     variables:{
    //         input:{
    //             status,
    //         }
    //     }
    // });

        const onCompleted=(data: multipleOrdersQuery)=>{

        }
    const{data,loading,error}=useQuery<
    multipleOrdersQuery,multipleOrdersQueryVariables
    >(MULTIPLE_ORDERS_QUERY,{
        variables:{
            input:{
                status,
            }
        }
    });

    const maxLength = fakeItem?.length

    const changeExtraTransaction = () => {
        console.log("changeExtraTransaction")
        const newrenderedTransaction = renderTransaction!.concat(
            fakeItem!?.slice(5 * length.current, 5 * length.current + 5),
        );
        length.current += 1;
        setRenderedTransaction(newrenderedTransaction);
      };
    
      const onIntersect: IntersectionObserverCallback = (entries, observer) => {
          console.log("onIntersect")
        entries.forEach((entry) => {
          if (entry.isIntersecting && length.current < maxLength!) {
            observer.unobserve(entry.target);
            changeExtraTransaction();
          }
        });
      };

    useEffect(()=>{
        if(data?.getMultipleOrders.ok){
            
            if(type===OrderNaviProps.Pending){
               setFakeItem(data.getMultipleOrders.orders!.filter((item)=>item.driver===null));
            }else if(type===OrderNaviProps.Progress||type===OrderNaviProps.Complete){
                setFakeItem(data.getMultipleOrders.orders!.filter((item)=>item.driver?.id===userData?.me.id));
            }
           
        }
    },[data?.getMultipleOrders])
    useEffect(()=>{
        if(fakeItem!==undefined){
            length.current=1;
            if(fakeItem!.length<5){
                setRenderedTransaction(fakeItem!);
            }else{
                setRenderedTransaction(fakeItem?.slice(0,4))
            }
        }
       
    },[fakeItem])

    useEffect(()=>{
        console.log("!useeffect2")
        let observer:IntersectionObserver;
        if(target.current){
            observer = new IntersectionObserver(onIntersect,{threshold: 0.5})
            observer.observe(target.current);
        }
        return()=> observer && observer.disconnect();
    },[fakeItem,renderTransaction])


    useEffect(()=>{
        switch(type){
            case OrderNaviProps.Pending:
                setStatus([OrderStatus.Cooked,
                    OrderStatus.Cooking,OrderStatus.Pending]);
                break;
            case OrderNaviProps.Progress:
                setStatus([OrderStatus.Cooked,OrderStatus.Cooking,OrderStatus.Pending,OrderStatus.PickedUp]);
                break;
            case OrderNaviProps.Complete:
                setStatus([OrderStatus.Deliverd]);
                break;
        }
    },[type]);
    return(
        <div>
        <Helmet>
          <title>Orders |Sub's Eats</title>
        </Helmet>
        <OrderNavi/>
        <div>
        <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals
            bootstrapURLKeys={{key:"AIzaSyBTrXLEW2gzwzHw7e6HNE2nskvZnYQdAcE"}}
            defaultZoom={16}
            defaultCenter={{
                lat:36.58,
                lng:125.95
            }}
        >
        </GoogleMapReact>
        </div>
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
            {renderTransaction?.map((order)=>{
                
                    return(
                        <DeliveryOrder 
                        orderId={order.id}
                        restaurantName={order.restaurant?.name!}
                        restaurantImg={order.restaurant?.coverImg!}
                        restaurantAddress={order.restaurant?.address!}
                        customerAddress={order.customer?.address!}
                        customerDetailAddress={order.customer?.detailAddress!}
                        orderDate={order.createdAt}
                        status={order.status}
                        naviStatus={type}
                        refTarget={target}
                        />
                    )
                }
            )
            }

        </div>
        </div>
    );
}