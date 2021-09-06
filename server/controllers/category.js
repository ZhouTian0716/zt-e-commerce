// const slugify = require('slugify');
const translation = require("transliteration");
const trSlugify = translation.slugify;
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const Product = require("../models/product");

exports.create = async (req, res) => {
  try {
    // console.log(req.body);
    const { name } = req.body;
    const data = await new Category({ name, slug: trSlugify(name) }).save();
    res.json(data);
  } catch (err) {
    // console.log(err);
    res.status(400).send(err);
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await Category.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({category})
    .populate('category')
    .populate('postedBy', '_id name')
    .exec();
    res.json({
      category,
      products,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const data = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: trSlugify(name) },
      { new: true }
    );
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

//
exports.getSubs = (req, res) => {
  SubCategory.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err);
    res.json(subs);
  });
};
