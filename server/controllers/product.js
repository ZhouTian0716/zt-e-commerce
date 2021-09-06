const translation = require("transliteration");
const trSlugify = translation.slugify;
const Product = require("../models/product.js");
const User = require("../models/user.js");

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

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = trSlugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR ----> ", err);
    // res.status(400).send("PRODUCT UPDATE ERROR");
    res.status(400).json({ err: err.message });
  }
};

// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("sub_categories")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err);
//   }
// };

//With Pagination
exports.list = async (req, res) => {
  // console.log(req.body);
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("sub_categories")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;
    // who is updating?
    // check if currently logged in user made rating before?
    let existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );
    console.log(existingRatingObject);
    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { "ratings.$.star": star } },
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

//listRelated
exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("postedBy")
    .populate("sub_categories")
    .exec();
  res.json(related);
  // console.log(related.length);
};
