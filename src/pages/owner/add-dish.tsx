import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from "react-router-dom";
import { Button } from '../../components/button';
import { createDish, createDishVariables } from '../../__generated__/createDish';
import { MY_RESTAURANT_QUERY } from './my-restaurant';
import { Autocomplete } from '@material-ui/lab';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { RESTAURANT_QUERY } from '../client/restaurant';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';
import {TextField} from '@material-ui/core'
import Chip from '@material-ui/core/Chip';
import { DishOptionInputType } from '../../__generated__/globalTypes';


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
    file:string;
    [key: string]: string;
  }
interface IDivisions{
    name:string
}

interface IChoice{
    name:string;
    extra:number;
}


export const AddDish = ()=>{

    const [uploading,setUploading] = useState(false);
    const [imageUrl,setImageUrl]= useState("");
    const {restaurantId}= useParams<IParams>();
    const history = useHistory();
    const params =useParams<{restaurantId:string}>()
    const restaurantQuery =useQuery<restaurant,restaurantVariables>(RESTAURANT_QUERY,{
        variables:{
            input:{
                restaurantId:+restaurantId
            }
        }
    });
    
    const [createDishMutation,{loading}]=useMutation<createDish,createDishVariables>(CREATE_DISH_MUTATION,{
        refetchQueries:[{query:MY_RESTAURANT_QUERY,variables:{
            input:{
                id:+restaurantId,
            }
        }}]
    });

    const fixedDivisions: IDivisions[] =[]
    const [divisionValue,setDivisionValue]= useState<IDivisions[]>([...fixedDivisions])
    const {
        register,
        handleSubmit,
        formState,
        getValues,
        setValue
      } = useForm<IForm>({
          mode:"onChange"
      });
      const onSubmit= async()=>{
        setUploading(true);
        const {file,name,price,description,...rest}= getValues();

        //step one parentid 기준 정렬
        //step two 부모값만 먼저 Object 넣고
        //step three 자식값 부모값 찾아서 넣기
        let optionsObjects= optionsNumber.map((theId):DishOptionInputType=>
          {
              if(theId.parentId===undefined){
                if(isNaN(+rest[`${theId.id}-optionExtra`])){
                    return{
                        name: rest[`${theId.id}-optionName`],
                        choices:new Array<IChoice>(),
                    }
                }else{
                    return{
                        name: rest[`${theId.id}-optionName`],
                        extra:+rest[`${theId.id}-optionExtra`],
                        choices:new Array<IChoice>(),
                    }
                }
              }else{
                  return{
                      name:'',
                  }
              }
        }).filter(Boolean).filter(item=>item.name!=='');
       
        optionsNumber.map((theId)=>{
            const index= optionsObjects.findIndex((option)=>option?.name===rest[`${theId.parentId}-optionName`]);
      
            if(index>=0){
                console.log(index);
                console.log(rest[`${theId.id}-optionName`])
                optionsObjects[index]?.choices?.push({
                    name:rest[`${theId.id}-optionName`],
                    extra:+rest[`${theId.id}-optionExtra`]
                })
            }
        });

        const divisionObjects = divisionValue.map((division)=>({
            name:division.name
        }))

        const actualFile=file[0];
        const formbody = new FormData();
        const url = process.env.NODE_ENV==="production"?"https://subs-eats-backend.herokuapp.com/uploads": `http://localhost:4000/uploads`;
        formbody.append("file",actualFile);
        const {url:coverImg} = await(
            await fetch(url,{
            method:"POST",
            body:formbody
        })
        ).json();
        setImageUrl(coverImg);

        const divsions = divisionValue;

        createDishMutation({
            variables:{
                input:{
                    name,
                    price:+price,
                    description,
                    photo:coverImg,
                    restaurantId:+restaurantId,
                    options:optionsObjects,
                    divisions:divisionObjects
                }
            }
        })

        history.goBack();
      };
      interface optionNumberProps{
        id:number;
        group:boolean;
        parentId:number|undefined;
      }

      const [optionsNumber, setOptionsNumber] = useState<optionNumberProps[]>([])
      const onAddOptionClick=()=>{
        setOptionsNumber((current)=> 
        [{id:Date.now(),group:false,parentId:undefined}, ...current]);
      };
      const onAddGroupClick=()=>{
        setOptionsNumber((current)=> 
        [{id:Date.now(),group:true,parentId:undefined}, ...current]);
      }
      const onAddGroupItemClick=(id:number)=>{
        setOptionsNumber((current)=>{
            const parentNode= current.find((cur)=>cur.id===id);
            const parentIndex = current.indexOf(parentNode!);
            console.log(parentIndex);
            const before = current.slice(0,parentIndex+1);
            const after = current.slice(parentIndex+1,current.length);
            return[
                ...before,{id:Date.now(),group:false,parentId:id},...after
            ]
        });
        }
      
      const onDeleteClick=(idToDelete:number)=>{
        setOptionsNumber(current=>current.filter((item)=>item.id!==idToDelete));
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
   

                {
                    restaurantQuery.data?.restaurant.restaurant?.divisions&&
                    <Autocomplete
                    multiple
                    value ={divisionValue}
                    onChange={(event, newValue) => {
                        setDivisionValue([
                          ...fixedDivisions,
                          ...newValue.filter((option) => fixedDivisions.indexOf(option) === -1),
                        ]);
                      }}

                    options={restaurantQuery.data?.restaurant.restaurant?.divisions}
                    getOptionLabel={(option) => option.name}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            label={option.name}
                            {...getTagProps({ index })}
                            disabled={fixedDivisions.indexOf(option) !== -1}
                          />
                        ))
                      }

                    renderInput={(params)=>
                        <TextField {...register("diVisions")}
                        label="Division Name"
                        {...params} variant="outlined"></TextField>
                    }/>
                }
                <div>
                    <span>Banner Image</span>
                    <input type="file" accept="image/" {...register("file",{
                        required:{
                            value:true,
                            message:"!!"
                        }
                    })}/>
                </div>
                <div className="my-10">
                    <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
                    <span
                    onClick={onAddOptionClick}
                    className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-">
                        Add Dish Option
                    </span>
                    <span
                    onClick={onAddGroupClick}
                    className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 ml-2">
                        Add Group Option
                    </span>
                    {optionsNumber.length !== 0 &&
                          optionsNumber.map((option) => (
                        <div key={option.id} className="mt-5">
                            {option.group===true?
                            (
                                <div>
                                    <input 
                                    {...register(`${option.id}-optionName`,{
                                    })}
                                    className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2 w-2/4" 
                                    type="text" 
                                    placeholder="Option Name"
                                    />
                                     <span 
                                    className="cursor-pointer 
                                    bg-green-500 
                                    ml-3 
                                    text-white 
                                    py-3 px-4 mt-5 bg-"
                                    onClick={()=>onAddGroupItemClick(option.id)} role="button">Add Option</span>
                                                   <span 
                                    className="cursor-pointer 
                                    bg-red-500 
                                    ml-3 
                                    text-white 
                                    py-3 px-4 mt-5 bg-"
                                    onClick={()=>onDeleteClick(option.id)} role="button">Delete Group</span>
                                </div>
                            )
                            : option.parentId!==undefined?
                            (
                                <div className="ml-2">                           
                                <input 
                                {...register(`${option.id}-optionName`,{
                                })}
                                className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2" 
                                type="text" 
                                placeholder="Option Name"
                                />
                                <input 
                                {...register(`${option.id}-optionExtra`,{

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
                                onClick={()=>onDeleteClick(option.id)} role="button">Delete button</span>
                            </div>
                            ):
                            (
                                <div>
                                    <input 
                                    {...register(`${option.id}-optionName`,{
                                    })}
                                    className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2" 
                                    type="text" 
                                    placeholder="Option Name"
                                    />
                                    <input 
                                    {...register(`${option.id}-optionExtra`,{

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
                                    onClick={()=>onDeleteClick(option.id)} role="button">Delete Option</span>
                                </div>
                            )
                        }
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

    //저녁은 하는거 마무리하고 먹으려구요
    //은진씨는 저녁 드셨나요??