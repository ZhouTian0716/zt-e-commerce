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

// Searching product
exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, sub_category, shipping, brand, color} = req.body;
  if (query) {
    console.log("query --->", query);
    await handleQuery(req, res, query);
  }
  // make sure to send price as [20, 200] from front end
  if (price !== undefined) {
    console.log("price --->", price);
    await handlePrice(req, res, price);
  }
  if (category) {
    console.log("category --->", category);
    await handleCategory(req, res, category);
  }
  if (stars) {
    console.log("stars --->", stars);
    await handleStar(req, res, stars);
  }
  if (sub_category) {
    console.log("sub_category --->", sub_category);
    await handleSub(req, res, sub_category);
  }
  if (shipping) {
    console.log("shipping --->", shipping);
    await handleShipping(req, res, shipping);
  }
  if (color) {
    console.log("color --->", color);
    await handleColor(req, res, color);
  }
  if (brand) {
    console.log("brand --->", brand);
    await handleBrand(req, res, brand);
  }
};

// Handling Functions
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("sub_categories", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("sub_categories", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("sub_categories", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const handleStar = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        // create average
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("AGGREGATE ERROR", err);
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("sub_categories", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("PRODUCT AGGREGATE ERROR", err);
          res.json(products);
        });
    });
};

const handleSub = async (req, res, sub_category) => {
  try {
    let products = await Product.find({ sub_categories: sub_category })
      .populate("category", "_id name")
      .populate("sub_categories", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const handleShipping = async (req, res, shipping) => {
  try {
    let products = await Product.find({ shipping })
      .populate("category", "_id name")
      .populate("sub_categories", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const handleColor = async (req, res, color) => {
  try {
    let products = await Product.find({ color })
      .populate("category", "_id name")
      .populate("sub_categories", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const handleBrand = async (req, res, brand) => {
  try {
    let products = await Product.find({ brand })
      .populate("category", "_id name")
      .populate("sub_categories", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};