import React, { useState } from "react";
import { gql, useMutation, useApolloClient, useQuery } from '@apollo/client';

import {createRestaurant,createRestaurantVariables} from "../../__generated__/createRestaurant"
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from 'react-router-dom';
import { AddressSearch } from "../../components/addressSearch";
import { Modal } from "../modal";
import { allCategory } from "../../__generated__/allCategory";
import { Autocomplete, AutocompleteProps } from '@material-ui/lab'
import {TextField} from '@material-ui/core'

const CREATE_ACCOUNT_MUTATION =gql`
    mutation createRestaurant($input:CreateRestaurantInput!){
        createRestaurant(input:$input){
            ok
            error
            restaurantId
        }
    }
`
const ALL_CATEGORY_QUERY = gql`
    query allCategory{
        allCategories{
            ok
            error
            categories{
                id
                slug
                name
            }
        }
    }
`
interface IFormProps{
    name: string;
    coverImg:string;
    address:string;
    detailAddress:string;
    categoryName:string;
    // file:FileList;
    file:string;
    [key: string]: string;
}

interface IAutoCompleteProps{
    id:number;
    slug:string;
}

export const AddRestaurant =()=>{
    const client = useApolloClient();
    const [imageUrl,setImageUrl]= useState("");
    const history = useHistory();
    const [addressOpen,setAddressOpen]= useState(false);

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
        handleSubmit,
        setValue
    } = useForm<IFormProps>({
        mode:"onChange"
    });
    const [uploading,setUploading] = useState(false);
    const [zipCode, setZipCode] = useState<string>();
    const [address, setAddress] = useState("");

    const categories = useQuery<allCategory>(ALL_CATEGORY_QUERY);


    const onSubmit= async()=>{
        try{
            setUploading(true);
            const {file,name,categoryName,detailAddress,description,...rest}=getValues();

            const divisionsObjects= divisionsNumber.map((theId)=>({
                name: rest[`${theId}-menuDivision`],
            }))

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
                        coverImg,
                        detailAddress,
                        zipCode:+zipCode!,
                        description,
                        divisions:divisionsObjects
                    }
                }
            })
            setUploading(false);
        }catch(error){
            console.log(error)
        }
    }


    const openAddress = ()=>{
       
        setAddressOpen(true);
    }
    const closeAddress=()=>{
        setAddressOpen(false);
    }
    const addAddress =(zipCode:string,address:string)=>{
        setZipCode(zipCode);
        setAddress(address);
    }


    const [divisionsNumber, setDivisionsNumber] = useState<number[]>([])
    const onAddDivisionOptionClick=()=>{
        setDivisionsNumber((current)=> [Date.now(), ...current]);
    }
    const onDelDivisionOptionClick=(idToDelete:number)=>{

        setDivisionsNumber(current=>current.filter((id)=>id!==idToDelete));
        //
        setValue(`${idToDelete}-menuDivision`,"")
    }
    const renderInput=(params: IAutoCompleteProps)=>{

    }
console.log(formState.errors.detailAddress)
    return (
        <div className="container flex flex-col items-center mt-20">
            <Helmet>
                <title>AddRestaurant | Sub's Eats</title>
            </Helmet>
            <h1 className="text-2xl font-semibold">AddRestaurant</h1>
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
               <div className="w-full">
               <input {...register("zipCode")}
                    className="input w-3/4"
                    type="text"
                    placeholder="ZipCode"
                    defaultValue={zipCode}
                    />
                <input {...register("address")}
                    className="input w-3/4"
                    type="text"
                    placeholder="Address"
                    defaultValue={address}
                    />
                    <span onClick={openAddress} className="btn cursor-pointer w-1/4">Search</span>

                    {addressOpen&&(
                        <Modal><AddressSearch onclose={closeAddress} addAddress={addAddress}/></Modal>
                    )}
               </div>
                
                <input {...register("detailAddress",{
                    required:{
                        value:true,
                        message:"Address is required."
                    }
                })}
                className="input"
                type="text"
                placeholder="DetailAddress"
                />
                {
                    categories.data?.allCategories.ok&&
                    <Autocomplete 
                    options={categories.data?.allCategories.categories!}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params)=>
                        <TextField {...register("categoryName",{
                            required:{
                                value:true,
                                message:"Categories is requried."
                            }
                        })}
                        label="Category Name"
                        {...params} variant="outlined"></TextField>
                    }/>
                }
                <input {...register("description")}
                className="input"
                type="text"
                placeholder="description"
                /> 
               <div className="my-10">
                    <h4 className="font-medium mb-3 text-lg">Menu Division Options</h4>
                    <span
                    onClick={onAddDivisionOptionClick}
                    className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-">
                        Add Menu Division Options
                    </span>
                    {divisionsNumber.length !== 0 &&
                          divisionsNumber.map((id) => (
                        <div key={id} className="mt-5">
                             <input 
                             className="input"
                            {...register(`${id}-menuDivision`,{
                            })}/>
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
                            message:"image is required!"
                        }
                    })}/>
                </div>
               <Button
               loading={loading} 
               canClick={true}
               actionText="Create Restaurant"
               />
            </form>
            {data?.createRestaurant.error && <FormError errorMessage={data.createRestaurant.error}/>}
        </div>
    )
}