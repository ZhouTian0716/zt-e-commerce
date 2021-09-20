const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const uniqueid = require("uniqueid");

exports.list = async (req, res) => {
  try {
    res.json(await User.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  let cart = await Cart.findOne({ orderBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();
  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.createUserCart = async (req, res) => {
  const { cart } = req.body;
  let products = [];
  const user = await User.findOne({ email: req.user.email }).exec();
  // check if cart with logged in user id already exist
  let cartExistByThisUser = await Cart.findOne({ orderBy: user._id }).exec();
  if (cartExistByThisUser) {
    cartExistByThisUser.remove();
    // console.log("removed old cart");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    let productFromDb = await Product.findById(cart[i]._id)
      .select("price")
      .exec();
    object.price = productFromDb.price;
    products.push(object);
  }

  // console.log("products ------->", products);
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }
  // console.log("cartTotal ------->", cartTotal);

  let newCart = await new Cart({
    products,
    cartTotal,
    orderBy: user._id,
  }).save();

  // console.log("new cart ------->", newCart);
  res.json({ ok: true });
};

exports.clearUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOneAndRemove({ orderBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();
  res.json({ ok: true });
};

// coupon
exports.recieveCoupon = async (req, res) => {
  const { coupon } = req.body;
  console.log("recived coupon", coupon);
  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (validCoupon === null) {
    return res.json({ err: "Invalid coupon" });
  }
  console.log("VALID COUPON", validCoupon);
  const user = await User.findOne({ email: req.user.email }).exec();
  let { products, cartTotal } = await Cart.findOne({ orderBy: user._id })
    .populate("products.product", "_id title price")
    .exec();
  console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

  // calculate total after discount
  let totalAfterDiscount = (cartTotal * validCoupon.discount * 0.01).toFixed(2);
  // update user cart information
  await Cart.findOneAndUpdate(
    { orderBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();
  console.log("totalAfterDiscount", totalAfterDiscount);
  res.json(totalAfterDiscount);
};

// CREATE ORDER
exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();
  let { products } = await Cart.findOne({ orderBy: user._id }).exec();
  // New Order
  let newOrder = await new Order({
    products,
    paymentIntent,
    orderBy: user._id,
  }).save();

  // New Order results in these actions
  // 1. Decrement quantity, increment sold
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, { new: true });
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);
  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
};

//*************************************************************************************
// CREATE CASH ORDER
exports.createCashOrder = async (req, res) => {
  // console.log(req.body);
  const { COD, couponApplied } = req.body;
  if(!COD) return res.status(400).send('Create cash order failed')
  const user = await User.findOne({ email: req.user.email }).exec();
  let userCart = await Cart.findOne({ orderBy: user._id }).exec();
  // console.log(userCart);
  // return;

  //##########################################
  let finalAmount = 0;
  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = Math.round(userCart.totalAfterDiscount * 100);
  } else {
    finalAmount = Math.round(userCart.cartTotal * 100);
  }
  //##########################################
  // New Order
  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: "AUD",
      status: "Cash on Delivery",
      created: Date.now()*0.001,
      payment_method_types: ["cash"],
    },
    orderBy: user._id,
    orderStatus: "Cash on Delivery",
  }).save();
  console.log(newOrder);

  // New Order results in these actions
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, { new: true });
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);
  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
};
//*************************************************************************************

// FIND USER ORDERS
exports.findUserOrders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  let userOrders = await Order.find({ orderBy: user._id })
    .populate("products.product")
    .exec();
  res.json(userOrders);
};

// WISHLIST
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  // $addToSet help us to get rid of duplicates
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).exec();
  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();
  res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();
  res.json({ ok: true });
};
