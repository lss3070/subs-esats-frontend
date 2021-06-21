
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

export const DriverOrders=()=>{
    
    const {type} =useParams<IParams>();
    const {data:userData}=useMe();
    console.log(type);
    const [status,setStatus]= useState<OrderStatus[]>();
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

    const{data,loading,error}=useQuery<
    multipleOrdersQuery,multipleOrdersQueryVariables
    >(MULTIPLE_ORDERS_QUERY,{
        variables:{
            input:{
                status,
            }
        }
    });
    useEffect(()=>{
        switch(type){
            case OrderNaviProps.Pending:
                console.log("!!");
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
    },[]);
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
            {data?.getMultipleOrders.ok&&data.getMultipleOrders.orders?.map((order)=>{
                console.log(order);
                console.log(userData?.me.id);
                if(type===OrderNaviProps.Pending&&order.driver===null){
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
                        />
                    )
                }else if((type===OrderNaviProps.Progress||type===OrderNaviProps.Complete)&&
                     order.driver?.id===userData?.me.id){
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
                    />
                )
                }
            }   
            )
            }

        </div>
        </div>
    );
}