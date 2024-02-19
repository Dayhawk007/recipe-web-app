"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import Card from "../ui-components/IngredientCard";
import { faAdd, faClock, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const RecipeMaker = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [query, setQuery] = useState("");
    const [queryChanged, setQueryChanged] = useState<boolean>(false);
    const [token, setToken] = useState(Cookies.get("token"));
    const [ingredients, setIngredients] = useState([]);
    const [debounceDelay, setDebounceDelay] = useState(500);
    const [selecetdIngredients,setSelecetedIngredients]=useState([]);
    const [recipes,setRecipes]=useState([]);

    const router = useRouter();

    async function onSearch(query: string) {
        const searchResults = await fetch(
            "/api/ingredients/search?searchTerm=" + query,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const searchResultsData = await searchResults.json();

        const ingredientsFinalArray = searchResultsData[0]["ingredients"].filter((ingredient:any) => {
            return !selecetdIngredients.some((selectedIngredient:any) => selectedIngredient.name === ingredient.name);
        });

        console.log(ingredientsFinalArray)

        setIngredients(ingredientsFinalArray);
    }


    async function getRecipes(ingredients:Array<{}>){
        try{
        const recipeResponseObject=await fetch(
            "/api/recipe/searchRecipe",
            {
                method:'POST',
                body:JSON.stringify({
                    searchIngredients:ingredients.map((item:any)=>item.name)
                }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const recipesJson=await recipeResponseObject.json();
        setRecipes(recipesJson);
        console.log(recipesJson);
        }
        catch(err:any){
            console.log(err.message)
        }

    }

    useEffect(()=>{
        console.log(selecetdIngredients);
        setIngredients(ingredients.filter((item)=>!selecetdIngredients.includes(item)));
    },[selecetdIngredients])

    useEffect(() => {
        
        let timer: NodeJS.Timeout;
        if (queryChanged) {
            timer = setTimeout(() => {
                onSearch(query);
                setQueryChanged(false); // Reset the flag
            }, debounceDelay);
        }

        return () => {
            clearTimeout(timer);
        };
        
    }, [query, onSearch, debounceDelay,queryChanged]);

    useEffect(()=>{
        onSearch(query);
    },[]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(query);
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(
                    "/api/user/user-info",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                ); // Assuming the API route is defined in /pages/api/getUserInfo.js

                if (!response.ok) {
                    router.push("/login");
                    throw new Error("Failed to fetch user info");
                }
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    

    return (
        <div className="flex flex-col items-center px-10 py-6 md:py-8 md:px-28 space-y-6 h-screen w-screen rounded-md  bg-white overflow-scroll">
            <div className="flex md:flex-row flex-col justify-between w-full items-center">
                {userInfo ? (
                    <div className="flex flex-row md:w-fit w-full items-center p-2 space-x-2">
                        <Image
                            className="rounded-full"
                            src={"/images/avatar.png"}
                            width={60}
                            height={60}
                            alt="Profile pic"
                        />
                        <div className="flex flex-col items-start space-y-1">
                            <h4 className="text-xl text-primary font-medium ">
                                Hello, {userInfo.username}
                            </h4>
                            <p className="text-sm text-primary font-normal">Let's cook!</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading user info...</p>
                )}
                {recipes.length!==0
                ?
                (
                    <div className="flex flex-col pt-2 md:pt-0 text-black w-full md:w-10/12 items-center">
                        <h6 className="text-sm">Whoosh..... Here are the</h6>
                        <h2 className="text-xl">Personalized Recipes for your pantry</h2>
                    </div>
                ):
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-row md:w-3/4 w-full justify-center items-center"
                >
                    <input
                        type="text"
                        placeholder="Enter search term"
                        value={query}
                        onChange={handleChange}
                        className="border w-full text-black border-black text-lg rounded-2xl py-4 px-6 md:py-6 md:px-8 mr-2 focus:outline-none focus:border-blue-500"
                    />
                </form>
                }
            </div>
            {recipes.length===0
            ?
            <div className="flex flex-row items-start overflow-scroll space-x-4 py-2 justify-start w-full">
                <div className="flex flex-col w-full space-y-3 items-start py-2">
                    {selecetdIngredients.length===0
                    ?
                    null
                    :
                    (   <>
                        <h4 className="text-xl text-black py-1 border-b-2 border-b-black">Selected Ingredients</h4>
                        <div className="w-full grid grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-6">
                        {selecetdIngredients.map((item:any) => {
                            return (
                                <Card
                                    key={item.name} // Add a unique key for each item in the map function
                                    name={item.name}
                                    imageUrl={item.image}
                                    iconColor="bg-gray-500"
                                    icon={faTrash}
                                    onClick={() => { 
                                        setSelecetedIngredients(prevState => prevState.filter((selected)=>selected!==item));
                                        //@ts-ignore
                                        setIngredients(prevState=>[...prevState,item]);
                                    }}
                                />
                            );
                        })}
                        </div>
                        </>
                    )
                }
                    <h4 className="text-xl text-black py-1 border-b-2 border-b-black">Available Ingredients</h4>
                    <div className="w-full grid grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-6">
                        {ingredients.map((item:any) => {
                            return (
                                <Card
                                    key={item.name} // Add a unique key for each item in the map function
                                    name={item.name}
                                    imageUrl={item.image}
                                    icon={faAdd}
                                    iconColor="bg-black"
                                    onClick={() => { 
                                        //@ts-ignore
                                        setSelecetedIngredients(prevState => [...prevState,item] );
                                    }}
                                />
                            );
                        })}
                    </div>
                    <button className="bg-black hover:bg-gray-900 px-6 py-3 rounded-xl text-white" onClick={()=>getRecipes(selecetdIngredients)}>Let's cook!</button>
                </div>
            </div>
            :
            (
                <div className="flex flex-col w-full md:w-10/12 items-center space-y-4 text-black">
                    {recipes.map((recipe:any,index)=>{
                        if(index===0){
                        return (
                            <div className="flex flex-col bg-primary rounded-xl w-full py-8 px-10 md:py-8 md:px-12 items-start space-y-4 md:space-y-6">
                                <h2 className="text-3xl text-secondary font-medium">Top Result</h2>
                                <Link className="w-full" href={`/recipe-maker/${recipe._id}`}>
                                <div className="flex md:flex-row flex-col md:items-center items-start justify-between space-y-4 md:space-y-0 w-full md:px-8 md:py-8 p-6 border border-secondary rounded-xl">
                                    <h4 className="text-base text-white font-semibold">{recipe.title}</h4>
                                    <div className="flex flex-row space-x-2 items-center"> 
                                        <FontAwesomeIcon className="text-white" icon={faClock} size={"2x"}></FontAwesomeIcon>
                                        <h4 className="text-base text-white font-semibold">{recipe.cookingTime} minutes</h4>
                                    </div>
                                    <div className="flex flex-row md:space-x-2 space-x-4 overflow-x-scroll md:w-fit w-full items-center">
                                        {recipe.matchedIngredients.map((item:any)=>{
                                            return(
                                                <div className="md:px-12 px-6 md:py-4 py-2 border text-white md:text-sm text-xs h-min font-semibold border-white rounded-full">{item}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                                </Link>
                            </div>
                        )
                        }
                        else{
                            return(
                                <>
                                <h2 className="text-gray-700 text-2xl self-start">Some more recipes....</h2>
                                <Link className="w-full" href={`/recipe-maker/${recipe._id}`}>
                                <div className="flex md:flex-row flex-col  items-start space-y-2 md:space-y-0 md:items-center justify-between w-full px-8 py-8 border border-primary rounded-xl">
                                    <h4 className="text-base text-black font-semibold">{recipe.title}</h4>
                                    <div className="flex flex-row space-x-2 items-center"> 
                                        <FontAwesomeIcon className="text-black" icon={faClock} size={"2x"}></FontAwesomeIcon>
                                        <h4 className="text-base text-black font-semibold">{recipe.cookingTime} minutes</h4>
                                    </div>
                                    <div className="flex flex-row md:w-fit w-full overflow-scroll space-x-4 items-center">
                                        {recipe.matchedIngredients.map((item:any)=>{
                                            return(
                                                <div className="md:px-12 px-6 py-2 md:text-sm text-xs  md:py-4 border text-black font-semibold border-black rounded-full">{item}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                                </Link>
                                </>
                            )
                        }
                    })}
                </div>
            )
            }
        </div>
    );
};

export default RecipeMaker;
