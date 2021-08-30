const translation = require("transliteration");
const trSlugify = translation.slugify;
const Product = require("../models/product.js");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = trSlugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send(err)
    res.status(400).json({
      err: err.message,
    });
  }
};

// Note here: populate('sub_categories') key here is the one in productSchema.sub_categories
exports.listAll = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("sub_categories")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(products);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.read = async (req, res) => {
  try {
    const data = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("sub_categories")
      .exec();
    res.json(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    res.status(400).send(err);
  }
};
