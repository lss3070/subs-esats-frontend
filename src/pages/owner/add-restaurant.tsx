import React, { useState } from "react";
import { gql, useMutation, useApolloClient } from '@apollo/client';

import {createRestaurant,createRestaurantVariables} from "../../__generated__/createRestaurant"
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from 'react-router-dom';


const CREATE_ACCOUNT_MUTATION =gql`
    mutation createRestaurant($input:CreateRestaurantInput!){
        createRestaurant(input:$input){
            ok
            error
            restaurantId
        }
    }
`
interface IFormProps{
    name?: string;
    coverImg?:string;
    address:string;
    categoryName:string;
    file:FileList;
}


export const AddRestaurant =()=>{
    const client = useApolloClient();
    const [imageUrl,setImageUrl]= useState("");
    const history = useHistory();
    const onCompleted = (data:createRestaurant)=>{
        const{createRestaurant:{ok, restaurantId}}=data
        if(ok){
            const {name,categoryName,address}=getValues();
            setUploading(false);
            const queryResult = client.readQuery({query:MY_RESTAURANTS_QUERY});
            console.log(client.query.length);
            client.writeQuery({
                query:MY_RESTAURANTS_QUERY,
                data:{
                    myRestaurants:{
                        ...queryResult.myRestaurants,
                        restaurants:[
                            {
                                name,
                                address,
                                category:{
                                    name:categoryName,
                                    __typename:"Category",
                                },
                                coverImg:imageUrl,
                                id:restaurantId,
                                isPromoted:false,
                                __typename:"Restaurant",
                            },
                        ...queryResult.myRestaurants.restaurants]
                    },
                }
            })
            history.push('/');
        }
    }

    const [createRestaurantMutation,{loading,data}]= useMutation<
    createRestaurant,
    createRestaurantVariables
    >(CREATE_ACCOUNT_MUTATION,{
        onCompleted,
        // refetchQueries:[{query:MY_RESTAURANTS_QUERY}]
    })


    const {
        register,
        getValues,
        formState,
        handleSubmit
    } = useForm<IFormProps>({
        mode:"onChange"
    });
    const [uploading,setUploading] = useState(false);
    const onSubmit= async()=>{
        try{
            setUploading(true);
            const {file,name,categoryName,address}=getValues();
            const actualFile=file[0];
            const formbody = new FormData();
            formbody.append("file",actualFile);
            const {url:coverImg} = await(
                await fetch("http://localhost:4000/uploads",{
                method:"POST",
                body:formbody
            })
            ).json();
            setImageUrl(coverImg);
            createRestaurantMutation({
                variables:{
                    input:{
                        name:name+"",
                        categoryName,
                        address,
                        coverImg
                    }
                }
            })
            setUploading(false);
        }catch(error){

        }
    }
    const [optionsNumber, setOptionsNumber] = useState<number[]>([])
    const onAddDivisionOptionClick=()=>{

    }
    const onDelDivisionOptionClick=(id:number)=>{

    }
    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>AddRestaurant | Sub's Eats</title>
            </Helmet>
            <h1>AddRestaurant</h1>
            <form className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5" onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name",{
                    required:{
                        value:true,
                        message:"Name is required."
                    }
                })}
                className="input"
                type="text"
                placeholder="Name"
                />
                <input {...register("address",{
                    required:{
                        value:true,
                        message:"Address is required."
                    }
                })}
                className="input"
                type="text"
                placeholder="Address"
                />
                <input {...register("categoryName",{
                    required:{
                        value:true,
                        message:"Categories is requried."
                    }
                })}
                className="input"
                type="text"
                placeholder="Category Name"
                />
               <div className="my-10">
                    <h4 className="font-medium mb-3 text-lg">Division Options</h4>
                    <span
                    onClick={onAddDivisionOptionClick}
                    className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-">
                        Add Dish Option
                    </span>
                    {optionsNumber.length !== 0 &&
                          optionsNumber.map((id) => (
                        <div key={id} className="mt-5">
                            <input 
                            {...register(`${id}-optionName`,{

                            })}
                            className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2" 
                            type="text" 
                            placeholder="Option Name"
                            />
                            
                            <input 
                            {...register(`${id}-optionExtra`,{

                            })}
                            className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2" 
                            type="nubmer" 
                            min={0}
                            defaultValue={0}
                            placeholder="Option extra"
                            />
                            <span 
                            className="cursor-pointer 
                            bg-red-500 
                            ml-3 
                            text-white 
                            py-3 px-4 mt-5 bg-"
                            onClick={()=>onDelDivisionOptionClick(id)} role="button">Delete button</span>
                    </div>
                    ))}
                </div>


                <div>
                    <span>Banner Image</span>
                    <input type="file" accept="image/" {...register("file",{
                        required:{
                            value:true,
                            message:"!!"
                        }
                    })}/>
                </div>
               <Button
               loading={loading} 
               canClick={formState.isValid} 
               actionText="Create Restaurant"
               />
            </form>
            {data?.createRestaurant.error && <FormError errorMessage={data.createRestaurant.error}/>}
        </div>
    )
}