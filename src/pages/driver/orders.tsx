
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Order } from '../../components/order';
import { FULL_ORDER_FRAGMENT, RESTAURANT_FRAGMENT, USER_FRAGMENT } from "../../fragments";
import { OrderStatus } from "../../__generated__/globalTypes";
import { ordersQuery, ordersQueryVariables } from '../../__generated__/ordersQuery';


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
    const [status,setStatus]= useState(OrderStatus.Cooking)
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
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
            {data?.getOrders.ok&&data.getOrders.orders?.map((order)=>
                <Order 
                orderId={order.id}
                restaurantName={order.restaurant?.name!}
                restaurantImg={order.restaurant?.coverImg!}
                restaurantZipCode={order.restaurant?.zipCode!}
                customerZipCode={order.customer?.zipCode!}
                customerAddress={order.customer?.address!+order.customer?.detailAddress}
                />
            )
            }

        </div>
        </div>
    );
}