import React from "react";
import { useForm } from 'react-hook-form';

interface ILoginForm{
    email?:string;
    password?:string;
}
export const Login=()=>{
    const {register,getValues,formState: { errors },handleSubmit}= useForm<ILoginForm>();
    const onSubmit=()=>{
        console.log(errors);
        console.log(getValues())
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
                    pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
                })}
                required
                 type="email" 
                 placeholder="Email" 
                 className="input mb-3"/>

                 {errors.email && 
                 <span className="font-medium text-red-500">email</span>}

                <input {...register("password",{
                    required:"Password is required",
                    minLength:10
                })}
                 required
                 type="password"
                 placeholder="Password" 
                 className="input"/>

                {errors.password && 
                 <span className="font-medium text-red-500">
                     Password must be more than 10 chars.
                </span>}

                <button className="mt-3 btn">
                    Log In
                </button>
            </form>
        </div>
    </div>
}