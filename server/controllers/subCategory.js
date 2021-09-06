// const slugify = require('slugify');
const translation = require("transliteration");
const trSlugify = translation.slugify;
const SubCategory = require("../models/subCategory");
const Product = require("../models/product");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const data = await new SubCategory({
      name,
      parent,
      slug: trSlugify(name),
    }).save();
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await SubCategory.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.read = async (req, res) => {
  try {
    const sub_category = await SubCategory.findOne({ slug: req.params.slug });
    const products = await Product.find({ sub_categories: sub_category })
      .populate("category")
      .exec();
    res.json({
      sub_category,
      products,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.update = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const data = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: trSlugify(name) },
      { new: true }
    );
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await SubCategory.findOneAndDelete({ slug: req.params.slug });
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
};
