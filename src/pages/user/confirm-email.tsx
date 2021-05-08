import React, { useEffect } from "react";
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { verifyEmail, verifyEmailVariables } from '../../__generated__/verifyEmail';
import { useMe } from "../../hooks/useMe";
import { useHistory } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

const VERIFY_EMAIL_MUTATION=gql`
    mutation verifyEmail($input: VerifyEmailInput!){
        verifyEmail(input:$input){
            ok
            error
        }
    }
`

export const ConfirmEmail =()=>{
    const {data:userData,refetch,}= useMe();
    const client = useApolloClient();
    const history = useHistory();
    const onCompleted=async (data:verifyEmail)=>{
        const {
            verifyEmail:{ok},
        }= data;
        if(ok && userData?.me.id){
            await refetch()
            //refetch 대용 backend의 부하가 많을경우 밑에걸로 적용

            // client.writeFragment({
            //     id:`User:${userData?.me.id.toString()}`,
            //     fragment:gql`
            //     fragment VerifiedUser on  User{
            //         verified
            //     }
            //     `,
            //     data:{
            //         verified:true,
            //     }
            // });
            history.push("/")
        }
    }
const [verifyEmail]=useMutation<
    verifyEmail,
    verifyEmailVariables>(VERIFY_EMAIL_MUTATION,
        {
        onCompleted
        }
    );
    useEffect(()=>{
       
       const [_,code]= window.location.href.split("code=");
       console.log(window.location.href);

       verifyEmail({
           variables:{
               input:{
                   code
               }
           }
       })
    },[verifyEmail])
    return (
    <div className="mt-52 flex flex-col items-center">
        <Helmet>
            <title>Verrify Email| Sub's Eats</title>
        </Helmet>
        <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
        <h4 className="text-gray-700 text-sm">Please wait, don't close this page...</h4>
    </div>
    );
}