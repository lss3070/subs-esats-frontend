import React, {createContext, Dispatch, useContext, useReducer} from "react"
import { DishParts } from '../__generated__/DishParts';
import { Dish } from '../components/dish';

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
    dishId:number;
    name:string;
    count:number;
    price:number;
    options:{
        name:string;
        extra:number|undefined;
        choices:{
            name:string;
            extra:number|undefined;
        }|undefined
    }[]
}

type Cart ={
    dish:ICartProps
}
type CartState= Cart[]
type Action=
| { type: 'CREATE'; cart: ICartProps }
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
        state.push({
            dish:action.cart
        })
    }
    console.log(state);
    //임시...
    return state;
}

export function CartContextProvider({children}:{children:React.ReactNode}){
    const initialState :Cart={
        dish:{
            dishId:0,
            count:0,
            name: "",
            price: 0,
            options: [{
                name: "",
                extra: 0,
                choices: {
                    name: "e",
                    extra: 0,
                }
            }],
        }
    }
 
    const [carts,dispatch] = useReducer(cartsReducer,[]);

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