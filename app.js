const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const errorMiddleware=require("./middleware/error");

    require("dotenv").config({ path: "backend/config/config.env" });




app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const product=require("./routes/productRoute");
const user =require("./routes/userRoute");
const order =require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use((err, req, res, next) => { 
  res.locals.error = err; 
  const status = err.status || 500;
  res.status(status); 
  res.render('error'); 
})
const cors=require('cors')
app.use(cors())
app.use("/api/v1",product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});
app.use(errorMiddleware);

module.exports=app; 