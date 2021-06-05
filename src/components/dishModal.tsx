import { faRegistered } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AddDish } from '../pages/owner/add-dish';
import { Button } from './button';
import { ICartProps, useCartsDispatch } from '../context/CartsContext';
import { type } from "node:os";

export interface ICartModalProps{
    id:number;
    name:string;
    count:number;
    price:number;
    options:{
        name:string;
        extra:number|null;
        require:boolean;
        choices:{
            name:string;
            extra:number|null;
        }[] |undefined
    }[] |undefined
}

interface DishModalProps{
    onclose:()=>void;
    addDish:ICartModalProps;
}
export const DishModal:React.FC<DishModalProps>=({onclose,addDish})=>{
    
    const [count,setCount] = useState(1);
    const [price,setPrcie]= useState(addDish.price);
    const onCounIncrease=()=>{
        setCount((current)=>current+1);
    }
    const dispatch = useCartsDispatch();
    const onCounDecrease=()=>{
        setCount((current)=>current-1);
    }
    const onCheckOption=(name:string,extra:number)=>{
        console.log(name,extra);
    }
    const {
        register,
        getValues,
        formState: { errors,isValid },
        handleSubmit
    }= useForm({
            mode:"onChange",
        });
    const onSubmit=()=>{
        const values=getValues();
       const option= Object.entries(values).map((e)=>{
            if(typeof(e[1])==="string"){
                return{
                    name:e[0],
                    extra:+e[1],
                    choices:undefined
                }
            }else{
                const choice= addDish.options?.find(
                    (option)=>option.name===e[0])?.choices?.find(
                        (choice)=>choice.name===e[1][0]
                )
                return{
                    name:e[0],
                    extra:undefined,
                    choices:{
                        name:e[1],
                        extra:+choice?.extra!
                    }
                }
            }
        });
        const cart:ICartProps ={
            dishId:addDish.id,
            name:addDish.name,
            count:count,
            price:addDish.count,
            options:option
        }
        dispatch({
            type:'CREATE',
            cart:cart
        })
        }

    addDish.options?.sort((pre,cur)=>{
        return pre.choices?1:-1
    })
    return (
    <div className="modal-wrap">
      <div className="modal-header">
        <span onClick={onclose} className="float-right cursor-pointer">X</span>
      </div>
      <div  className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)} >
            <div>
                <span>{addDish.name}</span>
            </div>
            <div>
                {addDish.options?.map((option,index)=>{
                        if(option.choices!){
                            return( <div>
                                <span>{option.name} down</span>
                                {option.choices.map((choice)=>{
                                    return (
                                    <div>
                                        <input {...register(`${option.name}`,{
                                            required:{
                                                value: option.require,
                                                message:`${option.name} is required`
                                            },
                                        }
                                        )}
                                        onClick={()=>onCheckOption(choice.name,+choice.extra!)}
                                        value={choice.name}
                                        type="checkbox"/>
                                        <span>{choice.name}</span>
                                        <span>{choice.extra}</span>
                                    </div>
                                    )
                                })}
                            </div>)
                        }else{
                            return(
                                <div>
                                <input {...register(`${option.name}`,{
                                    required:{
                                        value: option.require,
                                        message:`${option.name} is required`
                                    },
                                }
                                )}
                                onClick={()=>onCheckOption(option.name,+option.extra!)}
                                value={option.extra+""}
                                type="checkbox"/>
                                    <span>{option.name}</span>
                                    <span>+${option.extra}</span>
                                </div>
                            )
                        }
                })
                }
            </div>
            <div>
                <span onClick={onCounDecrease}>-</span>
                <span>{count}</span>
                <span onClick={onCounIncrease}>+</span>
                <Button actionText="Add Order" loading={false} canClick={isValid}/>
                <span>{count*addDish.price}</span>
            </div>
          </form>
      </div>
    </div>
    )
}
   