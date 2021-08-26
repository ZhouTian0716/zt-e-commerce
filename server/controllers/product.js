const translation = require('transliteration');
const trSlugify = translation.slugify;
const Product = require('../models/product.js');

exports.create = async (req, res) => {
    try {
        // console.log(req.body);
        req.body.slug = trSlugify(req.body.title);
        const newProduct = await new Product( req.body ).save();
        res.json(newProduct);
    } catch(err){
        console.log(err);
        // res.status(400).send(err)
        res.status(400).json({
            err: err.message
        })
    }
};

