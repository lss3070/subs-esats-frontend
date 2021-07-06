
import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import { USER_FRAGMENT } from "../../fragments";
import  {RouteComponentProps, useParams}  from 'react-router-dom';
import {  OrderNavi, OrderNaviProps } from "../../components/orderNavi";
import { useMe } from "../../hooks/useMe";
import { ClientOrder } from "../../components/clientOrder";
import { clientMultipleOrdersQuery, clientMultipleOrdersQueryVariables, clientMultipleOrdersQuery_getMultipleOrders_orders } from '../../__generated__/clientMultipleOrdersQuery';


const CLIENT_MULTIPLE_ORDERS_QUERY = gql`

query clientMultipleOrdersQuery($input: GetMultipleOrdersInput!) {

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
    deliveryTime
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
    orders:clientMultipleOrdersQuery_getMultipleOrders_orders[];
}[]

export const ClientOrders=()=>{
    const {type} =useParams<IParams>();
    const {data:userData}=useMe();
    const length = useRef(1);
    const [renderTransaction, setRenderedTransaction] = useState<clientMultipleOrdersQuery_getMultipleOrders_orders[]>()
    const target=useRef<HTMLDivElement>(null);
    

    const{data,loading,error}=useQuery<
    clientMultipleOrdersQuery,clientMultipleOrdersQueryVariables
    >(CLIENT_MULTIPLE_ORDERS_QUERY,{
        variables:{
            input:{
            }
        }
    });

    const maxLength = data?.getMultipleOrders.orders?.length

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
        <div>
        </div>
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
            <h4 className="text-4xl ml-4 font-bold text-gray-600 mb-5">
                Orders List
            </h4>

            {renderTransaction?.map((order)=>{
                    return(
                        <ClientOrder 
                        orderId={order.id}
                        restaurantName={order.restaurant?.name!}
                        restaurantId={order.restaurant?.id!}
                        total={order.total!}
                        items={order.items}
                        coverImg = {order.restaurant?.coverImg!}
                        customerAddress={order.customer?.address!}
                        customerDetailAddress={order.customer?.detailAddress!}
                        orderDate={order.createdAt}
                        status={order.status}
                        deliveryTime={10}
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