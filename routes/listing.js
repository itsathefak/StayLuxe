const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index route
router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,
  wrapAsync(listingController.createListing)
);

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search", wrapAsync(listingController.searchListings));

// Show route + Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // This will now include weather data
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);



module.exports = router;
