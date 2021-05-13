
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurant, myRestaurantVariables } from '../../__generated__/myRestaurant';

const MY_RESTAURANT_QUERY = gql`
query myRestaurant($input:MyRestaurantInput!){
    myRestaurant(input:$input){
        ok
        error
        restaurant{
            ...RestaurantParts
        }
    }
}
${RESTAURANT_FRAGMENT}
`

interface IParams{
    id:string;
}

export const MyRestaurant = ()=>{
    const params =useParams<IParams>();
    const {data} =useQuery<myRestaurant,myRestaurantVariables>(MY_RESTAURANT_QUERY);
    console.log(params);
    return(
        <h1>My restaurant</h1>
    )
}