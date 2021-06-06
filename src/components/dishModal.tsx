import { faRegistered } from "@fortawesome/free-solid-svg-icons";
import { MouseEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { AddDish } from '../pages/owner/add-dish';
import { Button } from './button';
import { ICartProps, useCartsDispatch } from '../context/CartsContext';
import { type } from "node:os";
import { v4 as uuidv4 } from 'uuid';


export interface ICartModalProps{
    restaurantId:number;
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

export interface OptionsProps{
    name:string;
    extra:number|undefined;
    choice:{
        name:string;
        extra:number;
    }|undefined
}

interface DishModalProps{
    onclose:()=>void;
    addDish:ICartModalProps;
}
export const DishModal:React.FC<DishModalProps>=({onclose,addDish})=>{
    
    const [count,setCount] = useState(1);
    const [price,setPrice]= useState(addDish.price);
    const [options,setOptions]= useState<OptionsProps[]>([]);
    const onCounIncrease=()=>{
        setCount((current)=>current+1);
    }
    const dispatch = useCartsDispatch();
    const onCounDecrease=()=>{
        setCount((current)=>current-1);
    }
    const onRadioCheck=(
        name:string,
        extra:number,
        choiceName:string|undefined,
        e:MouseEvent<HTMLInputElement, globalThis.MouseEvent>)=>{

            if(choiceName===undefined){
                //상위
               const select= options?.find((option)=>option.name===name);
               if(select){
                   setOptions(options.filter(option=>option.name!==name))
                   setPrice(price-extra);
                   e.currentTarget.checked=false;
               }else{
                setOptions((option)=>[...option!,{
                    name,
                    extra,
                    choice:undefined
                }])
                setPrice(price+extra);
               }

            }else{
                //하위
                const selectName= options.find(option=>option.name===name)
                if(selectName?.name ===name){
                    //중복
                    if(selectName.choice?.name===choiceName){
                        setOptions(options.filter(
                            option=>option.name===name).filter(
                            choice=>choice.name!==choiceName))
                        setPrice(price-extra);
                        e.currentTarget.checked=false;
                    }else{
                        const olderOption = options.find(option=>option.name===name)
                        const olderExtra= olderOption?.choice?.extra
                        
                        setOptions(options.filter(option=>option.name!==name))
                        setOptions(option=>[...option!,{
                            name,
                            extra,
                            choice:{
                                name:choiceName!,
                                extra,
                            }
                        }])
                        setPrice(price+extra-olderExtra!);
                    }
                }else{
                    //radio없는경우
                    setOptions((option)=>[...option!,{
                        name,
                        extra,
                        choice:{
                            name:choiceName!,
                            extra,
                        }
                    }])
                    setPrice(price+extra);
                }
            }
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
    //    const option= Object.entries(values).map((e)=>{
    //         if(typeof(e[1])==="string"){
    //             return{
    //                 name:e[0],
    //                 extra:+e[1],
    //                 choices:undefined
    //             }
    //         }else{
    //             const choice= addDish.options?.find(
    //                 (option)=>option.name===e[0])?.choices?.find(
    //                     (choice)=>choice.name===e[1][0]
    //             )
    //             return{
    //                 name:e[0],
    //                 extra:undefined,
    //                 choices:{
    //                     name:e[1],
    //                     extra:+choice?.extra!
    //                 }
    //             }
    //         }
    //     });

        const cart:ICartProps ={
            fakeId:uuidv4(),
            dishId:addDish.id,
            name:addDish.name,
            count:count,
            price:addDish.count,
            options:options
        }
        dispatch({
            type:'CREATE',
            restaurantId:addDish.restaurantId,
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
                                        onClick={(e)=>onRadioCheck(
                                            option.name,
                                            +choice.extra!,
                                            choice.name,
                                            e)}
                                        value={choice.name}
                                        type="radio"/>
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
                                onClick={(e)=>onRadioCheck(
                                    option.name,
                                    +option.extra!,
                                    undefined,
                                    e)}
                                value={option.extra+""}
                                type="radio"/>
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
                <span>{count*price}</span>
            </div>
          </form>
      </div>
    </div>
    )
}
   