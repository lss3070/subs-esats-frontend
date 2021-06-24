import { faRegistered,faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { AddDish } from '../pages/owner/add-dish';
import { Button } from './button';
import { ICartProps, useCartsDispatch } from '../context/CartsContext';
import { type } from "node:os";
import { v4 as uuidv4 } from 'uuid';
import { url } from "node:inspector";


export interface ICartModalProps{
    restaurantId:number;
    id:number;
    name:string;
    description:string;
    photo:string;
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
    const onDropDown =(e:React.MouseEvent<HTMLSpanElement>):void=>{
        console.log("!!");
        const area = e.currentTarget.parentElement?.parentElement;
        
        for(let i = 1;i<area?.childElementCount!; i++){
            area?.children[i].classList.toggle('hidden');
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
      {/* <div className="modal-header w-2/5">
        
      </div> */}
      <div className="modal-content w-2/5">
        <span onClick={onclose} className="float-right cursor-pointer">X</span>
          <div  className="bg-gray-700 py-28 bg-center bg-cover"
           style={{backgroundImage:`url(${addDish.photo})`}}/>
          <form onSubmit={handleSubmit(onSubmit)} >
            <div className=" mb-20">
                <div className=" text-4xl">{addDish.name}</div>
                <div className=" text-xl">{addDish.description}</div>
            </div>
            <div>
                {addDish.options?.map((option,index)=>{
                        if(option.choices!){
                            return( <div>
                                <div className="w-full bg-gradient-to-r from-gray-300 text-2xl p-6">
                                    <span>{option.name} </span>
                                    <span className=" border-2 border-gray-500 rounded-full w-8 h-8; text-xl text-center
                                    cursor-pointer
                                    float-right "
                                    onClick={onDropDown}
                                    ><FontAwesomeIcon icon={faChevronDown}/>
                                    </span>
                                </div>
                                {option.choices.map((choice)=>{
                                    return (
                                    <div className="m-4">
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
                                        type="radio"
                                        className="mx-4"
                                        />
                                        <span>{choice.name}</span>
                                        {choice.extra&&(
                                            <span className="float-right text-gray-500">+$ {choice.extra}</span>
                                        )}
                                    </div>
                                    )
                                })}
                            </div>)
                        }else{
                            return(
                                <div className="m-4">
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
                                type="radio"
                                className="mx-4"/>
                                    <span>{option.name}</span>
                                    <span className="float-right text-gray-500">+$ {option.extra}</span>
                                </div>
                            )
                        }
                })
                }
            </div>
            <div className=" grid grid-cols-3">
                <div className="col-span-1 flex">
                    <span className=" bg-gray-500 w-10 h-10 rounded-full text-center align-middle text-3xl mx-3
                    text-white" 
                    onClick={onCounDecrease}>-</span>
                    <span className="text-3xl mx-3" >{count}</span>
                    <span className="bg-gray-500 w-10 h-10 rounded-full text-center align-middle text-3xl mx-3
                     text-white"
                     onClick={onCounIncrease}>+</span>
                </div>
                <div className="col-span-2">
                    <Button actionText="Add Order" loading={false} canClick={isValid}/>
                    <span>{count*price}</span>
                </div>
            </div>
          </form>
      </div>
    </div>
    )}
   