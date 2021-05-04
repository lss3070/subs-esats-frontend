import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from 'react-hook-form';
import { FormError } from "../components/form-error";
import { LoginMutation, LoginMutationVariables } from '../__generated__/LoginMutation';

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
    const {register,getValues,watch,formState: { errors },handleSubmit}= useForm<ILoginForm>();
    const onCompleted=(data: LoginMutation)=>{
       const {login:{error,ok,token}}= data;
       if(ok){
           console.log(token);
       }
    }
    const [loginMutation,{data:loginMutationResult}] = useMutation<
    LoginMutation,
    LoginMutationVariables
    >(LOGIN_MUTATION,{
        onCompleted,
    });

    const onSubmit=()=>{

        loginMutation({
            variables:{
               loginInput:{
                   email,password
               }
            }
        });
    }
    return <div className="h-screen flex items-center justify-center bg-gray-800">
        <div className="bg-white w-full max-w-lg pt-5 pb-7 rounded-lg text-center">
            <h3 className="text-3xl text-gray-800">
                Log In
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col mt-5 px-5 grid gap-5">
                <input {...register("email",{
                    required:"Email Required",
                    pattern: /^[A-Za-z0-9._%+-]+@hanmail.net$/,
                })}
                required
                 type="email" 
                 placeholder="Email" 
                 className="input mb-3"/>

                 {errors.email && 
                (<FormError errorMessage={errors.email.toString()}/>
                )}

                <input {...register("password",{
                    required:"Password is required",
                    minLength:10
                })}
                 required
                 type="password"
                 placeholder="Password" 
                 className="input"/>

                {/* {errors.password && (
                    
                    <FormError errorMessage={errors.password.toString()}/>
                )} */}

                {errors.password?.type==="minLength" && (
                    <FormError errorMessage="Password must be more than 10 chars."/>
                )}
                <button className="mt-3 btn">
                {data?.login.error && <FormError errorMessage={data.login.error}/>}
                </button>
            </form>
        </div>
    </div>
}