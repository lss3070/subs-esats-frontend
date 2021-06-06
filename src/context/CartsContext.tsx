import React, {createContext, Dispatch, useContext, useReducer} from "react"
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

type Cart ={
    dish:ICartProps
}
type CartState={
    restaurantId:number;
    cart: Cart[]|undefined
} 
type Action=
| { type: 'CREATE'; restaurantId:number; cart: ICartProps }
| { type: 'TOGGLE'; id: number }
| { type: 'REMOVE'; id: number };

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
    }
    console.log(state);
    //임시...
    return state;
}

export function CartContextProvider({children}:{children:React.ReactNode}){

 
    const [carts,dispatch] = useReducer(cartsReducer,{
        restaurantId:0,
        cart:[]
    });

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