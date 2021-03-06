import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Restaurant } from "../../components/restaurant";
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { SortForm } from "../../components/sort";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;
interface IFormProps{
  searchTerm:string;
}

export const Restaurants=()=>{
  const [page,setPage]= useState(1);
    const{data,loading,error}=useQuery<
    restaurantsPageQuery,restaurantsPageQueryVariables
    >(RESTAURANTS_QUERY,{
        variables:{
            input:{
                page,
            }
        }
    });
    const onNextPageClick=()=> setPage(current =>current+1);
    const onPrevPageClick=()=> setPage(current=>current-1);
    const {register,handleSubmit,getValues} = useForm<IFormProps>();
    const history =useHistory();
    const onSearchSubmit=()=>{
      const {searchTerm} = getValues();
      history.push({
        pathname:"/search",
        state:{
          searchTerm
        }
        // search: `?term=${searchTerm}`
      })
    }
    return(
    <div>
      <Helmet>
        <title>Home |Sub's Eats</title>
      </Helmet>
        <form onSubmit={handleSubmit(onSearchSubmit)} 
        style={{backgroundImage:"url(https://ubernewsroomapi.10upcdn.com/wp-content/uploads/2019/01/Screen-Shot-2019-01-29-at-8.17.47-am-1080x540.png)"}}
        className="bg-gray-800 w-full py-40 flex items-center justify-center bg-no-repeat bg-cover">
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
            <div className="flex justify-around max-w-sm mx-auto">
                {data?.allCategories.categories?.map(category=>(
                  <Link key={category.id} to={`/category/${category.slug}`}>
                    <div
                      key={category.id}
                      className="flex flex-col group items-center cursor-pointer ml-3">
                          <div
                          className="w-16 h-16 bg-cover rounded-full group-hover:bg-gray-100" 
                          style={{backgroundImage:`url(${category.coverImg})`}}>
                          </div>
                          <span className="mt-1 text-sm text-center font-medium ">
                              {category.name}
                          </span>
                    </div>
                  </Link>
                ))}
          </div>
            <div className="mx-20 grid mt-16 md:grid-cols-4 gap-x-5 gap-y-10">
                {data?.restaurants.results?.map((restaurant)=>(
                  <Restaurant 
                  key={restaurant.id}
                  id={restaurant.id+""}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name+""}
                  categoryName={restaurant.category?.name}/>
                ))}
            </div>
            <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
              {page >1 ? (
                 <button 
                 onClick={onPrevPageClick}
                 className="focus:outline-none font-meduium text-2xl">
                   &larr;
                 </button>
              ) : (
              <div>

              </div>
              )}
              <span className="mx-5">
                Page {page} of{data?.restaurants.totalPages}
              </span>
              {page !==data?.restaurants.totalPages? (
                <button 
                onClick={onNextPageClick}
                className="focus:outline-none font-meduium text-2xl">
                  &rarr;
                </button>
              ) : (
                <div>

                </div>
              )           
              }
            </div>
      </div>
        )}
    </div>
    )}