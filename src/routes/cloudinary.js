const router = require("express").Router();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "officialharsh",
  api_key: "799559244345516",
  api_secret: "9FpqMlr0KmQIwl5r9geIupQ_mtM",
});
router.get("/delete_image/*", async (req, res) => {
  try {
    const data = await cloudinary.uploader.destroy(req.params[0]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
