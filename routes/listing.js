const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const axios = require('axios');

const geocodeListing = async (req, res, next) => {
  const mapToken = process.env.MAP_TOKEN;
  const geoCodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(req.body.listing.location + ', ' + req.body.listing.country)}.json?key=${mapToken}`;

  try {
    const geoData = await axios.get(geoCodingUrl);
    if (geoData.data && geoData.data.features && geoData.data.features.length > 0) {
      req.body.listing.geometry = {
        type: "Point",
        coordinates: geoData.data.features[0].geometry.coordinates,
      };
    } else {
      // Handle the case where no location is found
      throw new Error("Geocoding failed for the provided location.");
    }
    next();
  } catch (error) {
    console.error("Geocoding Error:", error);
    req.flash("error", "Geocoding service failed, please try again.");
    res.redirect("/listings/new");
  }
};

// Index + Create
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    geocodeListing, // First, geocode the location
    validateListing, // Then validate the data, including geometry
    wrapAsync(listingController.createLisitng)
  );

// New form
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// Show + Update + Delete
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    geocodeListing,
    validateListing,
    wrapAsync(listingController.updateLisitng)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteLisitng));

// Edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;