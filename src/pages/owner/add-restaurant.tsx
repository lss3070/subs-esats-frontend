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
    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>AddRestaurant | Sub's Eats</title>
            </Helmet>
            <h1>AddRestaurant</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <div>
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