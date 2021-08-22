const slugify = require('slugify');
const Category = require('../models/category');

exports.create = async (req, res) => {
    try {
        // console.log(req.body);
        const { name } =req.body;
        const category = await new Category({ name, slug:slugify(name) }).save();
        res.json(category);
    } catch(err){
        // console.log(err);
        res.status(400).send(err)
    }
};

exports.list = async (req, res) => {
    try {
        res.json( await Category.find({}).sort({ createdAt: -1 }).exec() );
    } catch(err){
        res.status(400).send(err)
    }
};

exports.read = async (req, res) => {
    try {
        const categoryData = await Category.findOne({ slug: req.params.slug });
        res.json(categoryData);
    } catch(err){
        res.status(400).send(err)
    }
};

exports.update = async (req, res) => {
    try {
        // console.log(req.body);
        const { name } =req.body;
        const categoryData = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug:slugify(name) },
            { new: true }
        );
        res.json(categoryData);
    } catch(err){
        res.status(400).send(err)
    }
};

exports.remove = async (req, res) => {
    try {
        const categoryData = await Category.findOneAndDelete({ slug: req.params.slug });
        res.json(`Item deleted by slug : ${categoryData.slug}`);
        
    } catch(err){
        res.status(400).send(err)
    }
};
