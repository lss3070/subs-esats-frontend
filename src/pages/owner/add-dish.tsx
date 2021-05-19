import { gql, useMutation } from '@apollo/client';
import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from "react-router-dom";
import { Button } from '../../components/button';
import { createDish, createDishVariables } from '../../__generated__/createDish';
import { MY_RESTAURANT_QUERY } from './my-restaurant';


const CREATE_DISH_MUTATION =gql`

mutation createDish($input:CreateDishInput!){
         createDish(input:$input){
            ok
            error
        }
    }
`

interface IParams{
    restaurantId:string;
}
interface IForm {
    name: string;
    price: string;
    description: string;
    [key: string]: string;
  }



export const AddDish = ()=>{
    const {restaurantId}= useParams<IParams>();
    const history = useHistory();
    const params =useParams<{restaurantId:string}>()
    const [createDishMutation,{loading}]=useMutation<createDish,createDishVariables>(CREATE_DISH_MUTATION,{
        refetchQueries:[{query:MY_RESTAURANT_QUERY,variables:{
            input:{
                id:+restaurantId,
            }
        }}]
    });

    const {
        register,
        handleSubmit,
        formState,
        getValues,
        setValue
      } = useForm<IForm>({
          mode:"onChange"
      });
      const onSubmit=()=>{
        const {name,price,description,...rest}= getValues();
        console.log(optionsNumber);
        console.log(rest);
        const optionsObjects= optionsNumber.map((theId)=>({
            name: rest[`${theId}-optionName`],
            extra:+rest[`${theId}-optionExtra`]
        }))
        console.log(optionsObjects)
        createDishMutation({
            variables:{
                input:{
                    name,
                    price:+price,
                    description,
                    restaurantId:+restaurantId,
                    options:optionsObjects
                }
            }
        })
        history.goBack();
      };
      const [optionsNumber, setOptionsNumber] = useState<number[]>([])
      const onAddOptionClick=()=>{
        setOptionsNumber((current)=> [Date.now(), ...current]);
      };
      const onDeleteClick=(idToDelete:number)=>{
        setOptionsNumber(current=>current.filter((id)=>id!==idToDelete));
        //
        setValue(`${idToDelete}-optionName`,"")
        setValue(`${idToDelete}-optionExtra`,"")
      }
    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>Add DIsh | Sub's Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
            >
                <input
                    className="input"
                    type="text"
                    placeholder="Name"
                    {...register("name",{
                        required:{
                            value:true,
                            message:"Name is required."
                        }
                    })}
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Price"
                    min={0}
                    {...register("price",{
                        required:{
                            value:true,
                            message:"Price is required."
                        }
                    })}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Description"
                    {...register("description",{
                        required:{
                            value:true,
                            message:"Description is required."
                        }
                    })}
                />
                <div className="my-10">
                    <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
                    <span
                    onClick={onAddOptionClick}
                    className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-">
                        Add Dish Option
                    </span>
                    {optionsNumber.length !== 0 &&
                          optionsNumber.map((id) => (
                        <div key={id} className="mt-5">
                            <input 
                            {...register(`${id}-optionName`,{

                            })}
                            className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2" 
                            type="text" 
                            placeholder="Option Name"
                            />
                            
                            <input 
                            {...register(`${id}-optionExtra`,{

                            })}
                            className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2" 
                            type="nubmer" 
                            min={0}
                            defaultValue={0}
                            placeholder="Option extra"
                            />
                            <span 
                            className="cursor-pointer 
                            bg-red-500 
                            ml-3 
                            text-white 
                            py-3 px-4 mt-5 bg-"
                            onClick={()=>onDeleteClick(id)} role="button">Delete button</span>
                    </div>
                    ))}
                </div>
                <Button
                loading={loading}
                canClick={formState.isValid}
                actionText="Create Dish"
                />

            </form>
        </div>
    
        )
    }