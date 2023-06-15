const app=require("./app");
const cloudinary = require("cloudinary");
const connectDatabase=require("./config/database")
const PORT =process.env.PORT || 3003;
const cors=require('cors')
app.use(cors())
require('dotenv').config()
process.on("uncaughtException",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught exception`);
    process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION") {

require("dotenv").config({path:"backend/config/config.env"});
}

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const server=app.listen(PORT,()=>
{
    console.log(`Server is working on ${process.env.PORT} `)

})


process.on("unhandledRejection",(err)=>
{
    console.log(`Error: ${err.message}`);
    console.log(`shuting down the server due to unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    });
});
