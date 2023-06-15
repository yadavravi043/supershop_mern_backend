const mongoose=require("mongoose");
const productSchema= mongoose.Schema({
    name:{
        type:String,
        required:true,
        // required:[true,"Please enter product name"],
        trim:true
    },

    description:{
        type:String,
        required:true,
        // required:[true,"Please Enter product Description"]
    },

    price:{
        type:Number,
    required:true,
    // required:[true,"Please Enter product price"],
    maxLength:[8,"Price cannot exceed 8 char"]
   },

   ratings:{
    type:Number,
    default:0,
   },

   images:
   [
    {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
       }
   ],

   category:{
    type:String,
    required:true,
    // required:[true,"Please Enter product Category"],
   },

   Stock:{
    type:Number,
    required:true,
    required:[true,"Please enter product Stock"],
    maxLength:[4,"Stock cannot exceed 4 characters"],
    default:1,
   },

   numOfReviews:{
    type:Number,
    default:0
   },

   reviews:[
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true,
           },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        },

    },
   ],

   //who made
   user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    // required:true,
   },

   createdAt:{
    type:Date,
    default:Date.now
   }

})

module.exports=mongoose.model("Product",productSchema);