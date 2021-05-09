


import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useHistory } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';

interface ILocation{
        searchTerm:string;
    
}

const SEARCH_RESTAURANT= gql`
query searchRestaurant($input:SearchRestaurantInput!){
    searchRestaurant(input:$input){
        ok
        error
        totalPages
        totalResults
        restaurants {
            ...RestaurantParts
        }
    }
}
${RESTAURANT_FRAGMENT}
`

export const Search = ()=>{
    const location = useLocation<ILocation>();
    const history = useHistory();
    const [callQuery,{loading,data,called}]=useLazyQuery<
    searchRestaurant,searchRestaurantVariables
    >(SEARCH_RESTAURANT);
    useEffect(()=>{
        const query = location.state.searchTerm;
        if(!query){
          return history.replace("/")
        }
        console.log(query);
        callQuery({
            variables:{
                input:{
                    page: 1,
                    query,
                }
            }
        });
    },[history, location])

    console.log(history,location);
    console.log(loading,data,called);
    return(
        <h1>
            <Helmet>
                <title>Search | Sub's Eats</title>
            </Helmet>
            Search page
        </h1>
    )
}
