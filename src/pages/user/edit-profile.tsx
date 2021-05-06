import React from "react";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { editProfile,editProfileVariables } from '../../__generated__/editProfile';
import { client } from '../../apollo';

const EDIT_PROFILE_MUTATION=gql`
mutation editProfile($input:EditProfileInput!){
    editProfile(input:$input){
        ok
        error
        
    }
}`

interface IFormProps{
    email?:string;
    password?:string;
}

export const EditProfile=()=>{
    const onCompleted=(data:editProfile)=>{
        const {editProfile:{error,ok}}=data;
        if(ok && userData){
            const {me:{email:prevEmail,id}}=userData;

            const {email:newEmail}=getValues();
            if(prevEmail!==newEmail){
                client.writeFragment({
                    id:`Ùser:${id}`,
                    fragment:gql`
                    fragment EditedUser on User{
                        verified
                        email
                    }
                    `,
                    data:{
                        email:newEmail,
                        verified:false,
                    },
                })
            }
            //update the cache
        }
    }
    const {data:userData}= useMe();
    const [editProfile,{loading}]=useMutation<
    editProfile,editProfileVariables>(EDIT_PROFILE_MUTATION,{
        onCompleted,
    })
    const {register,handleSubmit,getValues,formState}=useForm<IFormProps>({
        mode:"onChange",
        defaultValues:{
            email:userData?.me.email
        }
    })
    const onSubmit=()=>{
        const {email,password}=getValues();
        editProfile({
            variables:{
                input:{
                    email,
                    ...(password!==""&&{password}),
                }
            }
        })
    }
    return (

    <div className="mt-52 flex flex-col justify-center items-center">
        <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
        <form 
            onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
            <input {...register("email",{
                pattern: {
                    value: /^[A-Za-z0-9._%+-]+@hanmail.net$/,
                    message:"invalid email address"
                 },
            })}
             className="input" type="email" placeholder="Email" required/>
            <input {...register("password",{})}
             className="input" type="password" placeholder="Password"/>
            <Button loading={loading} canClick={!loading} actionText="Save Profile">Update Profile</Button>
        </form>
        </div>
        )
}