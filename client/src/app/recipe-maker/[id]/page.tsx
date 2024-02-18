'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

const RecipePage=()=>{
    const searchParams=useParams();

    const [token,setToken]=useState(Cookies.get("token"));

    const [recipe,setRecipe]=useState(null);

    const getRecipeById=async()=>{
        try {
            const id=searchParams.id;
            const recipeResponse=await fetch(
                "http://127.0.0.1:5000/api/recipe/"+id,
                {
                    method:'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            const recipeData=await recipeResponse.json();

            setRecipe(recipeData);

            console.log(recipeData);
        } catch (error:any) {
            alert("Error occured \n"+error.message)
        }
    }

    useEffect(()=>{
        getRecipeById();
    },[])

    return(
        <div className="bg-white flex flex-row h-screen w-screen p-8 space-x-3 items-start">
            {
                recipe==null
                ?
                <div className="flex flex-row items-center w-full h-full justify-center">
                    <h1 className="text-5xl text-black">Recipe not found</h1>
                </div>
                :
                <>
                <div className="w-1/4 h-full flex flex-col bg-primary text-white py-12 px-12 rounded-2xl space-y-6 text-xs">
                    <h3 className="text-3xl text-secondary font-semibold">{recipe.title}</h3>
                    <p className="text-sm overflow-auto">{recipe.description}</p>
                    <div className="grid grid-flow-col grid-rows-2 auto-cols-max gap-3 overflow-auto items-center">
                        {recipe.ingredients.map((item)=>{
                            return (
                                <div className="px-4 py-2 border border-white rounded-full">{item.name}</div>
                            )
                        })}
                    </div>
                    <h3 className="text-secondary font-semibold text-lg">Ingredients used:</h3>
                    <ul className="flex flex-col space-y-2 text-white marker:text-white">
                        {recipe.ingredients.map((item,index)=>{
                            return(
                                <li>{index+1}. {item.name}, {item.quantity}</li>
                            )
                        })}
                    </ul>
                </div>
                <div className="flex flex-col items-center space-y-4 w-1/4 h-full">
                    <Image className="w-full rounded-2xl h-10/12" width={1000} height={1000} src={recipe.image} alt="Recipe Image"/>
                    <h4 className="text-white bg-primary text-xl font-semibold py-3 px-6 rounded-2xl border border-black">Cooking Time : <span className="text-secondary font-medium">{recipe.cookingTime} minutes</span></h4>
                </div>
                <div className="flex flex-col text-black w-2/4 h-full space-y-4 items-start py-10 px-8 border-2 border-black rounded-2xl">
                    <h3 className="text-3xl font-semibold">Instructions</h3>
                    <div className="flex flex-col space-y-2 text-sm">
                        {recipe.instructions.map((item,index)=>{
                            return(
                                <p>{index+1}. {item.text}</p>
                            )
                        })}
                    </div>
                </div>
                </>
            }
        </div>
    )
}

export default RecipePage