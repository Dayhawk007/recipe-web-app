import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the ingredient schema
interface Ingredient {
    name: string;
    quantity: string;
    image:string;
}

interface Instruction{
    text:string,
    image?:string
}

// Define the recipe schema
interface Recipe extends Document {
    title: string;
    description: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
    cookingTime: number;
}

const ingredientSchema = new Schema<Ingredient>({
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    image:{ type:String, required:true }
});

const instructionSchema=new Schema<Instruction>({
    text:{type:String,required:true},
    image:{type:String,default:""}
})

const recipeSchema = new Schema<Recipe>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],
    cookingTime: { type: Number, required: true }
});

const RecipeModel: Model<Recipe> = mongoose.model<Recipe>('Recipe', recipeSchema);

export {RecipeModel,Recipe}
