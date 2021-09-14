const Coupon = require("../models/coupon");

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    const data = await new Coupon({
      name,
      expiry,
      discount,
    }).save();
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Coupon.findOneAndDelete(req.params.couponId).exec();
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    res.status(400).send(err);
  }
};
