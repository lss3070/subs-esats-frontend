


import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation, useHistory } from 'react-router-dom';
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';
import { restaurant } from '../../__generated__/restaurant';
import { NotMatch } from "../notmatch";

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
    const {register,handleSubmit,getValues} = useForm<ILocation>();

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
    },[history, location]);

    const onSearchSubmit=()=>{
        const {searchTerm} = getValues();
        history.push({
          pathname:"/search",
          state:{
            searchTerm
          }
        })
      }
      
    return(
        <div>
          {data?.searchRestaurant?.restaurants&&
          data?.searchRestaurant?.restaurants?.length===0?(
          <div>
            <NotMatch matchName={location.state.searchTerm}/>
          </div>):
          (<div>
          <Helmet>
          <title>Category |Sub's Eats</title>
        </Helmet>
        <form onSubmit={handleSubmit(onSearchSubmit)} 
        className="bg-gray-800 w-full py-40 flex items-center justify-center">
            <input 
            {...register("searchTerm",
            {
              required:{
              value:true,
              message:""
              },
              min:{
                value:6,
                message:""
              }
          }
          )}
            type="Search"
             className="input rounded-md border-0 w-3/4 md:w-3/12" 
             placeholder="Search Restaurants..."/>
        </form>
          {!loading && (
          <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
              <div className="grid mt-16 md:grid-cols-3  gap-x-5 gap-y-10">
                  {data?.searchRestaurant.restaurants?.map((restaurant)=>(
                    <Restaurant 
                    key={restaurant.id}
                    id={restaurant.id+""}
                    coverImg={restaurant.coverImg}
                    name={restaurant.name+""}
                    categoryName={restaurant.category?.name}/>
                  ))}
              </div>
        </div>
          )}
          </div>)}

      </div>
    )
}
