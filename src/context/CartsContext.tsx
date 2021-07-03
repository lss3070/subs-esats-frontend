import React, {createContext, Dispatch, useContext, useEffect, useReducer} from "react"
import { DishParts } from '../__generated__/DishParts';
import { Dish } from '../components/dish';
import { OptionsProps } from "../components/dishModal";

// export interface ICartProps{
//     id:number;
//     name:string;
//     count:number;
//     price:number;
//     options:{
//         name:string;
//         extra:number|null;
//         require:boolean;
//         choices:{
//             name:string;
//             extra:number|null;
//         }[] |undefined
//     }[] |undefined
// }
export interface ICartProps{
    fakeId:string;
    dishId:number;
    name:string;
    count:number;
    price:number;
    options:OptionsProps[]
}

export type CartType ={
    dish:ICartProps
}
export type CartState={
    restaurantId:number;
    cart: CartType[]|undefined
} 
type Action=
    {type:'UPDATE'; cart:CartType[]}
| { type: 'CREATE'; restaurantId:number; cart: ICartProps }
| { type: 'TOGGLE'; id: number }
| { type: 'REMOVE'; fakeId: string };

const initialState = {
    restaurantId:0,
    cart:[]
  };
const localState = JSON.parse(localStorage.getItem("cartdata")!); 

const CartsStateContext = createContext<CartState|undefined>(undefined)

type CartsDispatch = Dispatch<Action>;

const CartsDispatchContext = createContext<CartsDispatch|undefined>(
    undefined
)

function cartsReducer(state:CartState,action:Action):CartState{





    switch(action.type){
        case'CREATE':
        state.restaurantId=action.restaurantId
        state.cart?.push({
            dish:action.cart
        })
        return state;
        case 'REMOVE':
            state.cart?.filter(item=>item.dish.fakeId!==action.fakeId)
            return state;
        case 'UPDATE':
            state.cart=action.cart;
            return state;
        default:
            throw new Error('error!');
    }
}

export function CartContextProvider({children}:{children:React.ReactNode}){

    const [carts,dispatch] = useReducer(cartsReducer,localState || initialState);

    useEffect(()=>{
        console.log("contextuseEffect!!")
        
    },[carts.cart])

    return (
        <CartsDispatchContext.Provider value={dispatch}>
            <CartsStateContext.Provider value={carts}>
                {children}
            </CartsStateContext.Provider>
        </CartsDispatchContext.Provider>
    )
}

export function useCartsState(){
    const state = useContext(CartsStateContext);
    if(!state) throw new Error('CartProvider not found');
    return state;
}

export function useCartsDispatch(){
    const dispatch = useContext(CartsDispatchContext);
    if(!dispatch) throw new Error('CartsProvider not found');
    return dispatch;
}