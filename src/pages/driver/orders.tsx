
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

import { USER_FRAGMENT } from "../../fragments";
import { OrderStatus } from "../../__generated__/globalTypes";
import { ordersQuery, ordersQueryVariables } from '../../__generated__/ordersQuery';
import GoogleMapReact from 'google-map-react';
import  {RouteComponentProps, useParams}  from 'react-router-dom';
import {  OrderNavi } from "../../components/orderNavi";
import { Order } from "../../components/order";
import useEffect from 'react';

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


interface IParams{
    type:OrderStatus;
}

export const Orders=()=>{
    
    const {type} =useParams<IParams>();
    const [status,setStatus]= useState(type);
    // const [status,setStatus]= useState(OrderStatus.Pending)
    const{data,loading,error}=useQuery<
    ordersQuery,ordersQueryVariables
    >(ORDERS_QUERY,{
        variables:{
            input:{
                status,
            }
        }
    });
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
            {data?.getOrders.ok&&data.getOrders.orders?.map((order)=>
                <Order 
                orderId={order.id}
                restaurantName={order.restaurant?.name!}
                restaurantImg={order.restaurant?.coverImg!}
                restaurantAddress={order.restaurant?.address!}
                customerAddress={order.customer?.address!}
                customerDetailAddress={order.customer?.detailAddress!}
                orderDate={order.createdAt}
                status={order.status}
                />
            )
            }

        </div>
        </div>
    );
}