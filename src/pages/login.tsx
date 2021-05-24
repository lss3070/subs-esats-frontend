import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import {Helmet,HelmetProvider} from "react-helmet-async";
import { useForm, useFormState } from 'react-hook-form';
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import mainlogo from "../images/logo.svg"
import { loginMutation, loginMutationVariables } from "../__generated__/loginMutation";
import { authToken, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

const LOGIN_MUTATION = gql`
    mutation loginMutation($loginInput:LoginInput!) {
        login(input:$loginInput){
            ok
            token
            error
        }
    }
    `

interface ILoginForm{
    email:string;
    password:string;
}
export const Login=()=>{
    const {
        register,
        getValues,
        watch,
        formState: { errors,isValid },
        handleSubmit}= useForm<ILoginForm>({
            mode:"onChange"
        });
    const onCompleted=(data: loginMutation)=>{
       const {login:{error,ok,token}}= data;
       console.log(data);
       if(ok && token){
           localStorage.setItem(LOCALSTORAGE_TOKEN,token);
           authToken(token);
           isLoggedInVar(true);
       }else if(error){
           console.log(error);
        }
    }
    const [loginMutation,{data:loginMutationResult, loading}] = useMutation<
    loginMutation,
    loginMutationVariables
    >(LOGIN_MUTATION,{
        onCompleted,
    });

    const onSubmit=()=>{
        if(!loading){
            const {email,password}=getValues();
            loginMutation({
                variables:{
                   loginInput:{
                       email,
                       password
                   }
                }
            });
        }

    }
    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Login | Sub's Eats</title>
            </Helmet>
        <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src ={mainlogo} className="w-52 mb-10"/>
        <h4 className="w-full font-medium text-left text-3xl mb-5">Welcome back</h4>
        <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="grid gap-3 mt-5 px-5 w-full mb-3">
            <input {...register("email",{
                required:{
                    value:true,
                    message:"Email Required",
                },
                pattern: {
                   value: /^[A-Za-z0-9._%+-]+@hanmail.net$/,
                   message:"invalid email address"
                },
            })}
            required
            type="email" 
            placeholder="Email" 
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
            <Button 
            canClick={isValid} 
            loading={loading} 
            actionText={"Log In"}>
            </Button>
            {
                loginMutationResult?.login.error && 
                (
                    <FormError errorMessage={loginMutationResult.login.error}></FormError>
                )
            }
        </form>
        <div>
           New to Uber Eats?
           <Link to="/create-account" className="text-lime-600 hover:underline">Create an Account</Link>
        </div>
        </div>
    </div>
    )

}