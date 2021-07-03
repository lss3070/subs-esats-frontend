import { gql, useQuery, useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { LoggedOutRouter } from '../routers/logged-out-router';
import { LoggedInRouter} from '../routers/logged-in-router';
import { isLoggedInVar } from '../apollo';
import { CartContextProvider } from '../context/CartsContext';



export const App=()=> {


  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn? (
    <CartContextProvider >
      <LoggedInRouter/>
    </CartContextProvider>
  
  )
  :(<LoggedOutRouter/>)
}