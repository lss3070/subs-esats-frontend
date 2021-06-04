import { ICartProps } from "../context/CartsContext"
import { AddDish } from '../pages/owner/add-dish';




interface DishModalProps{
    onclose:()=>void;
    addDish:ICartProps;
}


export const DishModal:React.FC<DishModalProps>=({onclose,addDish})=>{
    return (
    <div className="modal-wrap">
      <div className="modal-header">
        <span onClick={onclose} className="float-right cursor-pointer">X</span>
      </div>
      <div  className="modal-content">
          <div>
            <span>{addDish.name}</span>
          </div>
          <div>
            {addDish.options.map((option)=>{
                <span>{option.name}</span>
            })}
          </div>
      </div>
    </div>
    )
}
   