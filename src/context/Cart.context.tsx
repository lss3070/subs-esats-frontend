import {createContext, Dispatch} from "react"
import { DishParts } from '../__generated__/DishParts';

type Cart ={
    dish:DishParts[]
}
type CartState= Cart[]
type Action=
| { type: 'CREATE'; text: string }
| { type: 'TOGGLE'; id: number }
| { type: 'REMOVE'; id: number };

const CartContext = createContext<Cart|undefined>(undefined)

type CartDispatch = Dispatch<Action>;

const CartDispatchContext = createContext<CartDispatch|undefined>(
    undefined
)

function cartsReducer(state:CartState,action:Action):CartState{

    //임시...
        return state;
}