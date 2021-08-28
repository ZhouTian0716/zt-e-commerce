const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  try {
    console.log(req.body);
    let result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });
    res.json({
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.remove = (req, res) => {
  console.log(req.body);
  let image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, message: err });
    res.send("Image Deleted");
  });
};
