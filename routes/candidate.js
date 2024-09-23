const express = require("express");
const fileUpload = require("express-fileupload");
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");

const Candidate = require("../models/Candidate");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post(
  "/create",
  isAuthenticated,
  isAdmin,
  fileUpload(),
  async (req, res) => {
    try {
      // console.log(req.headers.adminheader);
      // console.log(req.headers.adminheader === process.env.ADMIN_ID);
      const { surname, name, description, performances } = req.body;
      let candidate = new Candidate({
        can_surname: surname,
        can_name: name,
        can_description: description,
        performances: performances,
      });
      await candidate.save();
      // console.log(req.files);
      if (req.files) {
        if (Array.isArray(req.files.picture)) {
          //     //En fonction du nombres de fichiers, req.files.picture est un tableau ou un objet. Le cas tableau ne peut correspondre qu'à une requête en lien avec les photos d'une offre
          for (let i = 0; i <= req.files.picture.length - 1; i++) {
            const pictureConverted = convertToBase64(req.files.picture[i]);
            const result = await cloudinary.uploader.upload(pictureConverted, {
              folder: `/projet-final/candidates/${candidate._id}`,
            });
            candidate.can_pics.push(result);
          }
        } else {
          //     //Si req.files.picture n'est pas un tableau, c'est un objet qui peut correspondre à une requête user ou offer
          //   console.log("on est bien dans la boucle");
          const pictureConverted = convertToBase64(req.files.picture);
          //   console.log(pictureConverted);
          //   console.log("on a bien passé le picture converted");

          //   console.log(candidate._id);
          const result = await cloudinary.uploader.upload(pictureConverted, {
            folder: `/projet-final/candidates/${candidate._id.valueOf()}`,
          });
          //   console.log("result post cloudinary", result);
          //   console.log(candidate.can_pics);
          candidate.can_pics.push(result);
        }
        await candidate.save();
        res.json({ message: "Le candidat a bien été rajouté à la liste" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/list", async (req, res) => {
  try {
    const response = await Candidate.find();
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
