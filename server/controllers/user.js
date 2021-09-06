const User = require('../models/user');

exports.list = async (req, res) => {
    try {
      res.json(await User.find({}).sort({ createdAt: -1 }).exec());
    } catch (err) {
      res.status(400).send(err);
    }
};