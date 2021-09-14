const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  const paymentIntent = await stripe.paymentIntent.create({
    amount: 100,
    currentcy: "AUD",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  })
};

// exports.createPaymentIntent = async (req, res) => {
//   try {
//     res.json(await User.find({}).sort({ createdAt: -1 }).exec());
//   } catch (err) {
//     res.status(400).send(err);
//   }
// };
