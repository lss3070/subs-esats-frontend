import React, { useState } from "react";
import { gql, useMutation } from '@apollo/client';

import {createRestaurant,createRestaurantVariables} from "../../__generated__/createRestaurant"
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";


const CREATE_ACCOUNT_MUTATION =gql`
    mutation createRestaurant($input:CreateRestaurantInput!){
        createRestaurant(input:$input){
            ok
            error
        }
    }
`
interface IFormProps{
    name?: string|undefined;
    coverImg?:string;
    address:string;
    categoryName:string;
    file:FileList;
}


export const AddRestaurant =()=>{
    const onCompleted = (data:createRestaurant)=>{
        const{createRestaurant:{ok, restauraantId}}=data
        if(ok){
            setUploading(false);
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
            
            createRestaurantMutation({
                variables:{
                    input:{
                        name,
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