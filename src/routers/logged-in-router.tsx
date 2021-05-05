import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { isLoggedInVar } from '../apollo';
import {meQuery} from "../__generated__/meQuery"
import { BrowserRouter as Router,Redirect,Route, Switch } from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';


const ClientRoutes=[
    <Route path="/" exact>
        <Restaurants/>
    </Route>
]


const ME_QUERY = gql`
query meQuery{
    me{
        id
        email
        role
        verified
    }
}`

export const LoggedInRouter=()=> 
{
    const {data,loading,error}=useQuery<meQuery>(ME_QUERY);
    if(!data || loading || error){
        console.log("!!");
        return (
            <div className="h-screen flex justify-center items-center">
            <span className="font-medium text-xl tracking-wide">Loading...</span>
        </div>
        );
    }
    console.log(data.me.role);
   return (
       <Router>
           <Switch>
                {data.me.role==="Client" && ClientRoutes}
                <Redirect from="/potato" to="/"/>
           </Switch>
       </Router>

    );
}