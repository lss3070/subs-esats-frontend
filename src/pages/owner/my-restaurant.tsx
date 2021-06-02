
import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useParams, useHistory } from 'react-router-dom';
import { Dish } from "../../components/dish";
import {
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryPie,
    VictoryVoronoiContainer,
    VictoryLine,
    VictoryTheme,
    VictoryLabel,
    VictoryTooltip
} from "victory";
import { DISH_FRAGMENT, FULL_ORDER_FRAGMENT, MYRESTAURANT_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurant, myRestaurantVariables } from '../../__generated__/myRestaurant';
import { Helmet } from "react-helmet";
import { pendingOrders } from '../../__generated__/pendingOrders';

export const MY_RESTAURANT_QUERY = gql`
 query myRestaurant($input:MyRestaurantInput!){
    myRestaurant(input:$input){
        ok
        error
        restaurant{
            ...MyRestaurantParts
            menu{
                ...DishParts
            }
            orders{
                ...OrderParts
            }
        }
    }
}
${MYRESTAURANT_FRAGMENT}
${DISH_FRAGMENT}
${ORDERS_FRAGMENT}
`

const PENDING_ORDERS_SUBSCRIPTION= gql`
    subscription pendingOrders{
        pendingOrders{
            ...FullOrderParts
        }
    }    
${FULL_ORDER_FRAGMENT}
`

interface IParams{
    id:string;
}

export const MyRestaurant = () => {
    const {id} =useParams<IParams>();
    const {data} =useQuery<myRestaurant,myRestaurantVariables>(
        MY_RESTAURANT_QUERY,
        {
            variables:{
                input:{
                    id:+id,
                }
        }}
        );
        const chartDate=[
            {x:1,y:3000},
            {x:2,y:1500},
            {x:3,y:4200},
            {x:4,y:2300},
            {x:5,y:6800},
        ]
        const {data:subscriptionData}=useSubscription<pendingOrders>(PENDING_ORDERS_SUBSCRIPTION);
        const history = useHistory();
        useEffect(()=>{
            if(subscriptionData?.pendingOrders.id){
                history.push(`/orders/${subscriptionData.pendingOrders.id}`);
            }
        },[subscriptionData]);
    return(

        <div>
            <Helmet>
                <title>
                    {data?.myRestaurant.restaurant?.name||"Loading..." } | Sub's Eats
                   
                </title>
            </Helmet>
            <div className="bg-gray-700 py-28 bg-center bg-cover"
            style={{
                backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`
            }}
            >
            </div>
            <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading...."}
                </h2>
                <Link to={`/restaurants/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
                    Add Dish &rarr;
                </Link>
                <Link to={""} className="text-white bg-lime-700 py-3 px-10">
                    Buy Promotion &rarr;
                </Link>
            </div>
            <div className="mt-10">
            {data?.myRestaurant.restaurant?.menu?.length ===0 ?(
                <h4 className="text-xl mb-5">
                    Please upload a dish
                </h4>
            ):(
                <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                    {data?.myRestaurant.restaurant?.menu?.map((dish)=>
                    <Dish 
                    name={dish.name} 
                    description={dish.description}
                    price={dish.price}
                    options={dish.options}
                    />
                    )}
                </div>
            )}
            <div className="mt-20 ">
                <h4 className="text-center text-2lg font-medium">Sales</h4>
                <div className=" mt-10">
                    <VictoryChart 
                    theme={VictoryTheme.material}
                    height={500}
                    width={window.innerWidth}
                    domainPadding={50}
                    containerComponent={<VictoryVoronoiContainer/>}>
                        <VictoryLine
                            labels={({datum})=>`$${datum.y}`}
                            labelComponent={
                            <VictoryTooltip
                                style={{fontSize:18}}
                                renderInPortal dy={-20}/>}
                            data={
                             data?.myRestaurant.restaurant?.orders.map((order)=>({
                                x:order.createdAt,
                                y:order.total
                             }))}
                             interpolation="natural"
                             style={{
                                 data:{
                                    
                                    strokeWidth:5
                                 }
                             }}
                        />
                        <VictoryAxis 
                        style={{tickLabels:{fontSize:18,fill:"#407c0f"} as any}}
                        dependentAxis
                        tickFormat={tick=>`$${tick}`} label="Days"/>

                        <VictoryAxis 
                        tickLabelComponent={<VictoryLabel renderInPortal/>}
                        style={
                            {tickLabels:{
                                fontSize:20,
                                
                            } as any
                        }
                        }
                        tickFormat={tick=>new Date(tick).toLocaleDateString("ko")} label="Days"/>
                    </VictoryChart>
                    {/* <VictoryPie
                            data={chartDate}
                        /> */}
                    {/* <VictoryChart domainPadding={20}>
      
                    <VictoryAxis
                    tickFormat={(step)=>`$${step/100}K`}
                    label="Order Amout"
                    dependentAxis
                    />
                     <VictoryAxis
                    label="Days"
                    tickFormat={(step)=> `Day${step}`}
                    />
                    <VictoryBar data={chartDate}/>
                    </VictoryChart> */}
        
                </div>
            </div>
            </div>
        </div>
    )
}