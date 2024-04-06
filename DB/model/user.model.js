import { Schema, model } from "mongoose";
import bcryptjs from 'bcryptjs'

const maleDefaultPic="https://res.cloudinary.com/dsa7wboon/image/upload/v1706877824/ecommerce/user/default/profiePic/male-default_fp4btn.webp";
const fmaleDefaultPic= "https://res.cloudinary.com/dsa7wboon/image/upload/v1706877826/ecommerce/user/default/profiePic/fmale-default_oirm7u.webp";
const maleUniqueId="ecommerce/user/default/profiePic/male-default_fp4btn";
const fmaleUniqueId="ecommerce/user/default/profiePic/fmale-default_oirm7u";

const userSchema=new Schema({
    userName:{type:String,required:true,min:3,max:20},
    email:{type:String,required:true,unique:true,lowercase:true},
    password:{type:String,required:true},
    isConfirmed:{type:Boolean,default:false},
    gender:{type:String,enum:["male","fmale"]},
    phone:{type:String},
    role:{type:String,enum:["user","seller","admin"],default:"user"},
    forgetCode:String,
    profilePic: {url: {type: String,default:function(){return this.gender === "male"?maleDefaultPic:fmaleDefaultPic}},id:{type:String,default:function(){return this.gender === "male"?maleUniqueId:fmaleUniqueId}}},
    coverImages:[{url:{type:String},id:{type:String}}]
},{
    timestamps:true
});

userSchema.pre("save",function(){{
    if(this.isModified("password")){
        this.password=bcryptjs.hashSync(this.password,parseInt(process.env.SALT_ROUND))
    }
}})


export const User=model("User",userSchema);