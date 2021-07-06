
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
import { multipleOrdersQuery, multipleOrdersQueryVariables } from "../../__generated__/multipleOrdersQuery";
import { useMe } from "../../hooks/useMe";
import { OwnerOrder } from "../../components/ownerOrder";
import { ownerMultipleOrdersQuery, ownerMultipleOrdersQueryVariables, ownerMultipleOrdersQuery_getMultipleOrders_orders } from '../../__generated__/ownerMultipleOrdersQuery';


const OWNER_MULTIPLE_ORDERS_QUERY = gql`

query ownerMultipleOrdersQuery($input: GetMultipleOrdersInput!) {

getMultipleOrders(input: $input) {
  ok
  error
  orders {
    id
    items{       
            dish{
                name
            }
            id
            count
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

export const OwnerOrders=()=>{
    
    const {type} =useParams<IParams>();
    const {data:userData}=useMe();
   
    const [status,setStatus]= useState<OrderStatus[]>();
    const length = useRef(1);
    const [renderTransaction, setRenderedTransaction] = useState<ownerMultipleOrdersQuery_getMultipleOrders_orders[]>()
    const target=useRef<HTMLDivElement>(null);
    

    const{data,loading,error}=useQuery<
    ownerMultipleOrdersQuery,ownerMultipleOrdersQueryVariables
    >(OWNER_MULTIPLE_ORDERS_QUERY,{
        variables:{
            input:{
                status,
            }
        }
    });
    const maxLength = data?.getMultipleOrders.orders?.length

    useEffect(()=>{
        switch(type){
            case OrderNaviProps.Pending:
                setStatus([OrderStatus.Pending]);
                break;
            case OrderNaviProps.Progress:
                setStatus([OrderStatus.Cooking,OrderStatus.Cooked,OrderStatus.PickedUp]);
                break;
            case OrderNaviProps.Complete:
                setStatus([OrderStatus.Deliverd]);
                break;
        }
    },[type]);

    const changeExtraTransaction = () => {
        console.log("changeExtraTransaction")
        const newrenderedTransaction = renderTransaction!.concat(
          data?.getMultipleOrders.orders!?.slice(5 * length.current, 5 * length.current + 5),
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
            length.current=1;
            if(data?.getMultipleOrders.orders!?.length<5){
                setRenderedTransaction(data?.getMultipleOrders.orders!);
            }else{
                setRenderedTransaction(data.getMultipleOrders.orders?.slice(0,4))
            }
        }
    },[data?.getMultipleOrders])

    useEffect(()=>{
        let observer:IntersectionObserver;
        if(target.current){
            observer = new IntersectionObserver(onIntersect,{threshold: 0.5})
            observer.observe(target.current);
        }
        return()=> observer && observer.disconnect();
    },[data?.getMultipleOrders,renderTransaction])





    return(

        <div>
        <Helmet>
          <title>Orders |Sub's Eats</title>
        </Helmet>
        <OrderNavi/>
        <div>
        </div>
        <div className="max-w-screen-2xl pb-20 mx-auto mt-16">
            {renderTransaction?.map((order)=>{
                    return(
                        <OwnerOrder 
                        orderId={order.id}
                        restaurantName={order.restaurant?.name!}
                        total={order.total!}
                        items={order.items}
                        image={order.restaurant?.coverImg!}
                        customerAddress={order.customer?.address!}
                        customerDetailAddress={order.customer?.detailAddress!}
                        orderDate={order.createdAt}
                        status={order.status}
                        naviStatus={type}
                        refTarget={target}
                        />
                    )
                    })
            }
        </div>
        </div>
    );
}