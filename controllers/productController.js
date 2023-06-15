const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const ApiFeatures=require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const { json } = require("body-parser");

//create product :-Admin route
exports.createProduct=catchAsyncErrors(async(req,res,next)=>{
    let images=[];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
    
      const imagesLinks = [];
    
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(
          req.body.images,
          images[i]
          , {
          // folder: "products",
          resource_type: "auto",
          public_id: `${Date.now()}`,
        }
        );
    
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    
      req.body.images = imagesLinks;
      req.body.user=req.user.id;

    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
    });
    next()
});

exports.getAllProducts=catchAsyncErrors(async(req,res,next)=>{
    
    const resultPerPage=3;
    const productsCount=await Product.countDocuments();
    let products=await new ApiFeatures( Product.find(),req.query)
    .search()
    .filter().query;

         // let products = await apiFeature.query;

    let filteredProductsCount = products.length;
  
         // apiFeature.pagination(resultPerPage);


    products=await new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage).query;

    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,

    });
    next();
});

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
    next()
  });

//GET a single PRODUCT DETAILS
exports.getProductDetails=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404));
        }
    
    
    res.status(200).json({
        success:true,
        product,
    });
    next()
});


// Update Product -- Admin
exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);


    if(!product)
    {
        return next(new ErrorHander("Product not found",404));

    }

    // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        userFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product,
    });
    next()
});

//DELETE PRODUCT

exports.deleteProduct=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHander("Product not found",404));

    }

      // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully",
    });
    next()
});


// Create New Review or update the Review
exports.createProductReview=catchAsyncErrors(async(req,res,next)=>
{
    const {rating,comment,productId}=req.body;

    //object
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };

    const product =await Product.findById(productId);
    const isReviewed=product.reviews.find(
        (rev)=>rev.user.toString()===req.user._id.toString()
    );


    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString())
            (rev.rating=rating),(rev.comment=comment);
        });
    }
    else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    });
    next()
});

//Get All Reviews of a Product
exports.getProductReviews=catchAsyncErrors(async(req,res,next)=>{
    const product =await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));

    }

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    });
    next()
});

//Delete Review
exports.deleteReview=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId);

    if(!product)
    {
        return next(new ErrorHander("Product not Found",404));
    }

    //esme aise aaenge jo ki delete nahi kerna hai
    const reviews=product.reviews.filter(
        (rev)=>rev._id.toString()!==req.query.id.toString()
    );

    let avg=0;

    reviews.forEach((rev)=>{
        avg+=rev.rating;
    });
    

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
    const numOfReviews=reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews,
    },{
        new:true,
        runValidators:true,
        userFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
    next()
});






