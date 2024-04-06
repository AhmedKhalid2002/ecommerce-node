import { Schema, Types, model } from "mongoose";

const productSchema=new Schema({
    name:{type:String,required:true,min:2,max:20},
    description:{type:String,min:10,max:200},
    avaliableItems:{type:Number,min:1,required:true},
    solidItem:{type:Number,default:0},
    price:{type:Number,min:1,required:true},
    discount:{type:Number,min:1,max:100},
    images:[
        {
            id:{type:String,required:true},
            url:{type:String,required:true}
        }],
    defaultImage:{id:{type:String,required:true},url:{type:String,required:true}},
    createdBy:{type:Types.ObjectId,ref:"User",required:true},
    category:{type:Types.ObjectId,ref:"Category",required:true},
    subcategory:{type:Types.ObjectId,ref:"subCategory",required:true},
    brand:{type:Types.ObjectId,ref:"Brand",required:true},
    cloudFolder:{type:String,unique:true,required:true},
    averageRate:{type:Number,min:1,max:5},
},{
    timestamps:true,
    strictQuery:true,
    toJSON:true,
    toObject:true,
});

// ^ virtual
productSchema.virtual("finalPrice").get(function(){
    if(this.discount > 0){
        return this.price - (this.price * this.discount)/100;
    }
    return this.price;
})

productSchema.virtual("review",{
    ref:"Review",
    localField:"_id",
    foreignField:"productId"
})

// ^ query helper
productSchema.query.paginate=function(page){

    page=page < 1 || isNaN(page) || !page ? 1 : page
    const limit = 20;
    const skip = limit * (page - 1);

    return this.skip(skip).limit(limit);
}

productSchema.query.search=function(keyWord){
    if(keyWord){
            return this.find({
                $or:[
                {name:{$regex:keyWord,$options:"i"}},
                {description:{$regex:keyWord,$options:"i"}}
            ]
        });
    }

}

// ^ methods
productSchema.methods.inStock=function(quantity){

    return this.avaliableItems >= quantity ? true : false;
}
export const Product=model("Product",productSchema)