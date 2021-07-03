
import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
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
import { ownerMultipleOrdersQuery, ownerMultipleOrdersQueryVariables } from '../../__generated__/ownerMultipleOrdersQuery';


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

    const{data,loading,error}=useQuery<
    ownerMultipleOrdersQuery,ownerMultipleOrdersQueryVariables
    >(OWNER_MULTIPLE_ORDERS_QUERY,{
        variables:{
            input:{
                status,
            }
        }
    });
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
    return(

        <div>
        <Helmet>
          <title>Orders |Sub's Eats</title>
        </Helmet>
        <OrderNavi/>
        <div>
        </div>
        <div className="max-w-screen-2xl pb-20 mx-auto mt-16">
            {data?.getMultipleOrders.ok&&data.getMultipleOrders.orders?.map((order)=>{
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
                        />
                    )
                    })
            }
        </div>
        </div>
    );
}