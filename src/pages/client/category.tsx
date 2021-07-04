

import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from '../../__generated__/category';
import { restaurant } from '../../__generated__/restaurant';
import { NotMatch } from "../notmatch";


const CATEGORY_QUERY = gql`
query category($input:CategoryInput!){
  allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
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
interface ILocation{
  searchTerm:string;

}


export const Category =()=>{


  const {register,handleSubmit,getValues} = useForm<ILocation>();
    const params = useParams<ICategoryParams>();
    const history = useHistory();
    const {data,loading} =useQuery<category,categoryVariables>
    (CATEGORY_QUERY,{
        variables:{
            input:{
                page:1,
                slug:params.slug
            }
        }
    });
    const onSearchSubmit=()=>{
      const {searchTerm} = getValues();
      history.push({
        pathname:"/search",
        state:{
          searchTerm
        }
      })
    }
    // const [page,setPage]= useState(1);
    // const onNextPageClick=()=> setPage(current =>current+1);
    // const onPrevPageClick=()=> setPage(current=>current-1);

    return(
     
        <div>
          {data?.category.restaurants&& data?.category.restaurants?.length===0?
          (<NotMatch matchName={params.slug}/>):
          (
            <div>
        <Helmet>
          <title>Category |Sub's Eats</title>
        </Helmet>
        <form onSubmit={handleSubmit(onSearchSubmit)} 
        style={{backgroundImage:"url(https://ubernewsroomapi.10upcdn.com/wp-content/uploads/2019/01/Screen-Shot-2019-01-29-at-8.17.47-am-1080x540.png)"}}
        className="bg-gray-800 w-full py-40 flex items-center justify-center bg-cover">
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
          <div className="mx-20 max-w-screen-2xl pb-20 mt-8">
              <div className="flex justify-around max-w-sm mx-auto">
                {data?.allCategories.categories?.map(category=>{
                  if(category.slug===params.slug){
                    return(
                      <Link key={category.id} to={`/category/${category.slug}`}>
                        <div
                          key={category.id}
                          className="flex flex-col group items-center cursor-pointer ml-3">
                              <div
                              className="w-16 h-16 bg-cover rounded-full border-4 border-lime-500 group-hover:bg-gray-100" 
                              style={{backgroundImage:`url(${category.coverImg})`}}>
                              </div>
                              <span className="mt-1 text-sm text-center font-medium ">
                                  {category.name}
                              </span>
                        </div>
                      </Link>
                    )
                  }else{
                    return(
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
                    )
                  }
                  }
                )}
          </div>
          
              <div className="grid mt-16 md:grid-cols-4  gap-x-5 gap-y-10">
                  {data?.category.restaurants?.map((restaurant)=>(
                    <Restaurant 
                    key={restaurant.id}
                    id={restaurant.id+""}
                    coverImg={restaurant.coverImg}
                    name={restaurant.name+""}
                    categoryName={restaurant.category?.name}/>
                  ))}
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
          )}

      </div>
    )
}