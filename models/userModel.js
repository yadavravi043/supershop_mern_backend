const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please enter Your Name"],
        maxLength:[30,"Name cannot exceed 30 char"],
        minLength:[4,"Name should have more than 4 char"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your  Email"],
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
          },
    },
    password:{
        type:String,
        required:[true,"Please Enter Password"],
        minLength:[8,"Password should have more than 8 char"],
        select:false //admin can see name and email only not pass 
    },
    avatar:
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
           
    },
    role:{
  
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

});


userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
});


userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};


userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");


    this.resetPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire=Date.now()+15*60*1000;
    // this.resetPasswordExpire=Date.now()+60*24*3600000;
    return resetToken;
}
module.exports=mongoose.model("User",userSchema);