const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../Models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing does not Exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not Exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data for Listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Lisitng Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Lisitng Deleted!");
    res.redirect("/listings");
  })
);

// Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Lisitng Created!");
    res.redirect("/listings");
  })
);

module.exports = router;
