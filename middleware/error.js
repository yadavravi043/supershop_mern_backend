const ErrorHandler=require("../utils/errorhander");

module.exports=(err,req,res,next)=>{
    
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal server Error";

     //wrong mongodb id error
     if(err.name==="CastError")
     {
         const message=`Resource not found. Invalid:${err.path}`;
         err=new ErrorHandler(message,400);
     }

     // Mongoose duplicate key error
     //this error will come when email is same as we have registered
     if(err.code===11000)
     {
        const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
        err=new ErrorHandler(message,400);
     }

     //wrong json web token
     if(err.name==="JsonWebTokenError")
     {
        const message=`Json Web Token is Invalid, Try Again`;
        err=new ErrorHandler(message,400);
     }

     //JWT Expire error
     if(err.name==="TokenExpiredError")
     {
        const message=`Json Web Token is Expired, Try Again`;
        err=new ErrorHandler(message,400);
     }

     
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });


};