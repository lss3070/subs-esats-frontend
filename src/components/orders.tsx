
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Order } from './order';
import { USER_FRAGMENT } from "../fragments";
import { OrderStatus } from "../__generated__/globalTypes";
import { ordersQuery, ordersQueryVariables } from '../__generated__/ordersQuery';
import GoogleMapReact from 'google-map-react';

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


export const Orders=()=>{
    const [status,setStatus]= useState(OrderStatus.Pending)
    const{data,loading,error}=useQuery<
    ordersQuery,ordersQueryVariables
    >(ORDERS_QUERY,{
        variables:{
            input:{
                status,
            }
        }
    });


    console.log(data?.getOrders.ok&&data.getOrders.orders);
    return(

        <div>
        <Helmet>
          <title>Home |Sub's Eats</title>
        </Helmet>
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