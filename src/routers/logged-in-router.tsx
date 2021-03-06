import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { BrowserRouter as Router,Redirect,Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurant } from '../pages/owner/add-restaurant';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
import { Order } from '../pages/order';
import { DashBoard } from '../pages/driver/dashboard';
import { UserRole } from '../__generated__/globalTypes';
import { DriverOrders } from '../pages/driver/orders';
import { OwnerOrders } from '../pages/owner/orders';
import { OwnerIndex } from '../pages/owner/owner-index';
import { ClientOrders } from '../pages/client/orders';


const customeRoutes=[
    {
        path:'/',
        component:<Restaurants/>
    },
    {
        path:"/search",
        component:<Search/>
    },{
        path:"/category/:slug",
        component:<Category/>
    },{
        path:"/restaurants/:id",
        component:<Restaurant/>
    }
];

const clientRoutes=[
    {
        path:"/coverage",
        component:<Restaurants/>
    },
    {
        path:"/",
        component:<Restaurants/>
    },
    {
        path:"/search",
        component:<Search/>
    },{
        path:"/category/:slug",
        component:<Category/>
    },{
        path:"/restaurants/:id",
        component:<Restaurant/>
    },{
        path:"/orders",
        component:<ClientOrders/>
    },
]
const commonRoutes = [
    {
        path: "/confirm",
        component: <ConfirmEmail/>
    }, 
    {
        path: "/edit-profile",
        component: <EditProfile/>
    },
    {
        path:"/orders/:id",
        component:<Order/>
    }
];

const driverRoutes =[
    {path:"/",component:<DriverOrders/>},
    {path:"/orders/:type",component:<DriverOrders/>},
    {path:"/dashBoard",component:<DashBoard/>}
]

const ownerRoutes  =[
    {path:"/orders",component:<OwnerOrders/>},
    {path:"/order/:id",component:<Order/>},
    {path:"/orders/:type",component:<OwnerOrders/>},
    {path:"/add-restaurant",component:<AddRestaurant/>},
    {path:"/",component:<MyRestaurants/>},
    {path:"/restaurants/:id",
    component:<MyRestaurant/>},
    {path:"/restaurants/:restaurantId/add-dish", component:<AddDish/>}
]

export const LoggedInRouter=()=> 
{
    const {data,loading,error}=useMe(); 
    if(!data || loading || error){
        return (
        <div className="h-screen flex justify-center items-center">
            <span className="font-medium text-xl tracking-wide">Loading...</span>
        </div>
        );
    }
   return (
       <Router>
           <Header/>
           <Switch>
               {data.me.role===UserRole.Customer && customeRoutes.map(route=>
                <Route exact key={route.path} path={route.path}>
                    {route.component}
                </Route>
                )}
                {data.me.role===UserRole.Client && clientRoutes.map(route=>
                <Route exact key={route.path} path={route.path}>
                    {route.component}
                </Route>
                )}
                {data.me.role===UserRole.Owner && ownerRoutes.map((route)=>
                    <Route exact key={route.path} path={route.path}>
                        {route.component}
                    </Route>
                )}
                {data.me.role===UserRole.Delivery && driverRoutes.map((route)=>
                    <Route exact key={route.path} path={route.path}>
                        {route.component}
                    </Route>
                )}
                {commonRoutes.map((route)=>(
                    <Route key={route.path} path={route.path}>
                        {route.component}
                    </Route>
                ))};
                <Route>
                    <NotFound/>
                </Route>
           </Switch>
       </Router>

    );
}