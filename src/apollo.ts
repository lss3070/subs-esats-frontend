import { ApolloClient, createHttpLink, InMemoryCache, makeVar, split } from '@apollo/client';
import { LOCALSTORAGE_TOKEN } from './constants';
import {setContext} from "@apollo/client/link/context";
import {WebSocketLink} from "@apollo/client/link/ws";
import { getMainDefinition } from '@apollo/client/utilities';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);



const wsLink = new WebSocketLink({
  uri:process.env.NODE_ENV==="production"?"wss://subs-eats-backend.herokuapp.com/graphql": `ws://localhost:4000/graphql`,
  options:{
    reconnect:true,
    connectionParams:{
      "x-jwt":authToken() || "",
    }
  }
})
const httpLink = createHttpLink({
  uri:process.env.NODE_ENV==="production"?"https://subs-eats-backend.herokuapp.com/graphql":"http://localhost:4000/graphql"
});

const authLink= setContext((_, {headers})=>{
  return {
    headers:{
      ...headers,
      "x-jwt":authToken() || "",
    }
  }
})

const splitLink = split(
  ({query})=> {
    const definition = getMainDefinition(query);
    return(
      definition.kind ==='OperationDefinition' &&
      definition.operation ==='subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
      addTypename:true,
      typePolicies:{
          Query:{
              fields:{
                isLoggedIn:{
                      read(){
                        return isLoggedInVar();
                      }
                  },
                  token:{
                    read(){
                      return authToken();
                    }
                  }
              }
          }
      }
  })
});