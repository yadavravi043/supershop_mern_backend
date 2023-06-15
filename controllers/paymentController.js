const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")("sk_test_51N2pK9SEYErsvdEx2ovDhL8iRCMK9mfWxhfzvlRjzInEzmoVyI5A6Jd9xJ46y3Jj3lCnAmLA2UYhM5XzmIH2CUQh00d0bCaZlk");
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",

    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      company: "Supershop",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
    next()
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  next()
});
