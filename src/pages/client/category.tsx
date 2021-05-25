

import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from '../../__generated__/category';


const CATEGORY_QUERY = gql`
query category($input:CategoryInput!){
        category(input:$input){
            ok
            error
            totalPages
            totalResults
            restaurants {
                ...RestaurantParts
            }
            category {
                ...CategoryParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams{
    slug:string
}

export const Category =()=>{
    const params = useParams<ICategoryParams>();
    const {data,loading} =useQuery<category,categoryVariables>
    (CATEGORY_QUERY,{
        variables:{
            input:{
                page:1,
                slug:params.slug
            }
        }
    });
    // const [page,setPage]= useState(1);
    // const onNextPageClick=()=> setPage(current =>current+1);
    // const onPrevPageClick=()=> setPage(current=>current-1);

    return(
        <div>
        <Helmet>
          <title>Category |Sub's Eats</title>
        </Helmet>
          {!loading && (
          <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
              <div className="grid mt-16 md:grid-cols-3  gap-x-5 gap-y-10">
                  {data?.category.restaurants?.map((restaurant)=>(
                    <Restaurant 
                    key={restaurant.id}
                    id={restaurant.id+""}
                    coverImg={restaurant.coverImg}
                    name={restaurant.name+""}
                    categoryName={restaurant.category?.name}/>
                  ))}
              </div>
              <div>
                  <span>Show more...</span>
              </div>
              {/* <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
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
                  Page {page} of{data?.category.restaurants?.totalPages}
                </span>
                {page !==data?.category.restaurants?.totalPages? (
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
              </div> */}
        </div>
          )}
      </div>
    )
}