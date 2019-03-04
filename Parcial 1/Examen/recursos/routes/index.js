const express = require("express");
const router = express.Router();
const archivos = require('fs');

// Instagram API
const Instagram = require("node-instagram").default;
const { clientId, clientSecret } = require("../keys").instagram;

const instagram = new Instagram({
  clientId: clientId,
  clientSecret: clientSecret
});
const redirectUri = "http://localhost:3000/auth";

// auth para el usuario
router.get("/auth/instagram", (req, res) => {
  res.redirect(
    instagram.getAuthorizationUrl(redirectUri, {
      // datos a obtener
      scope: ["basic", "likes"],
      
      state: "your state"
    })
  );
});

// Autorizacion
router.get("/auth", async (req, res) => {
  try {
    
    const code = req.query.code;
    const data = await instagram.authorizeUser(code, redirectUri);
    
    // res.json(data);
    // console.log(data);
    
    req.session.access_token = data.access_token;
    req.session.user_id = data.user.id;

    instagram.config.accessToken = req.session.access_token;
    console.log(instagram);
    res.redirect("/profile");
  } catch (err) {
    res.json(err);
  }
});

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/profile", async (req, res) => {
  try {
    const profileData = await instagram.get("users/self");
    const media = await instagram.get('users/self/media/recent');
    console.log(profileData);
    res.render("profile", { user: profileData.data, posts: media.data});
    //Guardamos el json del usuario
    archivos.writeFileSync('usuarios.json', JSON.stringify(profileData));
  } catch (err) {
    console.log(err);
    console.log('Hubo un error al escribir en el archivo')
                  console.log(error);
  }
});

router.get("/login", (req, res) => {
  res.redirect("/auth/instagram");
});

router.get("/logout", (req, res) => {
  delete req.session.access_token;
  delete req.session.user_id;
  res.redirect("/");
});

module.exports = router;
