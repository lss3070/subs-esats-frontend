
import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { USER_FRAGMENT } from "../../fragments";
import  {RouteComponentProps, useParams}  from 'react-router-dom';
import {  OrderNavi, OrderNaviProps } from "../../components/orderNavi";
import { useMe } from "../../hooks/useMe";
import { ClientOrder } from "../../components/clientOrder";
import { clientMultipleOrdersQuery, clientMultipleOrdersQueryVariables } from '../../__generated__/clientMultipleOrdersQuery';


const CLIENT_MULTIPLE_ORDERS_QUERY = gql`

query clientMultipleOrdersQuery($input: GetMultipleOrdersInput!) {

getMultipleOrders(input: $input) {
  ok
  error
  orders {
    id
    items{       
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

export const ClientOrders=()=>{
    const {type} =useParams<IParams>();
    const {data:userData}=useMe();
    console.log(type);

    const{data,loading,error}=useQuery<
    clientMultipleOrdersQuery,clientMultipleOrdersQueryVariables
    >(CLIENT_MULTIPLE_ORDERS_QUERY,{
        variables:{
            input:{
            }
        }
    });
    return(
        <div>
        <Helmet>
          <title>Orders |Sub's Eats</title>
        </Helmet>
        <div>
        </div>
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
            {data?.getMultipleOrders.ok&&data.getMultipleOrders.orders?.map((order)=>{
                    return(
                        <ClientOrder 
                        orderId={order.id}
                        restaurantName={order.restaurant?.name!}
                        restaurantId={order.restaurant?.id!}
                        total={order.total!}
                        items={order.items}
                        customerAddress={order.customer?.address!}
                        customerDetailAddress={order.customer?.detailAddress!}
                        orderDate={order.createdAt}
                        status={order.status}
                        deliveryTime={10}
                        naviStatus={type}
                        />
                    )
                    })
            }
        </div>
        </div>
    );
}