import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import mainlogo from "../images/logo.svg"
import { UserRole } from "../__generated__/globalTypes";
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation';
import { Modal } from "./modal";
import { AddressSearch } from "../components/addressSearch";

 
const CREATE_ACCOUNT_MUTATION = gql`
mutation createAccountMutation($createAccountInput:CreateAccountInput!) {
    createAccount(input:$createAccountInput){
        ok
        error
    }
}
`
interface ICreateAccountForm{
email:string;
password:string;
role:UserRole;
zipCode:number;
name:string;
address:string;
detailAddress:string;

}
export const CreateAccount=()=>{
const {
    register,
    getValues,
    watch,
    formState: { errors,isValid },
    handleSubmit}= useForm<ICreateAccountForm>({
        mode:"onChange",
        defaultValues:{
            role:UserRole.Client
        }
    });

    const [zipCode, setZipCode] = useState<string>();
    const [address, setAddress] = useState("");
    const [addressOpen,setAddressOpen]= useState(false);
    

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

const history = useHistory()
const onCompleted =(data: createAccountMutation)=>{
    const {createAccount:{ok,error}}=data;
    if(ok){
        //redirect
        history.push("/")
    }
}


const [createAccountMutation,
    {loading, data:createAccountMutationResult}
] = useMutation<createAccountMutation,createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
        onCompleted,
    });

    const onSubmit=()=>{
        if(!loading){
            const {email,password,name,role,detailAddress}=getValues();
            
            createAccountMutation({
                variables:{
                    createAccountInput:{email,password,role,name,
                        zipCode:+zipCode!,
                        address:address,detailAddress}
                }
            })
        }
    }




return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
        <Helmet>
            <title>Create Account | Sub's Eats</title>
        </Helmet>
    <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
    <img src ={mainlogo} className="w-52 mb-10"/>
    <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get started</h4>
    <form 
    onSubmit={handleSubmit(onSubmit)} 
    className="grid gap-3 mt-5 px-5 w-full mb-3">
        <input {...register("email",{
            required:{
                value:true,
                message:"Email Required",
            },
            pattern: {
               value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
               message:"Please enter a valid email"
            },
        })}
        required
        type="email" 
        placeholder="Email" 
        className="input"
         />
         <input {...register("name",{
            required:{
                value:true,
                message:"name Required",
            },
        })}
        required
        type="name" 
        placeholder="Name" 
        className="input"
        />

         {errors.email && errors.email.type==="pattern" &&
        (<FormError errorMessage={errors.email.message}/>
        )}

        <input {...register("password",{
            required:{
                value:true,
                message:"Password is required"
            },
            // minLength:{
            //     value:10,
            //     message:"password minlenght"
            // }
        })}
         type="password"
         placeholder="Password" 
         className="input"/>

        {errors.password && errors.password.type==="pattern" &&(
            <FormError errorMessage={errors.password.message}/>
        )}

        {/* {errors.password?.type==="minLength" && (
            <FormError errorMessage="Password must be more than 10 chars."/>
        )} */}
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
                    <span onClick={openAddress} className="btn cursor-pointer w-full">Search</span>

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
        <select {...register("role",{
            required:{
                value:true,
                message:"not choice"
        },
         })}
     className="input">
            {Object.keys(UserRole).map((role,index) => (
                <option key={index}>{role}</option>
        ))}
        </select>
        <Button 
        canClick={isValid} 
        loading={loading} 
        actionText={"Create Account"}/>
        {createAccountMutationResult?.createAccount.error &&
        (
            <FormError errorMessage={createAccountMutationResult.createAccount.error}></FormError>
        )}
    </form>
    <div>
       Already have an account?{" "}
       <Link to="/" className="text-lime-600 hover:underline">
           Log in now
        </Link>
    </div>
    </div>
</div>
)

}